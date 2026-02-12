const { connectDB } = require('./utils/database');
const Appointment = require('./models/Appointment');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405, headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed. Use POST.' })
    };
  }

  try {
    await connectDB();

    const data = JSON.parse(event.body);
    const { id } = data;

    if (!id) {
      return {
        statusCode: 400, headers,
        body: JSON.stringify({ success: false, message: 'Appointment ID is required' })
      };
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return {
        statusCode: 404, headers,
        body: JSON.stringify({ success: false, message: 'Appointment not found' })
      };
    }

    await Appointment.findByIdAndDelete(id);

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        message: 'Appointment deleted successfully'
      })
    };

  } catch (error) {
    console.error('Appointment delete error:', error);

    if (error.name === 'CastError') {
      return {
        statusCode: 400, headers,
        body: JSON.stringify({ success: false, message: 'Invalid appointment ID format' })
      };
    }

    return {
      statusCode: 500, headers,
      body: JSON.stringify({ success: false, message: 'Server error: ' + error.message })
    };
  }
};
