
const express = require("express");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  getComplaintStats,
} = require("../controllers/complaintController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// Worker
// ==========================================

// Create complaint
router.post(
  "/",
  protect,
  authorize("worker"),
  createComplaint
);

// Get my complaints
router.get(
  "/my",
  protect,
  authorize("worker"),
  getMyComplaints
);

// ==========================================
// Labour Officer
// ==========================================

// Complaint statistics
router.get(
  "/stats",
  protect,
  authorize("labourOfficer"),
  getComplaintStats
);

// Get all complaints
router.get(
  "/",
  protect,
  authorize("labourOfficer"),
  getAllComplaints
);

// Get complaint by ID
router.get(
  "/:id",
  protect,
  authorize("labourOfficer"),
  getComplaintById
);

// Update complaint
router.put(
  "/:id",
  protect,
  authorize("labourOfficer"),
  updateComplaint
);

module.exports = router;
