const express = require('express');
const { getDetailedReport } = require('../controllers/reportController');
const router = express.Router();

router.get('/detailed', getDetailedReport);

module.exports = router;
