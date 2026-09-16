
const Inspection = require("../models/Inspection");
const User = require("../models/User");

// ==========================================
// Labour Officer - Create Inspection
// ==========================================
const createInspection = async (req, res) => {
  try {
    const {
      employer,
      workplace,
      location,
      inspectionDate,
      type,
      findings,
      remarks,
      violationsFound,
    } = req.body;

    if (
      !employer ||
      !workplace ||
      !location ||
      !inspectionDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Employer, workplace, location and inspection date are required.",
      });
    }

    const employerUser =
      await User.findOne({
        _id: employer,
        role: "employer",
      });

    if (!employerUser) {
      return res.status(404).json({
        success: false,
        message: "Employer not found.",
      });
    }

    const inspection =
      await Inspection.create({
        employer,
        officer: req.user.id,
        workplace,
        location,
        inspectionDate,
        type: type || "Routine",
        findings: findings || "",
        remarks: remarks || "",
        violationsFound:
          violationsFound || false,
      });

    const populatedInspection =
      await Inspection.findById(
        inspection._id
      )
        .populate(
          "employer",
          "fullName email phone profileImage"
        )
        .populate(
          "officer",
          "fullName email phone profileImage"
        );

    res.status(201).json({
      success: true,
      message: "Inspection created successfully.",
      inspection: populatedInspection,
    });
  } catch (error) {
    console.error(
      "Create Inspection Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create inspection.",
    });
  }
};

// ==========================================
// Labour Officer - Get All Inspections
// ==========================================
const getAllInspections = async (req, res) => {
  try {
    const inspections =
      await Inspection.find()
        .populate(
          "employer",
          "fullName email phone profileImage"
        )
        .populate(
          "officer",
          "fullName email phone profileImage"
        )
        .sort({
          inspectionDate: -1,
        });

    res.status(200).json({
      success: true,
      count: inspections.length,
      inspections,
    });
  } catch (error) {
    console.error(
      "Get All Inspections Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch inspections.",
    });
  }
};

// ==========================================
// Labour Officer - Get Inspection By ID
// ==========================================
const getInspectionById = async (req, res) => {
  try {
    const inspection =
      await Inspection.findById(
        req.params.id
      )
        .populate(
          "employer",
          "fullName email phone profileImage"
        )
        .populate(
          "officer",
          "fullName email phone profileImage"
        );

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found.",
      });
    }

    res.status(200).json({
      success: true,
      inspection,
    });
  } catch (error) {
    console.error(
      "Get Inspection Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch inspection.",
    });
  }
};

// ==========================================
// Labour Officer - Update Inspection
// ==========================================
const updateInspection = async (req, res) => {
  try {
    const {
      employer,
      workplace,
      location,
      inspectionDate,
      type,
      status,
      findings,
      remarks,
      violationsFound,
    } = req.body;

    const inspection =
      await Inspection.findById(
        req.params.id
      );

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found.",
      });
    }

    if (employer !== undefined) {
      const employerUser =
        await User.findOne({
          _id: employer,
          role: "employer",
        });

      if (!employerUser) {
        return res.status(404).json({
          success: false,
          message: "Employer not found.",
        });
      }

      inspection.employer = employer;
    }

    if (workplace !== undefined) {
      inspection.workplace = workplace;
    }

    if (location !== undefined) {
      inspection.location = location;
    }

    if (inspectionDate !== undefined) {
      inspection.inspectionDate =
        inspectionDate;
    }

    if (type !== undefined) {
      inspection.type = type;
    }

    if (status !== undefined) {
      inspection.status = status;
    }

    if (findings !== undefined) {
      inspection.findings = findings;
    }

    if (remarks !== undefined) {
      inspection.remarks = remarks;
    }

    if (violationsFound !== undefined) {
      inspection.violationsFound =
        violationsFound;
    }

    const updatedInspection =
      await inspection.save();

    const populatedInspection =
      await Inspection.findById(
        updatedInspection._id
      )
        .populate(
          "employer",
          "fullName email phone profileImage"
        )
        .populate(
          "officer",
          "fullName email phone profileImage"
        );

    res.status(200).json({
      success: true,
      message:
        "Inspection updated successfully.",
      inspection: populatedInspection,
    });
  } catch (error) {
    console.error(
      "Update Inspection Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update inspection.",
    });
  }
};

// ==========================================
// Labour Officer - Delete Inspection
// ==========================================
const deleteInspection = async (req, res) => {
  try {
    const inspection =
      await Inspection.findById(
        req.params.id
      );

    if (!inspection) {
      return res.status(404).json({
        success: false,
        message: "Inspection not found.",
      });
    }

    await Inspection.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Inspection deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Inspection Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete inspection.",
    });
  }
};

// ==========================================
// Labour Officer - Inspection Statistics
// ==========================================
const getInspectionStats = async (
  req,
  res
) => {
  try {
    const [
      total,
      scheduled,
      inProgress,
      completed,
      cancelled,
      violations,
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

    res.status(200).json({
      success: true,
      stats: {
        total,
        scheduled,
        inProgress,
        completed,
        cancelled,
        violations,
      },
    });
  } catch (error) {
    console.error(
      "Inspection Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch inspection statistics.",
    });
  }
};

module.exports = {
  createInspection,
  getAllInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
  getInspectionStats,
};
