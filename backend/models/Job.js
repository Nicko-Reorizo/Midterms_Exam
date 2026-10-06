const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
      maxlength: [150, 'Job location cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [3000, 'Job description cannot exceed 3000 characters'],
    },
    requirements: {
      type: String,
      required: [true, 'Job requirements are required'],
      trim: true,
      maxlength: [3000, 'Job requirements cannot exceed 3000 characters'],
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
