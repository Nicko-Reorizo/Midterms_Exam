const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant', // Must match the exact name of Dev 3's Applicant model
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Must match the exact name of Dev 4's Job model
    required: true
  },
  resumeLink: {
    type: String,
    required: true // Will be a URL from Cloudinary/AWS
  },
  coverLetter: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

// [APPLY-BE-05] Prevent duplicate applications
ApplicationSchema.index({ applicantId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);