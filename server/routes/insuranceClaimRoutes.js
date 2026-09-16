
const express = require("express");

const {
  createClaim,
  getAllClaims,
  getMyClaims,
  getClaimById,
  updateClaim,
} = require("../controllers/insuranceClaimController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// Worker
// ==========================================

router.post(
  "/",
  protect,
  authorize("worker"),
  createClaim
);

router.get(
  "/my",
  protect,
  authorize("worker"),
  getMyClaims
);

// ==========================================
// Insurance Officer
// ==========================================

router.get(
  "/",
  protect,
  authorize("insurance"),
  getAllClaims
);

router.get(
  "/:id",
  protect,
  authorize("insurance"),
  getClaimById
);

router.put(
  "/:id",
  protect,
  authorize("insurance"),
  updateClaim
);

module.exports = router;
