const express = require('express');
const { getOrderSummaryByDateForMonth } = require('../../Controllers/admin/OrderSummaryByDate.controller');

const router = express.Router();

// Get order summary by date
router.get('/order-summary-by-date', getOrderSummaryByDateForMonth);

module.exports = router;