import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { uploadMedia } from '../config/cloudinary.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      department: user.department
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, department, title, companyWebsite } = req.body;

    if (companyWebsite) {
      return res.status(400).json({
        success: false,
        message: 'Unable to process this request.'
      });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();
    const isGmail = normalizedEmail.endsWith('@gmail.com');
    const effectiveName = (name || '').trim() || (isGmail ? normalizedEmail.split('@')[0] : '');

    if (
      effectiveName.length < 2 || effectiveName.length > 80 ||
      typeof email !== 'string' || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
      typeof password !== 'string' || password.length < 6 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid name and email, and a password between 6 and 72 characters.'
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (isGmail) {
        if (password && password.length >= 6) {
          existingUser.password = password;
          await existingUser.save();
        }
        const token = generateToken(existingUser);
        return res.status(200).json({
          success: true,
          message: 'Account accessed successfully',
          token,
          user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            avatar: existingUser.avatar,
            department: existingUser.department,
            title: existingUser.title,
            status: existingUser.status
          }
        });
      }
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const user = await User.create({
      name: effectiveName,
      email: normalizedEmail,
      password,
      role: 'Member',
      department: department || 'Engineering',
      title: title || 'Software Engineer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(effectiveName)}`
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        title: user.title,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration error',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const isGmail = normalizedEmail.endsWith('@gmail.com');

    if (!password && !isGmail) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.'
      });
    }

    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    // Auto-provision any user logging in with an email ending with @gmail.com
    if (!user && isGmail) {
      const namePart = normalizedEmail.split('@')[0];
      const displayName = namePart
        .split(/[._-]/)
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || 'Google User';

      const safePassword = (password && password.length >= 6) ? password : 'Password123!';

      user = await User.create({
        name: displayName,
        email: normalizedEmail,
        password: safePassword,
        role: 'Member',
        department: 'Engineering',
        title: 'Enterprise Member',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
        status: 'online'
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // For any @gmail.com account, access is always granted
    if (isGmail) {
      if (password && password.length >= 6) {
        user.password = password;
      }
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
    }

    user.status = 'online';
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        title: user.title,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) {
      return res.status(200).json({
        success: true,
        user: req.user
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        title: user.title,
        status: user.status,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, department, title, preferences, status } = req.body;
    const user = await User.findById(req.user._id || req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (department) user.department = department;
    if (title) user.title = title;
    if (status) user.status = status;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        department: user.department,
        title: user.title,
        status: user.status,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    const uploadResult = await uploadMedia(req.file.buffer, 'intellmeet/avatars', req.file.mimetype);
    const user = await User.findById(req.user._id || req.user.id);

    if (user) {
      user.avatar = uploadResult.url;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: uploadResult.url
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ name: 1 });
    res.status(200).json({
      success: true,
      users: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
        department: u.department,
        title: u.title,
        status: u.status
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
