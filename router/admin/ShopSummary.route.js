const express = require('express');
const router = express.Router();
const shopController = require('../../Controllers/admin/ShopSummary.controller');

// Get all shops
router.get('/shops', shopController.getAllShops);

// Get revenue summary of all shops
router.get('/shops/revenue-summary', shopController.getRevenueSummary);

// Get tyre stock report
router.get('/tyres/stock-report', shopController.getTyreStockReport);

module.exports = router;