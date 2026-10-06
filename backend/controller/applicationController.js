const applicationService = require('../services/applicationService');
const { validationResult } = require('express-validator');

// [APPLY-BE-02] Apply for a Job
const applyForJob = async (req, res) => {
  // 1. Check for validation errors from the validator file
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // 2. Extract data from request
    // NOTE: For now, we are grabbing applicantId from req.body for testing.
    // Later, Dev 3 will provide auth middleware so we can use req.user.id instead.
    const { applicantId, jobId, resumeLink, coverLetter } = req.body;

    // 3. Call the service to save to DB
    const application = await applicationService.createApplication(
      applicantId, 
      jobId, 
      resumeLink, 
      coverLetter
    );

    // 4. Send success response
    res.status(201).json({ 
      message: 'Application submitted successfully', 
      application 
    });

  } catch (error) {
    // [APPLY-BE-05] Catch duplicate application error (MongoDB error code 11000)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }
    
    console.error('Apply Job Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// [APPLY-BE-03] Get My Applications
const getMyApplications = async (req, res) => {
  try {
    // NOTE: For now, we are grabbing applicantId from req.query for testing.
    // Later, Dev 3 will provide auth middleware so we can use req.user.id instead.
    const { applicantId } = req.query; 

    if (!applicantId) {
      return res.status(400).json({ message: 'Applicant ID is required' });
    }

    const applications = await applicationService.getApplicationsByApplicant(applicantId);
    
    res.status(200).json({ 
      count: applications.length,
      applications 
    });

  } catch (error) {
    console.error('Get Applications Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications
};