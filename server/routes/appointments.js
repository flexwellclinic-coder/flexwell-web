const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// @route   GET /api/appointments
// @desc    Get all appointments with optional filtering
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
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
    } = req.query;

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

    res.json({
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
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment by ID
// @access  Public (should be protected in production)
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
});

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Public
router.post('/', async (req, res) => {
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
    } = req.body;

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
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

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: savedAppointment
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Public (should be protected in production)
router.put('/:id', async (req, res) => {
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
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // If changing date/time, check availability
    if ((date && date !== appointment.date) || (time && time !== appointment.time)) {
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        date: date || appointment.date,
        time: time || appointment.time,
        status: { $in: ['pending', 'confirmed'] }
      });

      if (existingAppointment) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked'
        });
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

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Public (should be protected in production)
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/available/:date
// @desc    Get available time slots for a specific date
// @access  Public
router.get('/available/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const availableSlots = await Appointment.findAvailableSlots(date);

    res.json({
      success: true,
      data: {
        date,
        availableSlots,
        totalSlots: 6,
        availableCount: availableSlots.length
      }
    });

  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots',
      error: error.message
    });
  }
});

// @route   PATCH /api/appointments/:id/status
// @desc    Update appointment status only
// @access  Public (should be protected in production)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      data: updatedAppointment
    });

  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: error.message
    });
  }
});

module.exports = router; 