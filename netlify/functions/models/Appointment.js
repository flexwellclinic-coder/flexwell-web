const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: [5, 'Phone number must be at least 5 characters'],
    maxlength: [25, 'Phone number cannot exceed 25 characters']
  },
  date: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
  },
  time: {
    type: String,
    required: true,
    enum: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  },
  service: {
    type: String,
    required: true,
    enum: [
      'initial-consultation',
      'manual-therapy', 
      'exercise-therapy',
      'sports-rehab',
      'womens-health'
    ]
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  previousInjury: {
    type: Boolean,
    default: false
  },
  // Additional fields for tracking
  createdBy: {
    type: String,
    enum: ['patient', 'admin'],
    default: 'patient'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  // WhatsApp reminder tracking
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: {
    type: Date
  },
  reminderMessageId: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
appointmentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for formatted date and time
appointmentSchema.virtual('appointmentDateTime').get(function() {
  return `${this.date} at ${this.time}`;
});

// Index for efficient queries
appointmentSchema.index({ date: 1, time: 1 });
appointmentSchema.index({ email: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });

// Pre-save middleware to update the updatedAt field
appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set confirmation/completion timestamps based on status changes
  if (this.isModified('status')) {
    if (this.status === 'confirmed' && !this.confirmedAt) {
      this.confirmedAt = new Date();
    } else if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    }
  }
  
  next();
});

// Static method to find appointments by date range
appointmentSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1, time: 1 });
};

// Static method to find available time slots for a date
appointmentSchema.statics.findAvailableSlots = async function(date) {
  const allSlots = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const bookedSlots = await this.find({ 
    date: date, 
    status: { $in: ['pending', 'confirmed'] } 
  }).distinct('time');
  
  return allSlots.filter(slot => !bookedSlots.includes(slot));
};

// Instance method to cancel appointment
appointmentSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Instance method to confirm appointment
appointmentSchema.methods.confirm = function() {
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  return this.save();
};

// Instance method to complete appointment
appointmentSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Appointment', appointmentSchema); 