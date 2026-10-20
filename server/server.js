
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

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://work-bridge-blush.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(`CORS blocked origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Handle preflight requests
app.options(/.*/, cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// General middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WorkBridge API is Running",
  });
});

// Static uploads
app.use("/uploads", express.static("uploads"));

// API routes
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed by CORS",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Connect database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`WorkBridge API running on port ${PORT}`);
});
