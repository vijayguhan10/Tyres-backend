const express = require('express');
const router = express.Router();
const ReportController = require('../../Controllers/admin/Report.controller');
router.get('/tyre-requests', ReportController.getAllTyreRequestsReport);
router.get('/appointments', ReportController.getAllAppointmentsReport);
router.get('/tyre-requests/status-analytics', ReportController.getTyreRequestStatusAnalytics);
router.get('/appointments/per-day-analytics', ReportController.getAppointmentsPerDayAnalytics);
module.exports = router;