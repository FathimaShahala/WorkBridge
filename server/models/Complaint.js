
const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    category: {
      type: String,
      enum: [
        "Wage Issue",
        "Working Conditions",
        "Workplace Safety",
        "Harassment",
        "Contract Issue",
        "Other",
      ],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "investigating",
        "resolved",
        "rejected",
      ],
      default: "pending",
    },

    officerRemarks: {
      type: String,
      trim: true,
      default: "",
    },

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);
