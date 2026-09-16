const Attendance = require("../models/Attendance");

// ==========================================
// Check In
// ==========================================
const checkIn = async (req, res) => {
  try {
    const workerId = req.user.id;

    // Current date: YYYY-MM-DD
    const today = new Date()
      .toISOString()
      .split("T")[0];

    // Check if already checked in today
    const existingAttendance =
      await Attendance.findOne({
        worker: workerId,
        date: today,
      });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message:
          "You have already checked in today.",
        attendance: existingAttendance,
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      worker: workerId,
      date: today,
      checkIn: new Date(),
      status: "present",
    });

    // Populate worker details
    const populatedAttendance =
      await Attendance.findById(
        attendance._id
      ).populate(
        "worker",
        "fullName email phone profileImage"
      );

    res.status(201).json({
      success: true,
      message: "Check-in successful.",
      attendance: populatedAttendance,
    });
  } catch (error) {
    console.error(
      "Check In Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to check in.",
    });
  }
};

// ==========================================
// Check Out
// ==========================================
const checkOut = async (req, res) => {
  try {
    const workerId = req.user.id;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    // Find today's attendance
    const attendance =
      await Attendance.findOne({
        worker: workerId,
        date: today,
      });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message:
          "You have not checked in today.",
      });
    }

    // Already checked out
    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message:
          "You have already checked out today.",
        attendance,
      });
    }

    // Update checkout
    attendance.checkOut = new Date();

    await attendance.save();

    // Populate worker details
    const populatedAttendance =
      await Attendance.findById(
        attendance._id
      ).populate(
        "worker",
        "fullName email phone profileImage"
      );

    res.status(200).json({
      success: true,
      message: "Check-out successful.",
      attendance: populatedAttendance,
    });
  } catch (error) {
    console.error(
      "Check Out Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to check out.",
    });
  }
};

// ==========================================
// Get My Attendance
// ==========================================
const getMyAttendance = async (
  req,
  res
) => {
  try {
    const workerId = req.user.id;

    const attendance =
      await Attendance.find({
        worker: workerId,
      })
        .populate(
          "worker",
          "fullName email phone profileImage"
        )
        .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error(
      "Get My Attendance Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch attendance.",
    });
  }
};

// ==========================================
// Get Today's Attendance
// ==========================================
const getTodayAttendance = async (
  req,
  res
) => {
  try {
    const workerId = req.user.id;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const attendance =
      await Attendance.findOne({
        worker: workerId,
        date: today,
      }).populate(
        "worker",
        "fullName email phone profileImage"
      );

    res.status(200).json({
      success: true,
      attendance: attendance || null,
    });
  } catch (error) {
    console.error(
      "Get Today Attendance Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch today's attendance.",
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMyAttendance,
  getTodayAttendance,
};