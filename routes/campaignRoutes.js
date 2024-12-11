const express = require('express');
const { campaignSaveData, getAllData } = require('../controllers/campaignController');

const router = express.Router();

router.post('/campaign', campaignSaveData);
router.get('/campaign', getAllData);

module.exports = router;
