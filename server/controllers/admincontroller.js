
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Complaint = require("../models/Complaint");

const getAdminDashboard = async (req, res) => {
  try {
    // ==============================
    // USER COUNTS
    // ==============================

    const totalUsers = await User.countDocuments();

    const totalWorkers = await User.countDocuments({
      role: "worker",
    });

    const totalEmployers = await User.countDocuments({
      role: "employer",
    });

    const totalLabourOfficers = await User.countDocuments({
      role: "labourOfficer",
    });

    const totalPolice = await User.countDocuments({
      role: "police",
    });

    const totalInsuranceOfficers = await User.countDocuments({
      role: "insurance",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    // ==============================
    // USER STATUS
    // ==============================

    const activeUsers = await User.countDocuments({
      status: "active",
    });

    const inactiveUsers = await User.countDocuments({
      status: "inactive",
    });

    const verifiedUsers = await User.countDocuments({
      isVerified: true,
    });

    const unverifiedUsers = await User.countDocuments({
      isVerified: false,
    });

    // ==============================
    // JOB COUNTS
    // ==============================

    const totalJobs = await Job.countDocuments();

    const openJobs = await Job.countDocuments({
      status: "open",
    });

    const closedJobs = await Job.countDocuments({
      status: "closed",
    });

    const draftJobs = await Job.countDocuments({
      status: "draft",
    });

    // ==============================
    // APPLICATION COUNTS
    // ==============================

    const totalApplications = await Application.countDocuments();

    const pendingApplications = await Application.countDocuments({
      status: "pending",
    });

    const shortlistedApplications = await Application.countDocuments({
      status: "shortlisted",
    });

    const acceptedApplications = await Application.countDocuments({
      status: "accepted",
    });

    const rejectedApplications = await Application.countDocuments({
      status: "rejected",
    });

    // ==============================
    // COMPLAINT COUNTS
    // ==============================

    const totalComplaints = await Complaint.countDocuments();

    const pendingComplaints = await Complaint.countDocuments({
      status: "pending",
    });

    const investigatingComplaints = await Complaint.countDocuments({
      status: "investigating",
    });

    const resolvedComplaints = await Complaint.countDocuments({
      status: "resolved",
    });

    const rejectedComplaints = await Complaint.countDocuments({
      status: "rejected",
    });

    // ==============================
    // RECENT USERS
    // ==============================

    const recentUsers = await User.find()
      .select(
        "fullName email phone role profileImage isVerified status createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    // ==============================
    // RECENT JOBS
    // ==============================

    const recentJobs = await Job.find()
      .populate("employer", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5);

    // ==============================
    // RECENT APPLICATIONS
    // ==============================

    const recentApplications = await Application.find()
      .populate("worker", "fullName email")
      .populate("job", "title")
      .populate("employer", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5);

    // ==============================
    // RESPONSE
    // ==============================

    res.status(200).json({
      success: true,

      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
        },

        workers: {
          total: totalWorkers,
        },

        employers: {
          total: totalEmployers,
        },

        labourOfficers: {
          total: totalLabourOfficers,
        },

        police: {
          total: totalPolice,
        },

        insurance: {
          total: totalInsuranceOfficers,
        },

        admins: {
          total: totalAdmins,
        },

        jobs: {
          total: totalJobs,
          open: openJobs,
          closed: closedJobs,
          draft: draftJobs,
        },

        applications: {
          total: totalApplications,
          pending: pendingApplications,
          shortlisted: shortlistedApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications,
        },

        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          investigating: investigatingComplaints,
          resolved: resolvedComplaints,
          rejected: rejectedComplaints,
        },
      },

      recentUsers,
      recentJobs,
      recentApplications,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard.",
    });
  }
};


// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(
        "fullName email phone role profileImage isVerified status createdAt"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};


// ==========================================
// GET SINGLE USER
// ==========================================

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "fullName email phone role profileImage isVerified status createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
};


// ==========================================
// VERIFY / UNVERIFY USER
// ==========================================

const updateUserVerification = async (req, res) => {
  try {
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVerified must be true or false.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isVerified = isVerified;

    await user.save();

    res.status(200).json({
      success: true,
      message: isVerified
        ? "User verified successfully."
        : "User verification removed successfully.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(
      "Update User Verification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update user verification.",
    });
  }
};


// ==========================================
// ACTIVATE / DEACTIVATE USER
// ==========================================

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user status.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prevent admin from deactivating themselves
    if (
      user._id.toString() === req.user._id.toString() &&
      status === "inactive"
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }

    user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        status === "active"
          ? "User activated successfully."
          : "User deactivated successfully.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update User Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update user status.",
    });
  }
};


// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prevent admin from deleting themselves
    if (
      user._id.toString() === req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
};


// ==========================================
// GET ALL EMPLOYERS
// ==========================================

const getAdminEmployers = async (req, res) => {
  try {
    const employers = await User.find({
      role: "employer",
    })
      .select(
        "fullName email phone profileImage isVerified status createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Get job counts for each employer
    const employersWithJobs = await Promise.all(
      employers.map(async (employer) => {
        const totalJobs = await Job.countDocuments({
          employer: employer._id,
        });

        const openJobs = await Job.countDocuments({
          employer: employer._id,
          status: "open",
        });

        const closedJobs = await Job.countDocuments({
          employer: employer._id,
          status: "closed",
        });

        return {
          ...employer,
          jobStats: {
            total: totalJobs,
            open: openJobs,
            closed: closedJobs,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: employersWithJobs.length,
      employers: employersWithJobs,
    });
  } catch (error) {
    console.error("Get Admin Employers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employers.",
    });
  }
};


// ==========================================
// GET SINGLE EMPLOYER
// ==========================================

const getAdminEmployerById = async (req, res) => {
  try {
    const employer = await User.findOne({
      _id: req.params.id,
      role: "employer",
    })
      .select(
        "fullName email phone profileImage isVerified status createdAt updatedAt"
      )
      .lean();

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found.",
      });
    }

    const jobs = await Job.find({
      employer: employer._id,
    })
      .select(
        "title location salary employmentType vacancies status deadline createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      employer: {
        ...employer,
        jobStats: {
          total: jobs.length,
          open: jobs.filter((job) => job.status === "open").length,
          closed: jobs.filter((job) => job.status === "closed").length,
          draft: jobs.filter((job) => job.status === "draft").length,
        },
        jobs,
      },
    });
  } catch (error) {
    console.error("Get Admin Employer Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employer.",
    });
  }
};


// ==========================================
// VERIFY / UNVERIFY EMPLOYER
// ==========================================

const updateEmployerVerification = async (req, res) => {
  try {
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVerified must be true or false.",
      });
    }

    const employer = await User.findOne({
      _id: req.params.id,
      role: "employer",
    });

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found.",
      });
    }

    employer.isVerified = isVerified;

    await employer.save();

    res.status(200).json({
      success: true,
      message: isVerified
        ? "Employer verified successfully."
        : "Employer verification removed successfully.",
      employer: {
        _id: employer._id,
        fullName: employer.fullName,
        email: employer.email,
        phone: employer.phone,
        isVerified: employer.isVerified,
        status: employer.status,
      },
    });
  } catch (error) {
    console.error(
      "Update Employer Verification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update employer verification.",
    });
  }
};


// ==========================================
// ACTIVATE / DEACTIVATE EMPLOYER
// ==========================================

const updateEmployerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employer status.",
      });
    }

    const employer = await User.findOne({
      _id: req.params.id,
      role: "employer",
    });

    if (!employer) {
      return res.status(404).json({
        success: false,
        message: "Employer not found.",
      });
    }

    employer.status = status;

    await employer.save();

    res.status(200).json({
      success: true,
      message:
        status === "active"
          ? "Employer activated successfully."
          : "Employer deactivated successfully.",
      employer: {
        _id: employer._id,
        fullName: employer.fullName,
        email: employer.email,
        phone: employer.phone,
        isVerified: employer.isVerified,
        status: employer.status,
      },
    });
  } catch (error) {
    console.error(
      "Update Employer Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update employer status.",
    });
  }
};


// ==========================================
// GET ALL WORKERS FOR ADMIN
// ==========================================

const getAdminWorkers = async (req, res) => {
  try {
    const workers = await User.find({
      role: "worker",
    })
      .select(
        "fullName email phone profileImage isVerified status createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    const workersWithApplications = await Promise.all(
      workers.map(async (worker) => {
        const totalApplications =
          await Application.countDocuments({
            worker: worker._id,
          });

        const pendingApplications =
          await Application.countDocuments({
            worker: worker._id,
            status: "pending",
          });

        const acceptedApplications =
          await Application.countDocuments({
            worker: worker._id,
            status: "accepted",
          });

        return {
          ...worker,
          applicationStats: {
            total: totalApplications,
            pending: pendingApplications,
            accepted: acceptedApplications,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: workersWithApplications.length,
      workers: workersWithApplications,
    });
  } catch (error) {
    console.error("Get Admin Workers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers.",
    });
  }
};


// ==========================================
// GET SINGLE WORKER
// ==========================================

const getAdminWorkerById = async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.params.id,
      role: "worker",
    })
      .select(
        "fullName email phone profileImage isVerified status createdAt updatedAt"
      )
      .lean();

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found.",
      });
    }

    const applications = await Application.find({
      worker: worker._id,
    })
      .populate("job", "title location salary employmentType status")
      .populate("employer", "fullName email")
      .select(
        "job employer coverLetter status createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      worker: {
        ...worker,
        applicationStats: {
          total: applications.length,
          pending: applications.filter(
            (application) =>
              application.status === "pending"
          ).length,
          accepted: applications.filter(
            (application) =>
              application.status === "accepted"
          ).length,
        },
        applications,
      },
    });
  } catch (error) {
    console.error("Get Admin Worker Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker.",
    });
  }
};


