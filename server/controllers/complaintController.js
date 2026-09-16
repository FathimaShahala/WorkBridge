
const Complaint = require("../models/Complaint");
const User = require("../models/User");

// ==========================================
// Worker - Create Complaint
// ==========================================
const createComplaint = async (req, res) => {
  try {
    const {
      employer,
      category,
      subject,
      description,
      location,
    } = req.body;

    if (!category || !subject || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Category, subject and description are required.",
      });
    }

    const complaint = await Complaint.create({
      worker: req.user.id,
      employer: employer || undefined,
      category,
      subject,
      description,
      location: location || "",
    });

    const populatedComplaint =
      await Complaint.findById(complaint._id)
        .populate(
          "worker",
          "fullName email phone profileImage"
        )
        .populate(
          "employer",
          "fullName email phone profileImage"
        );

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully.",
      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit complaint.",
    });
  }
};

// ==========================================
// Worker - Get My Complaints
// ==========================================
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      worker: req.user.id,
    })
      .populate(
        "employer",
        "fullName email phone profileImage"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get My Complaints Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
};

// ==========================================
// Labour Officer - Get All Complaints
// ==========================================
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate(
        "worker",
        "fullName email phone profileImage"
      )
      .populate(
        "employer",
        "fullName email phone profileImage"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get All Complaints Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
};

// ==========================================
// Labour Officer - Get Complaint By ID
// ==========================================
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    )
      .populate(
        "worker",
        "fullName email phone profileImage"
      )
      .populate(
        "employer",
        "fullName email phone profileImage"
      );

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
    console.error(
      "Get Complaint By ID Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaint.",
    });
  }
};

// ==========================================
// Labour Officer - Update Complaint
// ==========================================
const updateComplaint = async (req, res) => {
  try {
    const {
      status,
      officerRemarks,
    } = req.body;

    const complaint = await Complaint.findById(
      req.params.id
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    if (status !== undefined) {
      complaint.status = status;
    }

    if (officerRemarks !== undefined) {
      complaint.officerRemarks = officerRemarks;
    }

    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    }

    const updatedComplaint =
      await complaint.save();

    const populatedComplaint =
      await Complaint.findById(updatedComplaint._id)
        .populate(
          "worker",
          "fullName email phone profileImage"
        )
        .populate(
          "employer",
          "fullName email phone profileImage"
        );

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully.",
      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error(
      "Update Complaint Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update complaint.",
    });
  }
};

// ==========================================
// Labour Officer - Complaint Statistics
// ==========================================
const getComplaintStats = async (req, res) => {
  try {
    const [
      total,
      pending,
      investigating,
      resolved,
      rejected,
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

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        investigating,
        resolved,
        rejected,
      },
    });
  } catch (error) {
    console.error(
      "Complaint Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaint statistics.",
    });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  getComplaintStats,
};
