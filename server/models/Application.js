const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ==========================================
    // Worker who applied
    // ==========================================
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // Job being applied for
    // ==========================================
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // ==========================================
    // Employer who owns the job
    // ==========================================
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // Optional cover letter
    // ==========================================
    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // Application status
    // ==========================================
    status: {
      type: String,
      enum: [
        "pending",
        "shortlisted",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// Prevent same worker applying to same job
// multiple times
// ==========================================
applicationSchema.index(
  { worker: 1, job: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);