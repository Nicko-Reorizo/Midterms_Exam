const express = require('express');
const router = express.Router();
const applicationController = require('../controller/applicationController');
const { validateApplication } = require('../validator/applicationValidator');

// POST /api/applications
// Flow: Validate data -> Pass to Controller
router.post('/', validateApplication, applicationController.applyForJob);
// [APPLY-BE-03] GET /api/applications/my-applications - Get all my applications
router.get('/my-applications', applicationController.getMyApplications);
// [APPLY-BE-04] PUT /api/applications/:applicationId/status - Update application status
router.put('/:applicationId/status', validateStatusUpdate, applicationController.updateStatus);
module.exports = router;