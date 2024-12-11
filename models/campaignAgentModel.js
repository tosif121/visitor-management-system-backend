const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CampaignAgent", campaignSchema);
