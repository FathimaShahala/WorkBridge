
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const PoliceCase = require("../models/PoliceCase");


/*
============================================================
POLICE WORKERS
============================================================
*/

// Get all workers
const getPoliceWorkers = async (req, res) => {
  try {
    const workers = await User.find({
      role: "worker",
    })
      .select(
        "fullName email phone profileImage isVerified status createdAt"
      )
      .sort({ fullName: 1 });

    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    console.error(
      "Get Police Workers Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers.",
    });
  }
};


// Get single worker
const getPoliceWorkerById = async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.params.id,
      role: "worker",
    }).select("-password");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found.",
      });
    }

    res.status(200).json({
      success: true,
      worker,
    });
  } catch (error) {
    console.error(
      "Get Police Worker Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch worker.",
    });
  }
};


/*
============================================================
POLICE COMPLAINTS
============================================================
*/

// Get complaints for police
const getPoliceComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate(
        "worker",
        "fullName email phone profileImage isVerified status"
      )
      .populate(
        "employer",
        "fullName email phone"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error(
      "Get Police Complaints Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints.",
    });
  }
};


// Get single complaint
const getPoliceComplaintById = async (
  req,
  res
) => {
  try {
    const complaint = await Complaint.findById(
      req.params.id
    )
      .populate(
        "worker",
        "fullName email phone profileImage isVerified status"
      )
      .populate(
        "employer",
        "fullName email phone"
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
      "Get Police Complaint Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch complaint.",
    });
  }
};


// Update complaint status
const updatePoliceComplaint = async (
  req,
  res
) => {
  try {
    const {
      status,
      officerRemarks,
    } = req.body;

    const complaint =
      await Complaint.findById(
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
      complaint.officerRemarks =
        officerRemarks;
    }

    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    const updatedComplaint =
      await Complaint.findById(
        complaint._id
      )
        .populate(
          "worker",
          "fullName email phone profileImage isVerified status"
        )
        .populate(
          "employer",
          "fullName email phone"
        );

    res.status(200).json({
      success: true,
      message:
        "Complaint updated successfully.",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error(
      "Update Police Complaint Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update complaint.",
    });
  }
};


/*
============================================================
POLICE CASES
============================================================
*/

// Generate case number
const generateCaseNumber = async () => {
  const year = new Date()
    .getFullYear();

  const count =
    await PoliceCase.countDocuments();

  return `WB-${year}-${String(
    count + 1
  ).padStart(4, "0")}`;
};


// Create case
const createPoliceCase = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      worker,
      employer,
      complaint,
      category,
      priority,
      location,
      incidentDate,
      officerRemarks,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Title and description are required.",
      });
    }

    const caseNumber =
      await generateCaseNumber();

    const policeCase =
      await PoliceCase.create({
        caseNumber,
        title,
        description,
        worker:
          worker || undefined,
        employer:
          employer || undefined,
        complaint:
          complaint || undefined,
        category:
          category || "Other",
        priority:
          priority || "Medium",
        location:
          location || "",
        incidentDate:
          incidentDate || undefined,
        assignedOfficer:
          req.user.id,
        officerRemarks:
          officerRemarks || "",
      });

    const populatedCase =
      await PoliceCase.findById(
        policeCase._id
      )
        .populate(
          "worker",
          "fullName email phone profileImage isVerified status"
        )
        .populate(
          "employer",
          "fullName email phone"
        )
        .populate(
          "complaint"
        )
        .populate(
          "assignedOfficer",
          "fullName email"
        );

    res.status(201).json({
      success: true,
      message:
        "Police case created successfully.",
      policeCase: populatedCase,
    });
  } catch (error) {
    console.error(
      "Create Police Case Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create police case.",
    });
  }
};


// Get all cases
const getPoliceCases = async (
  req,
  res
) => {
  try {
    const cases =
      await PoliceCase.find()
        .populate(
          "worker",
          "fullName email phone profileImage isVerified status"
        )
        .populate(
          "employer",
          "fullName email phone"
        )
        .populate(
          "complaint"
        )
        .populate(
          "assignedOfficer",
          "fullName email"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    console.error(
      "Get Police Cases Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch police cases.",
    });
  }
};


