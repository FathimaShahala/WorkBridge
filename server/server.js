const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// Routes
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
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React Vite frontend
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
app.use("/api/complaints",complaintRoutes);
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});