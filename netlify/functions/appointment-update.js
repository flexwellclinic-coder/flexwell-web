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
    const { id, date, time, service, status, notes, adminNotes } = data;

    if (!id) {
      return {
        statusCode: 400, headers,
        body: JSON.stringify({ success: false, message: 'Appointment ID is required' })
      };
    }

    // Find the appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return {
        statusCode: 404, headers,
        body: JSON.stringify({ success: false, message: 'Appointment not found' })
      };
    }

    // If changing date/time, check availability
    const newDate = date || appointment.date;
    const newTime = time || appointment.time;

    if ((date && date !== appointment.date) || (time && time !== appointment.time)) {
      const conflict = await Appointment.findOne({
        _id: { $ne: appointment._id },
        date: newDate,
        time: newTime,
        status: { $in: ['pending', 'confirmed'] }
      });

      if (conflict) {
        return {
          statusCode: 400, headers,
          body: JSON.stringify({ success: false, message: 'This time slot is already booked. Please choose another time.' })
        };
      }
    }

    // Update fields (only if provided)
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (service) appointment.service = service;
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    if (adminNotes !== undefined) appointment.adminNotes = adminNotes;

    const updated = await appointment.save();

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        success: true,
        message: 'Appointment updated successfully',
        data: updated
      })
    };

  } catch (error) {
    console.error('Appointment update error:', error);

    if (error.name === 'ValidationError') {
      return {
        statusCode: 400, headers,
        body: JSON.stringify({
          success: false,
          message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
        })
      };
    }

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
