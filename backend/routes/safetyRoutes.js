const express = require('express');
const router = express.Router();
const { addSafetyInfo, getAllSafety, updateSafetyInfo, deleteSafetyInfo } = require('../controllers/safetyController');

router.post('/', addSafetyInfo);

router.get('/', getAllSafety);

router.put('/:id', updateSafetyInfo);

router.delete('/:id', deleteSafetyInfo);

module.exports = router;
