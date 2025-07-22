const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple in-memory admin authentication for now
// In production, this should use a proper User model with database storage
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '$2a$10$yO8w.2sHdXTv3tdAQgFbr.C.owWFDiRo5LiRTSm2LAzcGsjoY91m2', // hashed: flexwell2024
  role: 'admin'
};

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check if username matches
    if (username !== ADMIN_CREDENTIALS.username) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token
    const payload = {
      username: ADMIN_CREDENTIALS.username,
      role: ADMIN_CREDENTIALS.role,
      iat: Date.now()
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'flexwell-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          username: ADMIN_CREDENTIALS.username,
          role: ADMIN_CREDENTIALS.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// @route   POST /api/auth/verify
// @desc    Verify admin token
// @access  Private
router.post('/verify', async (req, res) => {
  try {
    const token = req.header('x-auth-token') || req.body.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flexwell-secret-key');
      
      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          user: {
            username: decoded.username,
            role: decoded.role
          }
        }
      });
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token verification',
      error: error.message
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided'
      });
    }

    // Verify token
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'flexwell-secret-key');
    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, ADMIN_CREDENTIALS.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // In a real application, you would update the database here
    // For now, we'll just return success (password change would require server restart)
    console.log('New hashed password (update ADMIN_CREDENTIALS):', hashedPassword);

    res.json({
      success: true,
      message: 'Password change request received. Contact system administrator to complete the change.'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change',
      error: error.message
    });
  }
});

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'flexwell-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// @route   GET /api/auth/profile
// @desc    Get admin profile
// @access  Private
router.get('/profile', verifyAdmin, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        username: req.user.username,
        role: req.user.role
      }
    }
  });
});

module.exports = router; 