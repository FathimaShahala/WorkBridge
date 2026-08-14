
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../services/generateToken");

// Allowed WorkBridge roles
const allowedRoles = [
  "admin",
  "worker",
  "employer",
  "labourOfficer",
  "police",
  "insurance",
];

// ==============================
// Register User
// ==============================
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      role,
    } = req.body;

    // Validation
    if (!fullName || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Validate role
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected.",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Normalize phone
    const normalizedPhone = phone.trim();

    // Check existing user
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered.",
        });
      }

      if (existingUser.phone === normalizedPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number is already registered.",
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",

      token: generateToken(user._id, user.role),

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ==============================
// Login User
// ==============================
const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Check account status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful.",

      token: generateToken(user._id, user.role),

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
};

