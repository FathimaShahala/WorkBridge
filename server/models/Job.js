
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
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

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: Number,
      required: true,
      min: 0,
    },

    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Contract",
        "Temporary",
      ],
      default: "Full Time",
    },

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    vacancies: {
      type: Number,
      default: 1,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "open",
        "closed",
        "draft",
      ],
      default: "open",
    },

    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
