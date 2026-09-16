const express = require("express");

const {
  getProfile,
  updateProfile,
  uploadProfile,
  getWorkers,
  getLabourOfficerDashboard,
  getEmployers,
  getPoliceDashboard,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


const uploadProfileImage = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================================
// Get all active workers
// ==========================================
router.get(
  "/workers",
  protect,
  getWorkers
);

// ==========================================
// Get all employers
// Labour Officer
// ==========================================
router.get(
  "/employers",
  protect,
  authorize("labourOfficer"),
  getEmployers
);

// ==========================================
// Get profile
// ==========================================
router.get(
  "/profile",
  protect,
  getProfile
);

// ==========================================
// Update profile details
// ==========================================
router.put(
  "/profile",
  protect,
  updateProfile
);

// ==========================================
// Upload profile image
// ==========================================
router.post(
  "/profile/image",
  protect,
  uploadProfileImage.single("profileImage"),
  uploadProfile
);

// ==========================================
// Labour Officer Dashboard
// ==========================================

router.get(
  "/labour-officer/dashboard",
  protect,
  authorize("labourOfficer"),
  getLabourOfficerDashboard
);


// ==========================================
// Police Dashboard
// ==========================================
router.get(
  "/police/dashboard",
  protect,
  authorize("police"),
  getPoliceDashboard
);



module.exports = router;