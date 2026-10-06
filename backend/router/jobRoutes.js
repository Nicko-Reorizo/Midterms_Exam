const express = require('express');
const jobController = require('../controller/jobController');

const router = express.Router();

router.get('/search', jobController.searchJobs);
router.get('/', jobController.getJobs);

module.exports = router;