// Get single case
const getPoliceCaseById = async (
  req,
  res
) => {
  try {
    const policeCase =
      await PoliceCase.findById(
        req.params.id
      )
        .populate(
          "worker",
          "fullName email phone profileImage isVerified status"
        )
        .populate(
          "employer",
          "fullName email phone"
        )
        .populate(
          "complaint"
        )
        .populate(
          "assignedOfficer",
          "fullName email"
        );

    if (!policeCase) {
      return res.status(404).json({
        success: false,
        message: "Police case not found.",
      });
    }

    res.status(200).json({
      success: true,
      policeCase,
    });
  } catch (error) {
    console.error(
      "Get Police Case Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch police case.",
    });
  }
};


// Update case
const updatePoliceCase = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      status,
      location,
      incidentDate,
      officerRemarks,
      worker,
      employer,
    } = req.body;

    const policeCase =
      await PoliceCase.findById(
        req.params.id
      );

    if (!policeCase) {
      return res.status(404).json({
        success: false,
        message: "Police case not found.",
      });
    }

    if (title !== undefined)
      policeCase.title = title;

    if (description !== undefined)
      policeCase.description =
        description;

    if (category !== undefined)
      policeCase.category = category;

    if (priority !== undefined)
      policeCase.priority = priority;

    if (status !== undefined)
      policeCase.status = status;

    if (location !== undefined)
      policeCase.location = location;

    if (incidentDate !== undefined)
      policeCase.incidentDate =
        incidentDate;

    if (officerRemarks !== undefined)
      policeCase.officerRemarks =
        officerRemarks;

    if (worker !== undefined)
      policeCase.worker =
        worker || undefined;

    if (employer !== undefined)
      policeCase.employer =
        employer || undefined;

    if (status === "Resolved") {
      policeCase.resolvedAt =
        new Date();
    }

    await policeCase.save();

    const updatedCase =
      await PoliceCase.findById(
        policeCase._id
      )
        .populate(
          "worker",
          "fullName email phone profileImage isVerified status"
        )
        .populate(
          "employer",
          "fullName email phone"
        )
        .populate(
          "assignedOfficer",
          "fullName email"
        );

    res.status(200).json({
      success: true,
      message:
        "Police case updated successfully.",
      policeCase: updatedCase,
    });
  } catch (error) {
    console.error(
      "Update Police Case Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update police case.",
    });
  }
};


// Delete case
const deletePoliceCase = async (
  req,
  res
) => {
  try {
    const policeCase =
      await PoliceCase.findById(
        req.params.id
      );

    if (!policeCase) {
      return res.status(404).json({
        success: false,
        message: "Police case not found.",
      });
    }

    await policeCase.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Police case deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Police Case Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete police case.",
    });
  }
};


/*
============================================================
POLICE VERIFICATION
============================================================
*/

// Get verification list
const getPoliceVerification =
  async (req, res) => {
    try {
      const workers =
        await User.find({
          role: "worker",
        })
          .select(
            "fullName email phone profileImage isVerified status createdAt"
          )
          .sort({
            isVerified: 1,
            fullName: 1,
          });

      res.status(200).json({
        success: true,
        count: workers.length,
        workers,
      });
    } catch (error) {
      console.error(
        "Get Police Verification Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch verification records.",
      });
    }
  };


// Verify / unverify worker
const updateWorkerVerification =
  async (req, res) => {
    try {
      const {
        isVerified,
      } = req.body;

      if (
        typeof isVerified !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isVerified must be true or false.",
        });
      }

      const worker =
        await User.findOne({
          _id: req.params.id,
          role: "worker",
        });

      if (!worker) {
        return res.status(404).json({
          success: false,
          message: "Worker not found.",
        });
      }

      worker.isVerified =
        isVerified;

      await worker.save();

      res.status(200).json({
        success: true,
        message: isVerified
          ? "Worker verified successfully."
          : "Worker verification removed.",
        worker: {
          _id: worker._id,
          fullName: worker.fullName,
          email: worker.email,
          phone: worker.phone,
          profileImage:
            worker.profileImage,
          isVerified:
            worker.isVerified,
          status: worker.status,
        },
      });
    } catch (error) {
      console.error(
        "Worker Verification Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update worker verification.",
      });
    }
  };


module.exports = {
  getPoliceWorkers,
  getPoliceWorkerById,
  getPoliceComplaints,
  getPoliceComplaintById,
  updatePoliceComplaint,
  createPoliceCase,
  getPoliceCases,
  getPoliceCaseById,
  updatePoliceCase,
  deletePoliceCase,
  getPoliceVerification,
  updateWorkerVerification,
};

