const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

dotenv.config();

// Routes
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const insuranceRoutes = require("./routes/insuranceRoutes");
const insuranceClaimRoutes = require("./routes/insuranceClaimRoutes");
const insuranceReportRoutes = require("./routes/insuranceReportRoutes");
const inspectionRoutes = require("./routes/inspectionRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const policeRoutes = require("./routes/policeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Connect Database
connectDB();

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WorkBridge API is Running",
  });
});

// Static uploads
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/insurance", insuranceRoutes);
app.use("/api/insurance/claims", insuranceClaimRoutes);
app.use("/api/insurance/reports", insuranceReportRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`WorkBridge API running on port ${PORT}`);
});