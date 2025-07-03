const mongoose = require('mongoose');

const RehearsalSchema = new mongoose.Schema(
  {
    bandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Band',
      required: [true, 'Band ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the rehearsal'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    startTime: {
      type: Date,
      required: [true, 'Please provide a start time'],
    },
    endTime: {
      type: Date,
      required: [true, 'Please provide an end time'],
      validate: {
        validator: function(value) {
          return value > this.startTime;
        },
        message: 'End time must be after start time',
      },
    },
    venue: {
      name: {
        type: String,
        required: [true, 'Please provide a venue name'],
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      coordinates: {
        lat: {
          type: Number,
          min: -90,
          max: 90,
        },
        lng: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'biweekly', 'monthly'],
        default: 'weekly',
      },
      interval: {
        type: Number,
        default: 1,
        min: 1,
      },
      daysOfWeek: {
        type: [Number],
        validate: {
          validator: function(values) {
            return values.every(val => val >= 0 && val <= 6);
          },
          message: 'Days of week must be between 0-6 (Sunday-Saturday)',
        },
      },
      endDate: {
        type: Date,
      },
      count: {
        type: Number,
        min: 1,
      },
    },
    songs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    }],
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendance: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['confirmed', 'declined', 'pending'],
        default: 'pending',
      },
      response: {
        type: String,
        trim: true,
      },
      respondedAt: {
        type: Date,
      },
    }],
    isCancelled: {
      type: Boolean,
      default: false,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
    reminderSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for efficient queries
RehearsalSchema.index({ bandId: 1, startTime: 1 });
RehearsalSchema.index({ 'attendance.userId': 1, startTime: 1 });

// Virtual for attendance counts
RehearsalSchema.virtual('attendanceCounts').get(function() {
  const confirmed = this.attendance.filter(a => a.status === 'confirmed').length;
  const declined = this.attendance.filter(a => a.status === 'declined').length;
  const pending = this.attendance.filter(a => a.status === 'pending').length;
  
  return {
    confirmed,
    declined,
    pending,
    total: this.attendance.length,
  };
});

// Duration in minutes
RehearsalSchema.virtual('durationMinutes').get(function() {
  if (!this.startTime || !this.endTime) return 0;
  return Math.round((this.endTime - this.startTime) / (1000 * 60));
});

// Method to check if user is allowed to modify this rehearsal
RehearsalSchema.methods.canBeModifiedBy = async function(userId) {
  // If user created the rehearsal
  if (this.createdBy.toString() === userId.toString()) {
    return true;
  }
  
  // If user is band admin
  const Band = mongoose.model('Band');
  const band = await Band.findById(this.bandId);
  
  if (!band) return false;
  
  const member = band.members.find(m => 
    m.userId.toString() === userId.toString() && m.role === 'admin'
  );
  
  return !!member;
};

module.exports = mongoose.model('Rehearsal', RehearsalSchema);