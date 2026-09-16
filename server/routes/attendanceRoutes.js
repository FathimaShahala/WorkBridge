const express = require("express");

const {
  checkIn,
  checkOut,
  getMyAttendance,
  getTodayAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// Worker Attendance Routes
// ==========================================

// Check in
router.post(
  "/check-in",
  protect,
  authorize("worker"),
  checkIn
);

// Check out
router.post(
  "/check-out",
  protect,
  authorize("worker"),
  checkOut
);

// Get today's attendance
router.get(
  "/today",
  protect,
  authorize("worker"),
  getTodayAttendance
);

// Get complete attendance history
router.get(
  "/my",
  protect,
  authorize("worker"),
  getMyAttendance
);

module.exports = router;