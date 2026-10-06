const { body } = require('express-validator');

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

module.exports = { validateApplication };