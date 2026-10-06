const express = require('express');
const router = express.Router();
const applicationController = require('../controller/applicationController');
const { validateApplication } = require('../validator/applicationValidator');

// POST /api/applications
// Flow: Validate data -> Pass to Controller
router.post('/', validateApplication, applicationController.applyForJob);

module.exports = router;