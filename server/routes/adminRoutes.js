
const express = require("express");

const {
  getAdminDashboard,

  getAllUsers,
  getUserById,
  updateUserVerification,
  updateUserStatus,
  deleteUser,

  getAdminEmployers,
  getAdminEmployerById,
  updateEmployerVerification,
  updateEmployerStatus,

  getAdminWorkers,
  getAdminWorkerById,
  updateWorkerVerification,
  updateWorkerStatus,

  getAdminJobs,
  getAdminJobById,
  updateAdminJobStatus,
  deleteAdminJob,

  getAdminComplaints,
  getAdminComplaintById,
  updateAdminComplaintStatus,
  deleteAdminComplaint,
  getAdminComplaintStats,

  getAdminReports,

  getAdminSettings,
  updateAdminSettings,
} = require("../controllers/admincontroller");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getAdminDashboard
);


// ==========================================
// ADMIN USERS
// ==========================================

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

router.get(
  "/users/:id",
  protect,
  authorize("admin"),
  getUserById
);

router.put(
  "/users/:id/verification",
  protect,
  authorize("admin"),
  updateUserVerification
);

router.put(
  "/users/:id/status",
  protect,
  authorize("admin"),
  updateUserStatus
);

router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
);


// ==========================================
// ADMIN EMPLOYERS
// ==========================================

router.get(
  "/employers",
  protect,
  authorize("admin"),
  getAdminEmployers
);

router.get(
  "/employers/:id",
  protect,
  authorize("admin"),
  getAdminEmployerById
);

router.put(
  "/employers/:id/verification",
  protect,
  authorize("admin"),
  updateEmployerVerification
);

router.put(
  "/employers/:id/status",
  protect,
  authorize("admin"),
  updateEmployerStatus
);


// ==========================================
// ADMIN WORKERS
// ==========================================

router.get(
  "/workers",
  protect,
  authorize("admin"),
  getAdminWorkers
);

router.get(
  "/workers/:id",
  protect,
  authorize("admin"),
  getAdminWorkerById
);

router.put(
  "/workers/:id/verification",
  protect,
  authorize("admin"),
  updateWorkerVerification
);

router.put(
  "/workers/:id/status",
  protect,
  authorize("admin"),
  updateWorkerStatus
);


// ==========================================
// ADMIN JOBS
// ==========================================

// Get all jobs
router.get(
  "/jobs",
  protect,
  authorize("admin"),
  getAdminJobs
);

// Get single job
router.get(
  "/jobs/:id",
  protect,
  authorize("admin"),
  getAdminJobById
);

// Update job status
router.put(
  "/jobs/:id/status",
  protect,
  authorize("admin"),
  updateAdminJobStatus
);

// Delete job
router.delete(
  "/jobs/:id",
  protect,
  authorize("admin"),
  deleteAdminJob
);

// ==========================================
// ADMIN - COMPLAINTS
// ==========================================

router.get(
  "/complaints/stats",
  protect,
  authorize("admin"),
  getAdminComplaintStats
);

router.get(
  "/complaints",
  protect,
  authorize("admin"),
  getAdminComplaints
);

router.get(
  "/complaints/:id",
  protect,
  authorize("admin"),
  getAdminComplaintById
);

router.put(
  "/complaints/:id/status",
  protect,
  authorize("admin"),
  updateAdminComplaintStatus
);

router.delete(
  "/complaints/:id",
  protect,
  authorize("admin"),
  deleteAdminComplaint
);

// ========================================== 
// ADMIN - REPORTS 
// ========================================== 
router.get( 
    "/reports", 
    protect, 
    authorize("admin"),
     getAdminReports 
    );

// ========================================== 
// ADMIN - SETTINGS 
// ========================================== 
router.get( 
    "/settings", 
    protect, 
    authorize("admin"),
     getAdminSettings 
    );
router.put( 
    "/settings", 
    protect, 
    authorize("admin"),
     updateAdminSettings 
    );

module.exports = router;
