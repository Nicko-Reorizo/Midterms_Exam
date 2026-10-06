const Application = require('../models/Application');

// [APPLY-BE-02] Create new application logic
const createApplication = async (applicantId, jobId, resumeLink, coverLetter) => {
  const newApplication = new Application({
    applicantId,
    jobId,
    resumeLink,
    coverLetter
  });
  
  // Save to MongoDB
  return await newApplication.save();
};

// [APPLY-BE-03] Get all applications for a specific applicant
const getApplicationsByApplicant = async (applicantId) => {
  // .populate() replaces the jobId with the actual Job document data
  return await Application.find({ applicantId })
    .populate('jobId', 'title company location salary') 
    .sort({ createdAt: -1 }); // Newest applications first
};

// [APPLY-BE-04] Update the status of an application
const updateApplicationStatus = async (applicationId, status) => {
  return await Application.findByIdAndUpdate(
    applicationId,
    { status },
    { new: true, runValidators: true } // Return updated doc & run schema validation
  ).populate('jobId', 'title company');
};

module.exports = {
  createApplication,
  getApplicationsByApplicant,
  updateApplicationStatus
};