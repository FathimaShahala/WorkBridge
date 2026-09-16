
const express = require("express");

const insuranceController = require("../controllers/insuranceController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

console.log("========== INSURANCE DEBUG ==========");
console.log(
  "getMyInsurance:",
  typeof insuranceController.getMyInsurance
);

console.log(
  "getMyInsuranceById:",
  typeof insuranceController.getMyInsuranceById
);

console.log(
  "getInsuranceById:",
  typeof insuranceController.getInsuranceById
);

console.log(
  "createInsurance:",
  typeof insuranceController.createInsurance
);

console.log(
  "updateInsurance:",
  typeof insuranceController.updateInsurance
);

console.log(
  "deleteInsurance:",
  typeof insuranceController.deleteInsurance
);

console.log("protect:", typeof protect);
console.log("authorize:", typeof authorize);

console.log("====================================");

const router = express.Router();

// Worker Routes

router.get(
  "/my",
  protect,
  authorize("worker"),
  insuranceController.getMyInsurance
);

router.get(
  "/my/:id",
  protect,
  authorize("worker"),
  insuranceController.getMyInsuranceById
);

// Insurance Officer Routes

router.post(
  "/",
  protect,
  authorize("insurance"),
  insuranceController.createInsurance
);

router.get(
  "/",
  protect,
  authorize("insurance"),
  insuranceController.getAllInsurance
);

// ==========================================
// Insurance Workers
// ==========================================

router.get(
  "/workers",
  protect,
  authorize("insurance"),
  insuranceController.getInsuredWorkers
);

router.get(
  "/workers/:id",
  protect,
  authorize("insurance"),
  insuranceController.getInsuredWorkerById
);


router.get(
  "/:id",
  protect,
  authorize("insurance"),
  insuranceController.getInsuranceById
);

router.put(
  "/:id",
  protect,
  authorize("insurance"),
  insuranceController.updateInsurance
);

router.delete(
  "/:id",
  protect,
  authorize("insurance"),
  insuranceController.deleteInsurance
);

module.exports = router;
