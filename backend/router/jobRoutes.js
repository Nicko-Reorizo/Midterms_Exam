const express = require('express');
const jobController = require('../controller/jobController');
const {
    validateJobId,
    validateJobSearch,
    handleValidationErrors,
} = require('../validator/jobValidator');

const router = express.Router();

router.get('/search', validateJobSearch, handleValidationErrors, jobController.searchJobs);
router.get('/:id', validateJobId, handleValidationErrors, jobController.getJobById);
router.get('/', jobController.getJobs);

module.exports = router;
