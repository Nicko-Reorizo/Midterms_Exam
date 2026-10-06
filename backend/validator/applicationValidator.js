const { body, param } = require('express-validator');


const validateApplication = [
  body('jobId')
    .notEmpty().withMessage('Job ID is required')
    .isMongoId().withMessage('Invalid Job ID format'),
  body('resumeLink')
    .notEmpty().withMessage('Resume link is required')
    .isURL().withMessage('Resume must be a valid URL'),
  body('coverLetter')
    .optional()
    .isString().withMessage('Cover letter must be text')
];

// [APPLY-BE-04] Validator for updating status
const validateStatusUpdate = [
  param('applicationId')
    .isMongoId().withMessage('Invalid Application ID format'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'Reviewed', 'Accepted', 'Rejected'])
    .withMessage('Status must be Pending, Reviewed, Accepted, or Rejected')
];

module.exports = { validateApplication, validateStatusUpdate };