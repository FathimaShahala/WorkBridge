
const express = require("express");

const {
  createInspection,
  getAllInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
  getInspectionStats,
} = require("../controllers/inspectionController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// Labour Officer
// ==========================================

// Create inspection
router.post(
  "/",
  protect,
  authorize("labourOfficer"),
  createInspection
);

// Statistics
router.get(
  "/stats",
  protect,
  authorize("labourOfficer"),
  getInspectionStats
);

// Get all inspections
router.get(
  "/",
  protect,
  authorize("labourOfficer"),
  getAllInspections
);

// Get inspection by ID
router.get(
  "/:id",
  protect,
  authorize("labourOfficer"),
  getInspectionById
);

// Update inspection
router.put(
  "/:id",
  protect,
  authorize("labourOfficer"),
  updateInspection
);

// Delete inspection
router.delete(
  "/:id",
  protect,
  authorize("labourOfficer"),
  deleteInspection
);

module.exports = router;
