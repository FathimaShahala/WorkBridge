const User = require("../models/User");

// ==========================================
// Get Profile
// ==========================================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

// ==========================================
// Update Profile
// ==========================================
const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        isVerified: updatedUser.isVerified,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

// ==========================================
// Upload Profile Image
// ==========================================
const uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Save image path
    user.profileImage = `/uploads/profiles/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully.",
      profileImage: user.profileImage,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        status: user.status,
      },
    });
  } catch (error) {
    console.error(
      "Upload Profile Image Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to upload profile image.",
    });
  }
};

// ==========================================
// Get All Workers
// ==========================================
const getWorkers = async (req, res) => {
  try {
    const workers = await User.find({
      role: "worker",
      status: "active",
    })
      .select(
        "fullName email phone profileImage isVerified status"
      )
      .sort({ fullName: 1 });

    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error("Get Workers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers.",
    });
  }
};

// ==========================================
// Labour Officer Dashboard
// Labour Officer only
// ==========================================
const getLabourOfficerDashboard = async (req, res) => {
  try {
    const Application = require("../models/Application");
    const Job = require("../models/Job");

    // ==========================================
    // User Counts
    // ==========================================

    const totalWorkers = await User.countDocuments({
      role: "worker",
    });

    const activeWorkers = await User.countDocuments({
      role: "worker",
      status: "active",
    });

    const inactiveWorkers = await User.countDocuments({
      role: "worker",
      status: "inactive",
    });

    const verifiedWorkers = await User.countDocuments({
      role: "worker",
      isVerified: true,
    });

    // ==========================================
    // Employer Counts
    // ==========================================

    const totalEmployers = await User.countDocuments({
      role: "employer",
    });

    const activeEmployers = await User.countDocuments({
      role: "employer",
      status: "active",
    });

    const verifiedEmployers = await User.countDocuments({
      role: "employer",
      isVerified: true,
    });

    // ==========================================
    // Job Counts
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
    // Application Counts
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
    // Recent Workers
    // ==========================================

    const recentWorkers = await User.find({
      role: "worker",
    })
      .select(
        "fullName email phone profileImage isVerified status createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================================
    // Recent Jobs
    // ==========================================

    const recentJobs = await Job.find()
      .populate(
        "employer",
        "fullName email"
      )
      .select(
        "title location salary employmentType status vacancies deadline employer createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,

      stats: {
        workers: {
          total: totalWorkers,
          active: activeWorkers,
          inactive: inactiveWorkers,
          verified: verifiedWorkers,
        },

        employers: {
          total: totalEmployers,
          active: activeEmployers,
          verified: verifiedEmployers,
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
      },

      recentWorkers,
      recentJobs,
    });
  } catch (error) {
    console.error(
      "Labour Officer Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch Labour Officer dashboard.",
    });
  }
};


// ==========================================
// Get All Employers
// Labour Officer
// ==========================================
const getEmployers = async (req, res) => {
  try {
    const employers = await User.find({
      role: "employer",
    })
      .select(
        "fullName email phone profileImage isVerified status createdAt"
      )
      .sort({ fullName: 1 });

    res.status(200).json({
      success: true,
      count: employers.length,
      employers,
    });
  } catch (error) {
    console.error("Get Employers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employers.",
    });
  }
};


// ==========================================
// Police Dashboard
// ==========================================
const getPoliceDashboard = async (req, res) => {
  try {
    const Complaint = require("../models/Complaint");
    const Inspection = require("../models/Inspection");
    const Job = require("../models/Job");

    // ------------------------------------------
    // Worker Statistics
    // ------------------------------------------
    const [
      totalWorkers,
      activeWorkers,
      inactiveWorkers,
      verifiedWorkers,
      unverifiedWorkers,
    ] = await Promise.all([
      User.countDocuments({
        role: "worker",
      }),

      User.countDocuments({
        role: "worker",
        status: "active",
      }),

      User.countDocuments({
        role: "worker",
        status: "inactive",
      }),

      User.countDocuments({
        role: "worker",
        isVerified: true,
      }),

      User.countDocuments({
        role: "worker",
        isVerified: false,
      }),
    ]);

    // ------------------------------------------
    // Employer Statistics
    // ------------------------------------------
    const [
      totalEmployers,
      activeEmployers,
      inactiveEmployers,
      verifiedEmployers,
      unverifiedEmployers,
    ] = await Promise.all([
      User.countDocuments({
        role: "employer",
      }),

      User.countDocuments({
        role: "employer",
        status: "active",
      }),

      User.countDocuments({
        role: "employer",
        status: "inactive",
      }),

      User.countDocuments({
        role: "employer",
        isVerified: true,
      }),

      User.countDocuments({
        role: "employer",
        isVerified: false,
      }),
    ]);

    // ------------------------------------------
    // Complaint Statistics
    // ------------------------------------------
    const [
      totalComplaints,
      pendingComplaints,
      investigatingComplaints,
      resolvedComplaints,
      rejectedComplaints,
    ] = await Promise.all([
      Complaint.countDocuments(),

      Complaint.countDocuments({
        status: "pending",
      }),

      Complaint.countDocuments({
        status: "investigating",
      }),

      Complaint.countDocuments({
        status: "resolved",
      }),

      Complaint.countDocuments({
        status: "rejected",
      }),
    ]);

    // ------------------------------------------
    // Inspection Statistics
    // ------------------------------------------
    const [
      totalInspections,
      scheduledInspections,
      inProgressInspections,
      completedInspections,
      cancelledInspections,
      violationInspections,
    ] = await Promise.all([
      Inspection.countDocuments(),

      Inspection.countDocuments({
        status: "scheduled",
      }),

      Inspection.countDocuments({
        status: "in-progress",
      }),

      Inspection.countDocuments({
        status: "completed",
      }),

      Inspection.countDocuments({
        status: "cancelled",
      }),

      Inspection.countDocuments({
        violationsFound: true,
      }),
    ]);

    // ------------------------------------------
    // Job Statistics
    // ------------------------------------------
    const [
      totalJobs,
      openJobs,
      closedJobs,
    ] = await Promise.all([
      Job.countDocuments(),

      Job.countDocuments({
        status: "open",
      }),

      Job.countDocuments({
        status: "closed",
      }),
    ]);

    // ------------------------------------------
    // Recent Workers
    // ------------------------------------------
    const recentWorkers = await User.find({
      role: "worker",
    })
      .select(
        "fullName email phone profileImage isVerified status createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    // ------------------------------------------
    // Recent Complaints
    // ------------------------------------------
    const recentComplaints =
      await Complaint.find()
        .populate(
          "worker",
          "fullName email phone"
        )
        .populate(
          "employer",
          "fullName email phone"
        )
        .sort({ createdAt: -1 })
        .limit(5);

    // ------------------------------------------
    // Recent Inspections
    // ------------------------------------------
    const recentInspections =
      await Inspection.find()
        .populate(
          "employer",
          "fullName email phone"
        )
        .populate(
          "officer",
          "fullName email"
        )
        .sort({ createdAt: -1 })
        .limit(5);

    // ------------------------------------------
    // Response
    // ------------------------------------------
    res.status(200).json({
      success: true,

      stats: {
        workers: {
          total: totalWorkers,
          active: activeWorkers,
          inactive: inactiveWorkers,
          verified: verifiedWorkers,
          unverified: unverifiedWorkers,
        },

        employers: {
          total: totalEmployers,
          active: activeEmployers,
          inactive: inactiveEmployers,
          verified: verifiedEmployers,
          unverified: unverifiedEmployers,
        },

        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          investigating: investigatingComplaints,
          resolved: resolvedComplaints,
          rejected: rejectedComplaints,
        },

        inspections: {
          total: totalInspections,
          scheduled: scheduledInspections,
          inProgress: inProgressInspections,
          completed: completedInspections,
          cancelled: cancelledInspections,
          violations: violationInspections,
        },

        jobs: {
          total: totalJobs,
          open: openJobs,
          closed: closedJobs,
        },
      },

      recentWorkers,
      recentComplaints,
      recentInspections,
    });
  } catch (error) {
    console.error(
      "Police Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch police dashboard.",
    });
  }
};



module.exports = {
  getProfile,
  updateProfile,
  uploadProfile,
  getWorkers,
  getLabourOfficerDashboard,
  getEmployers,
  getPoliceDashboard,
};