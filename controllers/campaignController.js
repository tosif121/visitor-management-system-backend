const Data = require('../models/campaignModel');

const campaignSaveData = async (req, res) => {
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

const getAllData = async (req, res) => {
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

const updateCampaignData = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: 'Campaign ID is required for update.',
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Update data cannot be empty.',
      });
    }

    const updatedData = await Data.findByIdAndUpdate(id, { data: updateData }, { new: true, runValidators: true });

    if (!updatedData) {
      return res.status(404).json({
        status: false,
        message: 'Campaign data not found.',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Campaign data updated successfully.',
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Server error during update',
      error: error.message,
    });
  }
};

const deleteCampaignData = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        status: false,
        message: 'Campaign ID is required for deletion.',
      });
    }

    const deletedData = await Data.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({
        status: false,
        message: 'Campaign data not found.',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Campaign data deleted successfully.',
      data: deletedData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Server error during deletion',
      error: error.message,
    });
  }
};

module.exports = {
  campaignSaveData,
  getAllData,
  updateCampaignData,
  deleteCampaignData,
};
