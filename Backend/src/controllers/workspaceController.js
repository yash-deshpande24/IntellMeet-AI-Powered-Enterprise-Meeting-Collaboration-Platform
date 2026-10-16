import Workspace from '../models/Workspace.js';
import Task from '../models/Task.js';

export const getWorkspaces = async (req, res) => {
  try {
    let workspaces = await Workspace.find().populate('owner', 'name email avatar');

    if (workspaces.length === 0) {
      // Create initial workspace default
      const defaultWorkspace = await Workspace.create({
        name: 'Enterprise Core Workspace',
        description: 'Primary cross-functional product, AI engineering, and release workspace.',
        owner: req.user._id || req.user.id,
        color: '#4f46e5',
        icon: 'Sparkles',
        isDefault: true,
        members: [{
          user: req.user._id || req.user.id,
          role: 'Owner',
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar
        }]
      });
      workspaces = [defaultWorkspace];
    }

    res.status(200).json({
      success: true,
      workspaces
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createWorkspace = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    const workspace = await Workspace.create({
      name: name || 'New Team Workspace',
      description: description || '',
      color: color || '#3b82f6',
      icon: icon || 'Briefcase',
      owner: req.user._id || req.user.id,
      members: [{
        user: req.user._id || req.user.id,
        role: 'Owner',
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      workspace
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
