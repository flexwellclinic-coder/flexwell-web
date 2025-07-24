const { connectDB } = require('./utils/database');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Test environment variables
    const mongoUri = process.env.MONGODB_URI;
    const jwtSecret = process.env.JWT_SECRET;

    console.log('Environment check:', {
      mongoUri: mongoUri ? 'SET' : 'MISSING',
      jwtSecret: jwtSecret ? 'SET' : 'MISSING'
    });

    // Test database connection
    await connectDB();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Database connection successful!',
        environment: {
          mongoUri: mongoUri ? 'SET' : 'MISSING',
          jwtSecret: jwtSecret ? 'SET' : 'MISSING'
        },
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Connection test failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Database connection failed',
        error: error.message,
        environment: {
          mongoUri: process.env.MONGODB_URI ? 'SET' : 'MISSING',
          jwtSecret: process.env.JWT_SECRET ? 'SET' : 'MISSING'
        }
      })
    };
  }
}; 