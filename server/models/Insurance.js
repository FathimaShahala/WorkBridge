const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    // Worker covered by the insurance
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Insurance policy details
    policyNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    insuranceProvider: {
      type: String,
      required: true,
      trim: true,
    },

    policyType: {
      type: String,
      required: true,
      trim: true,
    },

    // Financial details
    coverageAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    premiumAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Policy dates
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // Policy status
    status: {
      type: String,
      enum: [
        "active",
        "expired",
        "cancelled",
        "pending",
      ],
      default: "pending",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Insurance",
  insuranceSchema
);