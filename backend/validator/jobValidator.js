const { body, param, query, validationResult } = require('express-validator');

const validateJobInformation = [
  body('title')
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 100 }).withMessage('Job title cannot exceed 100 characters'),
  body('company')
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
  body('location')
    .notEmpty().withMessage('Job location is required')
    .isLength({ max: 150 }).withMessage('Job location cannot exceed 150 characters'),
  body('description')
    .notEmpty().withMessage('Job description is required')
    .isLength({ max: 3000 }).withMessage('Job description cannot exceed 3000 characters'),
  body('requirements')
    .notEmpty().withMessage('Job requirements are required')
    .isLength({ max: 3000 }).withMessage('Job requirements cannot exceed 3000 characters'),
  body('salary')
    .optional()
    .isFloat({ min: 0 }).withMessage('Salary cannot be negative'),
  body('jobType')
    .optional()
    .isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'])
    .withMessage('Invalid job type'),
  body('status')
    .optional()
    .isIn(['Open', 'Closed'])
    .withMessage('Invalid job status'),
];

const validateJobId = [
  param('id')
    .notEmpty().withMessage('Job ID is required')
    .isMongoId().withMessage('Invalid Job ID format'),
];

const validateJobSearch = [
  query('q')
    .optional()
    .isLength({ max: 100 }).withMessage('Search keyword cannot exceed 100 characters'),
  query('keyword')
    .optional()
    .isLength({ max: 100 }).withMessage('Search keyword cannot exceed 100 characters'),
  query('search')
    .optional()
    .isLength({ max: 100 }).withMessage('Search keyword cannot exceed 100 characters'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  validateJobInformation,
  validateJobId,
  validateJobSearch,
  handleValidationErrors,
};
