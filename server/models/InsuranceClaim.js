
const mongoose = require("mongoose");

const insuranceClaimSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    insurance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
      required: true,
    },

    claimNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    claimType: {
      type: String,
      required: true,
      trim: true,
    },

    claimAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    incidentDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    documents: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "settled",
      ],
      default: "pending",
    },

    approvedAmount: {
      type: Number,
      default: 0,
    },

    officerNotes: {
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
  "InsuranceClaim",
  insuranceClaimSchema
);
