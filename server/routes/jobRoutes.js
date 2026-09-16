const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// Get all open jobs
// ==========================================
router.get("/", getJobs);

// Get employer's own jobs
router.get(
  "/my",
  protect,
  authorize("employer"),
  getMyJobs
);

// ==========================================
// Get single job
// ==========================================
router.get("/:id", getJobById);

// ==========================================
// Create new job
// Employer only
// ==========================================
router.post(
  "/",
  protect,
  authorize("employer"),
  createJob
);

// ==========================================
// Update job
// Employer only
// ==========================================
router.put(
  "/:id",
  protect,
  authorize("employer"),
  updateJob
);

// ==========================================
// Delete job
// Employer only
// ==========================================
router.delete(
  "/:id",
  protect,
  authorize("employer"),
  deleteJob
);

module.exports = router;