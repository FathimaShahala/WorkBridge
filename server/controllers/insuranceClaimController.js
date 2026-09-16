
const InsuranceClaim = require("../models/InsuranceClaim");
const Insurance = require("../models/Insurance");

// ==========================================
// Create Claim
// ==========================================

const createClaim = async (req, res) => {
  try {
    const {
      insurance,
      claimNumber,
      claimType,
      claimAmount,
      incidentDate,
      description,
    } = req.body;

    const workerId = req.user._id || req.user.id;

    if (
      !insurance ||
      !claimNumber ||
      !claimType ||
      claimAmount === undefined ||
      !incidentDate ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const policy = await Insurance.findOne({
      _id: insurance,
      worker: workerId,
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Insurance policy not found.",
      });
    }

    const existingClaim =
      await InsuranceClaim.findOne({
        claimNumber: claimNumber.trim(),
      });

    if (existingClaim) {
      return res.status(409).json({
        success: false,
        message: "Claim number already exists.",
      });
    }

    const claim = await InsuranceClaim.create({
      worker: workerId,
      insurance,
      claimNumber: claimNumber.trim(),
      claimType: claimType.trim(),
      claimAmount,
      incidentDate,
      description: description.trim(),
    });

    const populatedClaim =
      await InsuranceClaim.findById(claim._id)
        .populate(
          "worker",
          "fullName email phone profileImage"
        )
        .populate(
          "insurance",
          "policyNumber insuranceProvider policyType coverageAmount"
        );

    return res.status(201).json({
      success: true,
      message: "Insurance claim submitted successfully.",
      claim: populatedClaim,
    });
  } catch (error) {
    console.error("Create Claim Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Get All Claims
// Insurance Officer
// ==========================================

const getAllClaims = async (req, res) => {
  try {
    const claims = await InsuranceClaim.find()
      .populate(
        "worker",
        "fullName email phone profileImage"
      )
      .populate(
        "insurance",
        "policyNumber insuranceProvider policyType coverageAmount"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    console.error("Get All Claims Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Get My Claims
// Worker
// ==========================================

const getMyClaims = async (req, res) => {
  try {
    const workerId = req.user._id || req.user.id;

    const claims = await InsuranceClaim.find({
      worker: workerId,
    })
      .populate(
        "insurance",
        "policyNumber insuranceProvider policyType coverageAmount"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: claims.length,
      claims,
    });
  } catch (error) {
    console.error("Get My Claims Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Get Claim By ID
// ==========================================

const getClaimById = async (req, res) => {
  try {
    const claim = await InsuranceClaim.findById(
      req.params.id
    )
      .populate(
        "worker",
        "fullName email phone profileImage"
      )
      .populate(
        "insurance",
        "policyNumber insuranceProvider policyType coverageAmount premiumAmount"
      );

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found.",
      });
    }

    return res.status(200).json({
      success: true,
      claim,
    });
  } catch (error) {
    console.error("Get Claim Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ==========================================
// Update Claim
// Insurance Officer
// ==========================================

const updateClaim = async (req, res) => {
  try {
    const claim = await InsuranceClaim.findById(
      req.params.id
    );

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found.",
      });
    }

    const {
      status,
      approvedAmount,
      officerNotes,
    } = req.body;

    if (status !== undefined) {
      claim.status = status;
    }

    if (approvedAmount !== undefined) {
      claim.approvedAmount = approvedAmount;
    }

    if (officerNotes !== undefined) {
      claim.officerNotes =
        officerNotes.trim();
    }

    await claim.save();

    const updatedClaim =
      await InsuranceClaim.findById(claim._id)
        .populate(
          "worker",
          "fullName email phone profileImage"
        )
        .populate(
          "insurance",
          "policyNumber insuranceProvider policyType coverageAmount"
        );

    return res.status(200).json({
      success: true,
      message: "Claim updated successfully.",
      claim: updatedClaim,
    });
  } catch (error) {
    console.error("Update Claim Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createClaim,
  getAllClaims,
  getMyClaims,
  getClaimById,
  updateClaim,
};
