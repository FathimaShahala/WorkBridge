const Application = require("../models/Application");
const Job = require("../models/Job");

// ==========================================
// Apply for a Job
// Worker only
// ==========================================
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Validate job ID
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Check job status
    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications.",
      });
    }

    // Check deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "The application deadline has passed.",
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      worker: req.user.id,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // Create application
    const application = await Application.create({
      worker: req.user.id,
      job: job._id,
      employer: job.employer,
      coverLetter: coverLetter || "",
    });

    // Populate useful information
    const populatedApplication = await Application.findById(
      application._id
    )
      .populate("worker", "fullName email phone")
      .populate("job", "title location salary employmentType")
      .populate("employer", "fullName email");

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);

    // Handle duplicate application index
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit application.",
    });
  }
};

// ==========================================
// Get Worker's Applications
// Worker only
// ==========================================
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      worker: req.user.id,
    })
      .populate(
        "job",
        "title location salary employmentType status deadline"
      )
      .populate("employer", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get My Applications Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications.",
    });
  }
};

// ==========================================
// Get Applications for Employer's Jobs
// Employer only
// ==========================================
const getEmployerApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      employer: req.user.id,
    })
      .populate("worker", "fullName email phone profileImage")
      .populate(
        "job",
        "title location salary employmentType status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Employer Applications Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications.",
    });
  }
};

// ==========================================
// Update Application Status
// Employer only
// ==========================================
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "shortlisted",
      "accepted",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Make sure employer owns this application
    if (
      application.employer.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this application.",
      });
    }

    application.status = status;

    await application.save();

    const updatedApplication =
      await Application.findById(application._id)
        .populate(
          "worker",
          "fullName email phone profileImage"
        )
        .populate(
          "job",
          "title location salary employmentType status"
        )
        .populate("employer", "fullName email");

    res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(
      "Update Application Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update application status.",
    });
  }
};

// ==========================================
// Get Employer's Hired Workers
// Employer only
// ==========================================
const getEmployerWorkers = async (req, res) => {
  try {
    const applications = await Application.find({
      employer: req.user.id,
      status: "accepted",
    })
      .populate(
        "worker",
        "fullName email phone profileImage"
      )
      .populate(
        "job",
        "title location salary employmentType"
      )
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      workers: applications,
    });
  } catch (error) {
    console.error(
      "Get Employer Workers Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers.",
    });
  }
};


module.exports = {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
  getEmployerWorkers,
};