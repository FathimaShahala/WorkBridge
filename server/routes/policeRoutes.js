

const express = require("express");

const {
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
} = require("../controllers/policeController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();


/*
============================================================
WORKERS
============================================================
*/

router.get(
  "/workers",
  protect,
  authorize("police"),
  getPoliceWorkers
);

router.get(
  "/workers/:id",
  protect,
  authorize("police"),
  getPoliceWorkerById
);


/*
============================================================
COMPLAINTS
============================================================
*/

router.get(
  "/complaints",
  protect,
  authorize("police"),
  getPoliceComplaints
);

router.get(
  "/complaints/:id",
  protect,
  authorize("police"),
  getPoliceComplaintById
);

router.put(
  "/complaints/:id",
  protect,
  authorize("police"),
  updatePoliceComplaint
);


/*
============================================================
CASES
============================================================
*/

router.post(
  "/cases",
  protect,
  authorize("police"),
  createPoliceCase
);

router.get(
  "/cases",
  protect,
  authorize("police"),
  getPoliceCases
);

router.get(
  "/cases/:id",
  protect,
  authorize("police"),
  getPoliceCaseById
);

router.put(
  "/cases/:id",
  protect,
  authorize("police"),
  updatePoliceCase
);

router.delete(
  "/cases/:id",
  protect,
  authorize("police"),
  deletePoliceCase
);


/*
============================================================
VERIFICATION
============================================================
*/

router.get(
  "/verification",
  protect,
  authorize("police"),
  getPoliceVerification
);

router.put(
  "/verification/:id",
  protect,
  authorize("police"),
  updateWorkerVerification
);


module.exports = router;

