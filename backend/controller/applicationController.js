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

module.exports = {
  applyForJob
};