// ==========================================
// VERIFY / UNVERIFY WORKER
// ==========================================

const updateWorkerVerification = async (req, res) => {
  try {
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVerified must be true or false.",
      });
    }

    const worker = await User.findOne({
      _id: req.params.id,
      role: "worker",
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found.",
      });
    }

    worker.isVerified = isVerified;

    await worker.save();

    res.status(200).json({
      success: true,
      message: isVerified
        ? "Worker verified successfully."
        : "Worker verification removed successfully.",
      worker: {
        _id: worker._id,
        fullName: worker.fullName,
        email: worker.email,
        phone: worker.phone,
        isVerified: worker.isVerified,
        status: worker.status,
      },
    });
  } catch (error) {
    console.error(
      "Update Worker Verification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update worker verification.",
    });
  }
};


// ==========================================
// ACTIVATE / DEACTIVATE WORKER
// ==========================================

const updateWorkerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid worker status.",
      });
    }

    const worker = await User.findOne({
      _id: req.params.id,
      role: "worker",
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found.",
      });
    }

    worker.status = status;

    await worker.save();

    res.status(200).json({
      success: true,
      message:
        status === "active"
          ? "Worker activated successfully."
          : "Worker deactivated successfully.",
      worker: {
        _id: worker._id,
        fullName: worker.fullName,
        email: worker.email,
        phone: worker.phone,
        isVerified: worker.isVerified,
        status: worker.status,
      },
    });
  } catch (error) {
    console.error(
      "Update Worker Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update worker status.",
    });
  }
};


// ==========================================
// GET ALL JOBS FOR ADMIN
// ==========================================

const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate(
        "employer",
        "fullName email phone profileImage isVerified status"
      )
      .sort({ createdAt: -1 })
      .lean();

    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications =
          await Application.countDocuments({
            job: job._id,
          });

        const pendingApplications =
          await Application.countDocuments({
            job: job._id,
            status: "pending",
          });

        const acceptedApplications =
          await Application.countDocuments({
            job: job._id,
            status: "accepted",
          });

        return {
          ...job,
          applicationStats: {
            total: totalApplications,
            pending: pendingApplications,
            accepted: acceptedApplications,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithApplications.length,
      jobs: jobsWithApplications,
    });
  } catch (error) {
    console.error("Get Admin Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs.",
    });
  }
};


// ==========================================
// GET SINGLE JOB
// ==========================================

const getAdminJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate(
        "employer",
        "fullName email phone profileImage isVerified status"
      )
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const applications = await Application.find({
      job: job._id,
    })
      .populate(
        "worker",
        "fullName email phone profileImage isVerified status"
      )
      .select(
        "worker coverLetter status createdAt updatedAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      job: {
        ...job,
        applicationStats: {
          total: applications.length,
          pending: applications.filter(
            (application) =>
              application.status === "pending"
          ).length,
          shortlisted: applications.filter(
            (application) =>
              application.status === "shortlisted"
          ).length,
          accepted: applications.filter(
            (application) =>
              application.status === "accepted"
          ).length,
          rejected: applications.filter(
            (application) =>
              application.status === "rejected"
          ).length,
        },
        applications,
      },
    });
  } catch (error) {
    console.error("Get Admin Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch job.",
    });
  }
};


// ==========================================
// UPDATE JOB STATUS
// ==========================================

const updateAdminJobStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "closed", "draft"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job status.",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    job.status = status;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job status updated successfully.",
      job: {
        _id: job._id,
        title: job.title,
        status: job.status,
      },
    });
  } catch (error) {
    console.error(
      "Update Admin Job Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update job status.",
    });
  }
};


// ==========================================
// DELETE JOB
// ==========================================

const deleteAdminJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Delete applications connected to this job
    await Application.deleteMany({
      job: job._id,
    });

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job and related applications deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Admin Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job.",
    });
  }
};

