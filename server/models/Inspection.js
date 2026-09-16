
const mongoose = require("mongoose");

const inspectionSchema = new mongoose.Schema(
  {
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workplace: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    inspectionDate: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Routine",
        "Complaint Based",
        "Safety",
        "Follow Up",
        "Other",
      ],
      default: "Routine",
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },

    findings: {
      type: String,
      trim: true,
      default: "",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    violationsFound: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Inspection",
  inspectionSchema
);
