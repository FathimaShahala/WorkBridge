
const express = require("express");

const {
  getInsuranceReports,
} = require("../controllers/insuranceReportController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("insurance"),
  getInsuranceReports
);

module.exports = router;