// ==========================================
// ADMIN - COMPLAINTS
// ==========================================


// GET ALL COMPLAINTS
const getAdminComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate(
        "worker",
        "fullName email phone profileImage isVerified status"
      )
      .populate(
        "employer",
        "fullName email phone profileImage isVerified status"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get Admin Complaints Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
};

// GET SINGLE COMPLAINT
const getAdminComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate(
        "worker",
        "fullName email phone profileImage isVerified status"
      )
      .populate(
        "employer",
        "fullName email phone profileImage isVerified status"
      )
      .lean();

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get Admin Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaint.",
    });
  }
};

// UPDATE COMPLAINT STATUS
const updateAdminComplaintStatus = async (req, res) => {
  try {
    const { status, officerRemarks } = req.body;

    const validStatuses = [
      "pending",
      "investigating",
      "resolved",
      "rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status.",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    complaint.status = status;

    if (typeof officerRemarks === "string") {
      complaint.officerRemarks = officerRemarks.trim();
    }

    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    } else {
      complaint.resolvedAt = undefined;
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully.",
      complaint: {
        _id: complaint._id,
        status: complaint.status,
        officerRemarks: complaint.officerRemarks,
        resolvedAt: complaint.resolvedAt,
      },
    });
  } catch (error) {
    console.error(
      "Update Admin Complaint Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update complaint.",
    });
  }
};

// DELETE COMPLAINT
const deleteAdminComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Admin Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete complaint.",
    });
  }
};

// GET COMPLAINT STATISTICS
const getAdminComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: "pending",
    });

    const investigating = await Complaint.countDocuments({
      status: "investigating",
    });

    const resolved = await Complaint.countDocuments({
      status: "resolved",
    });

    const rejected = await Complaint.countDocuments({
      status: "rejected",
    });

    const wageIssues = await Complaint.countDocuments({
      category: "Wage Issue",
    });

    const workingConditions = await Complaint.countDocuments({
      category: "Working Conditions",
    });

    const workplaceSafety = await Complaint.countDocuments({
      category: "Workplace Safety",
    });

    const harassment = await Complaint.countDocuments({
      category: "Harassment",
    });

    const contractIssues = await Complaint.countDocuments({
      category: "Contract Issue",
    });

    const other = await Complaint.countDocuments({
      category: "Other",
    });

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        investigating,
        resolved,
        rejected,
        categories: {
          wageIssues,
          workingConditions,
          workplaceSafety,
          harassment,
          contractIssues,
          other,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Admin Complaint Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaint statistics.",
    });
  }
};


// ==========================================
// ADMIN - REPORTS
// ==========================================

