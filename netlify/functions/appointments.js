const { connectDB } = require('./utils/database');
const Appointment = require('./models/Appointment');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

  try {
    // Connect to database
    await connectDB();

    // Parse the path to handle different operations
    const path = event.path;
    const pathSegments = path.split('/').filter(segment => segment);
    const appointmentId = pathSegments[pathSegments.length - 1];

    switch (event.httpMethod) {
      case 'GET':
        // If there's an ID in the path, get single appointment
        if (appointmentId && appointmentId !== 'appointments') {
          return await getSingleAppointment(appointmentId, headers);
        }
        // Otherwise get all appointments with filtering
        return await getAllAppointments(event.queryStringParameters || {}, headers);

      case 'POST':
        return await createAppointment(JSON.parse(event.body), headers);

      case 'PUT':
        if (!appointmentId || appointmentId === 'appointments') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Appointment ID is required'
            })
          };
        }
        return await updateAppointment(appointmentId, JSON.parse(event.body), headers);

      case 'DELETE':
        if (!appointmentId || appointmentId === 'appointments') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              success: false,
              message: 'Appointment ID is required'
            })
          };
        }
        return await deleteAppointment(appointmentId, headers);

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Method not allowed'
          })
        };
    }

  } catch (error) {
    console.error('Appointments function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message
      })
    };
  }
};

// Get all appointments with filtering
async function getAllAppointments(queryParams, headers) {
  try {
    const { 
      status, 
      date, 
      startDate, 
      endDate, 
      search, 
      page = 1, 
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = queryParams;

    // Build filter object
    let filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (date) {
      filter.date = date;
    }
    
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const appointments = await Appointment
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Appointment.countDocuments(filter);

    // Calculate statistics
    const stats = await Appointment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: appointments,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        },
        stats: {
          total,
          ...statusCounts
        }
      })
    };

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch appointments',
        error: error.message
      })
    };
  }
}

// Get single appointment
async function getSingleAppointment(id, headers) {
  try {
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Appointment not found'
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: appointment
      })
    };

  } catch (error) {
    console.error('Error fetching appointment:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch appointment',
        error: error.message
      })
    };
  }
}

// Create new appointment
async function createAppointment(data, headers) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      service,
      notes,
      previousInjury,
      createdBy = 'patient'
    } = data;

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'This time slot is already booked'
        })
      };
    }

    // Create new appointment
    const appointment = new Appointment({
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      service,
      notes,
      previousInjury,
      createdBy
    });

    const savedAppointment = await appointment.save();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Appointment created successfully',
        data: savedAppointment
      })
    };

  } catch (error) {
    console.error('Error creating appointment:', error);
    console.error('Error details:', error.message);
    console.error('Received data:', data);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      console.error('Validation errors:', validationErrors);
      
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Validation error',
          errors: validationErrors,
          receivedData: data
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to create appointment',
        error: error.message,
        errorDetails: error.stack
      })
    };
  }
}

// Update appointment
async function updateAppointment(id, data, headers) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      service,
      status,
      notes,
      adminNotes,
      previousInjury
    } = data;

    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Appointment not found'
        })
      };
    }

    // If changing date/time, check availability
    if ((date && date !== appointment.date) || (time && time !== appointment.time)) {
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: id },
        date: date || appointment.date,
        time: time || appointment.time,
        status: { $in: ['pending', 'confirmed'] }
      });

      if (existingAppointment) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'This time slot is already booked'
          })
        };
      }
    }

    // Update fields
    if (firstName) appointment.firstName = firstName;
    if (lastName) appointment.lastName = lastName;
    if (email) appointment.email = email;
    if (phone) appointment.phone = phone;
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (service) appointment.service = service;
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    if (adminNotes !== undefined) appointment.adminNotes = adminNotes;
    if (previousInjury !== undefined) appointment.previousInjury = previousInjury;

    const updatedAppointment = await appointment.save();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Appointment updated successfully',
        data: updatedAppointment
      })
    };

  } catch (error) {
    console.error('Error updating appointment:', error);
    
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => err.message)
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to update appointment',
        error: error.message
      })
    };
  }
}

// Delete appointment
async function deleteAppointment(id, headers) {
  try {
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Appointment not found'
        })
      };
    }

    await Appointment.findByIdAndDelete(id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Appointment deleted successfully'
      })
    };

  } catch (error) {
    console.error('Error deleting appointment:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to delete appointment',
        error: error.message
      })
    };
  }
} 