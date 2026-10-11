

const mongoose = require("mongoose");

const policeCaseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },

    category: {
      type: String,
      enum: [
        "Theft",
        "Fraud",
        "Assault",
        "Harassment",
        "Workplace Violence",
        "Missing Person",
        "Document Issue",
        "Other",
      ],
      default: "Other",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "Open",
        "Investigating",
        "Pending",
        "Resolved",
        "Closed",
      ],
      default: "Open",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    incidentDate: {
      type: Date,
    },

    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  "PoliceCase",
  policeCaseSchema
);

