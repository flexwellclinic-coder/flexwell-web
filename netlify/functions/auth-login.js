const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple in-memory admin authentication
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '$2a$10$yO8w.2sHdXTv3tdAQgFbr.C.owWFDiRo5LiRTSm2LAzcGsjoY91m2', // hashed: flexwell2024
  role: 'admin'
};

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      })
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    // Validate input
    if (!username || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Please provide username and password'
        })
      };
    }

    // Check if username matches
    if (username !== ADMIN_CREDENTIALS.username) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        })
      };
    }

    // Check password
    const isMatch = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
    
    if (!isMatch) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        })
      };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            username: ADMIN_CREDENTIALS.username,
            role: ADMIN_CREDENTIALS.role
          }
        }
      })
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Server error during login',
        error: error.message
      })
    };
  }
}; 