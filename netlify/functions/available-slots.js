const { connectDB } = require('./utils/database');
const Appointment = require('./models/Appointment');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
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
    // Connect to database
    await connectDB();

    // Extract date from path
    const path = event.path;
    const pathSegments = path.split('/').filter(segment => segment);
    const date = pathSegments[pathSegments.length - 1]; // Last segment should be the date

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        })
      };
    }

    const availableSlots = await Appointment.findAvailableSlots(date);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          date,
          availableSlots,
          totalSlots: 6,
          availableCount: availableSlots.length
        }
      })
    };

  } catch (error) {
    console.error('Error fetching available slots:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch available slots',
        error: error.message
      })
    };
  }
}; 