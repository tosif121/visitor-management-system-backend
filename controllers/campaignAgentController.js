const Data = require('../models/campaignAgentModel');

const campaignAgentData = async (req, res) => {
  try {
    const requestData = req.body;

    if (Object.keys(requestData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Request body cannot be empty.',
      });
    }

    const newData = new Data({ data: requestData });
    await newData.save();

    res.status(200).json({
      status: true,
      message: 'Campaign data saved successfully.',
      data: newData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getData = async (req, res) => {
  try {
    const allData = await Data.find();
    res.status(200).json({
      status: true,
      message: 'Data retrieved successfully.',
      data: allData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = { campaignAgentData, getData };
