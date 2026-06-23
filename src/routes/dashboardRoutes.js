const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, restrictTo('admin'));

router.get('/kpis', dashboardController.getKPIs);
router.get('/sales', dashboardController.getSalesAnalytics);

module.exports = router;
