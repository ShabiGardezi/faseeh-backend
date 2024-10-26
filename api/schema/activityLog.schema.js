const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceType: {
      type: String,
      enum: [
        "TASHKEEL",
        "PROFESSIONAL_EMAIL",
        "PROOF_READ",
        "CHILDREN_STORY",
        "GRAMMAR_ANALYSIS",
        "MARKETING_TEXT",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
