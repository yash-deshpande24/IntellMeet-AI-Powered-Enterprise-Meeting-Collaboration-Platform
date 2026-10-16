import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  // Support demo evaluation tokens
  if (token.startsWith('demo-')) {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(401).json({
        success: false,
        message: 'Demo tokens are disabled in production.'
      });
    }

    const isMember = token.includes('member');
    let demoUser = await User.findOne({ email: isMember ? 'member@intellmeet.io' : 'admin@intellmeet.io' });
    
    if (!demoUser) {
      demoUser = await User.findOne();
    }

    if (demoUser) {
      req.user = demoUser;
      return next();
    }

    // In-memory fallback
    req.user = {
      _id: isMember ? '65f000000000000000000002' : '65f000000000000000000001',
      id: isMember ? '65f000000000000000000002' : '65f000000000000000000001',
      name: isMember ? 'Alex Rivera' : 'Sarah Connor',
      email: isMember ? 'member@intellmeet.io' : 'admin@intellmeet.io',
      role: isMember ? 'Member' : 'Admin',
      department: isMember ? 'Platform Architecture' : 'Executive Engineering',
      title: isMember ? 'Lead Distributed Systems Engineer' : 'VP of Engineering',
      avatar: isMember ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;
    
    if (decoded.id && decoded.id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(decoded.id).select('-password');
    } else if (decoded.email) {
      user = await User.findOne({ email: decoded.email }).select('-password');
    }

    if (!user) {
      req.user = {
        _id: decoded.id || '65f000000000000000000001',
        id: decoded.id || '65f000000000000000000001',
        name: decoded.name || 'Enterprise User',
        email: decoded.email || 'user@intellmeet.io',
        role: decoded.role || 'Member',
        avatar: decoded.avatar || '',
        department: decoded.department || 'Engineering'
      };
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    // If token format mismatch but payload exists
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message
    });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role || 'Guest'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};
