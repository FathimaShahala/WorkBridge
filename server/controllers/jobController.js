const Job = require("../models/Job");
const User = require("../models/User");
const createNotification = require("../utils/notificationHelper");
// ==========================================
// Get all open jobs
// ==========================================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("employer", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs.",
    });
  }
};

// ==========================================
// Get single job
// ==========================================
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("employer", "fullName email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch job.",
    });
  }
};

// ==========================================
// Create Job
// ==========================================
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      salary,
      employmentType,
      requiredSkills,
      vacancies,
      deadline,
    } = req.body;

    // Validation
    if (
      !title ||
      !description ||
      !location ||
      salary === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      employer: req.user.id,
      location,
      salary,
      employmentType,
      requiredSkills,
      vacancies,
      deadline,
    });
    

    // Return created job
    const createdJob = await Job.findById(job._id)
      .populate("employer", "fullName email");

    res.status(201).json({
      success: true,
      message: "Job created successfully.",
      job: createdJob,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create job.",
    });
  }
};

// ==========================================
// Update Job
// ==========================================
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Make sure employer owns this job
    if (job.employer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this job.",
      });
    }

    const {
      title,
      description,
      location,
      salary,
      employmentType,
      requiredSkills,
      vacancies,
      deadline,
      status,
    } = req.body;

    // Update only provided fields
    if (title !== undefined) {
      job.title = title;
    }

    if (description !== undefined) {
      job.description = description;
    }

    if (location !== undefined) {
      job.location = location;
    }

    if (salary !== undefined) {
      job.salary = salary;
    }

    if (employmentType !== undefined) {
      job.employmentType = employmentType;
    }

    if (requiredSkills !== undefined) {
      job.requiredSkills = requiredSkills;
    }

    if (vacancies !== undefined) {
      job.vacancies = vacancies;
    }

    if (deadline !== undefined) {
      job.deadline = deadline;
    }

    if (status !== undefined) {
      job.status = status;
    }

    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate("employer", "fullName email");

    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update job.",
    });
  }
};

// ==========================================
// Delete Job
// ==========================================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Make sure employer owns this job
    if (job.employer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this job.",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job.",
    });
  }
};

// ==========================================
// Get employer's own jobs
// ==========================================
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      employer: req.user.id,
    })
      .populate("employer", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your jobs.",
    });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
};