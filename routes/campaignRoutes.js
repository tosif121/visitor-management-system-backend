const express = require('express');
const {
  campaignSaveData,
  getAllData,
  updateCampaignData,
  deleteCampaignData,
} = require('../controllers/campaignController');
const {
  campaignAgentData,
  getCampaignAgentData,
  updateCampaignAgentData,
  deleteCampaignAgentData,
} = require('../controllers/campaignAgentController');

const router = express.Router();
//admin
router.post('/campaign', campaignSaveData);
router.get('/campaign', getAllData);
router.post('/campaign-update/:id', updateCampaignData);
router.post('/campaign-delete/:id', deleteCampaignData);

// agent
router.post('/campaign-agent', campaignAgentData);
router.get('/campaign-agent', getCampaignAgentData);
router.post('/campaign-agent-update/:id', updateCampaignAgentData);
router.post('/campaign-agent-delete/:id', deleteCampaignAgentData);
module.exports = router;
