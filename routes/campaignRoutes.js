const express = require('express');
const { campaignSaveData, getAllData } = require('../controllers/campaignController');
const { campaignAgentData, getData } = require('../controllers/campaignAgentController');

const router = express.Router();

router.post('/campaign', campaignSaveData);
router.get('/campaign', getAllData);

router.post('/campaign-agent', campaignAgentData);
router.get('/campaign-agent-list', getData);

module.exports = router;
