const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
  getEmployerWorkers,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// Worker Routes
// ==========================================

// Apply for a job
router.post(
  "/",
  protect,
  authorize("worker"),
  applyForJob
);

// Get logged-in worker's applications
router.get(
  "/my",
  protect,
  authorize("worker"),
  getMyApplications
);

// ==========================================
// Employer Routes
// ==========================================

// Get applications for employer's jobs
router.get(
  "/employer",
  protect,
  authorize("employer"),
  getEmployerApplications
);

// Update application status
router.put(
  "/:id/status",
  protect,
  authorize("employer"),
  updateApplicationStatus
);

// ==========================================
// Get Employer's Hired Workers
// Employer only
// ==========================================
router.get(
  "/employer/workers",
  protect,
  authorize("employer"),
  getEmployerWorkers
);


module.exports = router;