const getAdminReports = async (req, res) => {
  try {
    // ==========================================
    // USER COUNTS
    // ==========================================

    const totalUsers = await User.countDocuments();

    const totalWorkers = await User.countDocuments({
      role: "worker",
    });

    const totalEmployers = await User.countDocuments({
      role: "employer",
    });

    const totalLabourOfficers =
      await User.countDocuments({
        role: "labourOfficer",
      });

    const totalPolice = await User.countDocuments({
      role: "police",
    });

    const totalInsurance = await User.countDocuments({
      role: "insurance",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const activeUsers = await User.countDocuments({
      status: "active",
    });

    const inactiveUsers = await User.countDocuments({
      status: "inactive",
    });

    const verifiedUsers = await User.countDocuments({
      isVerified: true,
    });

    const unverifiedUsers = await User.countDocuments({
      isVerified: false,
    });

    // ==========================================
    // JOB COUNTS
    // ==========================================

    const totalJobs = await Job.countDocuments();

    const openJobs = await Job.countDocuments({
      status: "open",
    });

    const closedJobs = await Job.countDocuments({
      status: "closed",
    });

    const draftJobs = await Job.countDocuments({
      status: "draft",
    });

    // ==========================================
    // APPLICATION COUNTS
    // ==========================================

    const totalApplications =
      await Application.countDocuments();

    const pendingApplications =
      await Application.countDocuments({
        status: "pending",
      });

    const shortlistedApplications =
      await Application.countDocuments({
        status: "shortlisted",
      });

    const acceptedApplications =
      await Application.countDocuments({
        status: "accepted",
      });

    const rejectedApplications =
      await Application.countDocuments({
        status: "rejected",
      });

    // ==========================================
    // COMPLAINT COUNTS
    // ==========================================

    const totalComplaints =
      await Complaint.countDocuments();

    const pendingComplaints =
      await Complaint.countDocuments({
        status: "pending",
      });

    const investigatingComplaints =
      await Complaint.countDocuments({
        status: "investigating",
      });

    const resolvedComplaints =
      await Complaint.countDocuments({
        status: "resolved",
      });

    const rejectedComplaints =
      await Complaint.countDocuments({
        status: "rejected",
      });

    // ==========================================
    // USER REGISTRATION - LAST 12 MONTHS
    // ==========================================

    const userMonthlyData =
      await User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date().setMonth(
                  new Date().getMonth() - 11
                )
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    // ==========================================
    // JOB CREATION - LAST 12 MONTHS
    // ==========================================

    const jobMonthlyData =
      await Job.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date().setMonth(
                  new Date().getMonth() - 11
                )
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    // ==========================================
    // APPLICATIONS - LAST 12 MONTHS
    // ==========================================

    const applicationMonthlyData =
      await Application.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date().setMonth(
                  new Date().getMonth() - 11
                )
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    // ==========================================
    // COMPLAINTS - LAST 12 MONTHS
    // ==========================================

    const complaintMonthlyData =
      await Complaint.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                new Date().setMonth(
                  new Date().getMonth() - 11
                )
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,

      users: {
        total: totalUsers,
        workers: totalWorkers,
        employers: totalEmployers,
        labourOfficers: totalLabourOfficers,
        police: totalPolice,
        insurance: totalInsurance,
        admins: totalAdmins,
        active: activeUsers,
        inactive: inactiveUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
      },

      jobs: {
        total: totalJobs,
        open: openJobs,
        closed: closedJobs,
        draft: draftJobs,
      },

      applications: {
        total: totalApplications,
        pending: pendingApplications,
        shortlisted: shortlistedApplications,
        accepted: acceptedApplications,
        rejected: rejectedApplications,
      },

      complaints: {
        total: totalComplaints,
        pending: pendingComplaints,
        investigating: investigatingComplaints,
        resolved: resolvedComplaints,
        rejected: rejectedComplaints,
      },

      trends: {
        users: userMonthlyData,
        jobs: jobMonthlyData,
        applications: applicationMonthlyData,
        complaints: complaintMonthlyData,
      },
    });
  } catch (error) {
    console.error(
      "Get Admin Reports Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate admin reports.",
    });
  }
};

    
// ==========================================
// ADMIN - SETTINGS
// ==========================================

// GET SETTINGS
const getAdminSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "Get Admin Settings Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch settings.",
    });
  }
};

// UPDATE SETTINGS
const updateAdminSettings = async (req, res) => {
  try {
    const {
      platformName,
      contactEmail,
      contactPhone,
      supportAddress,
      allowRegistration,
      requireVerification,
      emailNotifications,
      complaintNotifications,
      maintenanceMode,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    if (typeof platformName === "string") {
      settings.platformName =
        platformName.trim();
    }

    if (typeof contactEmail === "string") {
      settings.contactEmail =
        contactEmail.trim().toLowerCase();
    }

    if (typeof contactPhone === "string") {
      settings.contactPhone =
        contactPhone.trim();
    }

    if (typeof supportAddress === "string") {
      settings.supportAddress =
        supportAddress.trim();
    }

    if (typeof allowRegistration === "boolean") {
      settings.allowRegistration =
        allowRegistration;
    }

    if (
      typeof requireVerification === "boolean"
    ) {
      settings.requireVerification =
        requireVerification;
    }

    if (
      typeof emailNotifications === "boolean"
    ) {
      settings.emailNotifications =
        emailNotifications;
    }

    if (
      typeof complaintNotifications ===
      "boolean"
    ) {
      settings.complaintNotifications =
        complaintNotifications;
    }

    if (typeof maintenanceMode === "boolean") {
      settings.maintenanceMode =
        maintenanceMode;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error(
      "Update Admin Settings Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update settings.",
    });
  }
};



module.exports = {
  // Existing
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUserVerification,
  updateUserStatus,
  deleteUser,

  // Existing employer functions
  getAdminEmployers,
  getAdminEmployerById,
  updateEmployerVerification,
  updateEmployerStatus,

  // Existing worker functions
  getAdminWorkers,
  getAdminWorkerById,
  updateWorkerVerification,
  updateWorkerStatus,

  // Existing job functions
  getAdminJobs,
  getAdminJobById,
  updateAdminJobStatus,
  deleteAdminJob,

  // Admin complaints
  getAdminComplaints,
  getAdminComplaintById,
  updateAdminComplaintStatus,
  deleteAdminComplaint,
  getAdminComplaintStats,

  // Admin reports
  getAdminReports,

  // Admin settings
  getAdminSettings,
  updateAdminSettings,
};