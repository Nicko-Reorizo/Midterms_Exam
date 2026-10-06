const Application = require('../models/Application');

// [APPLY-BE-02] Create new application logic
const createApplication = async (applicantId, jobId, resumeLink, coverLetter) => {
  // [APPLY-BE-05] Pre-check for duplicate (faster than waiting for the index error)
  const existingApplication = await Application.findOne({ applicantId, jobId });
  if (existingApplication) {
    const error = new Error('Duplicate Application');
    error.code = 11000; // Simulate MongoDB's duplicate error for the controller
    throw error;
  }

  const newApplication = new Application({
    applicantId,
    jobId,
    resumeLink,
    coverLetter
  });
  
  return await newApplication.save();
};

// [APPLY-BE-03] Get all applications for a specific applicant
const getApplicationsByApplicant = async (applicantId) => {
  return await Application.find({ applicantId })
    .populate('jobId', 'title company location salary') 
    .sort({ createdAt: -1 });
};

// [APPLY-BE-04] Update the status of an application
const updateApplicationStatus = async (applicationId, status) => {
  return await Application.findByIdAndUpdate(
    applicationId,
    { status },
    { new: true, runValidators: true }
  ).populate('jobId', 'title company');
};

module.exports = {
  createApplication,
  getApplicationsByApplicant,
  updateApplicationStatus
};