const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { addCoins } = require("../controllers/supercoins.controllers");
const Otp = require("../models/Otp"); // import the model
const sendEmail = require("../utils/sendEmail");

router.post("/signup", async (req, res) => {
  try {
    const { name, mobile, password, email } = req.body;
    console.log("Received signup request:", req.body);

    if (!mobile || !password || !name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let existingUser = await User.findOne({ mobile });

    if (existingUser) {
      if (existingUser.isOtpVerified) {
        return res
          .status(409)
          .json({ message: "Mobile already registered and verified" });
      } else {
        // 🔁 Re-send OTP if user exists but not verified
        await Otp.deleteMany({ email }); // cleanup old OTPs

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await new Otp({
          email,
          otp: otpCode,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        }).save();

        await sendEmail(email, "Your OTP Code", `Your OTP is: ${otpCode}`);

        return res.status(200).json({
          message:
            "User already exists but not verified. OTP re-sent to email.",
        });
      }
    }

    // 🆕 Create new user
    const user = new User({
      name,
      mobile,
      email,
      password,
      isOtpVerified: false,
    });
    await user.save();

    await addCoins(user._id, 10, "registration", "Welcome bonus");

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await new Otp({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    }).save();

    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otpCode}`);

    res.status(201).json({
      message: "User registered successfully, and OTP sent to your email",
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("Received OTP verification request:", req.body);

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const existingOtp = await Otp.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    if (existingOtp.expiresAt < new Date()) {
      return res.status(410).json({ message: "OTP has expired" });
    }

    // ✅ Mark user as verified
    await User.updateOne({ email }, { isOtpVerified: true });

    // 🧹 Delete OTP after verification
    await Otp.deleteMany({ email });

    // ✅ Fetch user to generate token
    const updatedUser = await User.findOne({ email });
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found after OTP verification" });
    }
    console.log("Updated User:", updatedUser);
    // ✅ Generate Access & Refresh Tokens
    const accessToken = jwt.sign(
      { user: { id: updatedUser._id, role: updatedUser.role } },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // ⏰ short-lived access token
    );

    const refreshToken = jwt.sign(
      { user: { id: updatedUser._id } },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // ⏳ longer-lived refresh token
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      data: {
        email: updatedUser.email,
        isOtpVerified: updatedUser.isOtpVerified,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    return res
      .status(500)
      .json({ message: "Server error during OTP verification" });
  }
});
// User Login
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res
        .status(400)
        .json({ message: "Mobile and password are required" });
    }

    const user = await User.findOne({ mobile });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    // console.log(process.env.JWT_SECRET);

    const accessToken = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // ⏰ short lifespan
    );

    const refreshToken = jwt.sign(
      { user: { id: user._id } },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // ⏳ longer lifespan
    );

    res.status(200).json({
      message: "Login successfull",
      data: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;

router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // 🧾 Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token" });
      }

      const userPayload = { id: decoded.user.id, role: decoded.user.role };

      // 🔐 Generate new access & refresh tokens
      const newAccessToken = jwt.sign(
        { user: userPayload },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const newRefreshToken = jwt.sign(
        { user: userPayload },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Tokens refreshed successfully",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        // oldRefreshToken: refreshToken
      });
    });
  } catch (err) {
    console.error("Refresh Token Error:", err);
    res.status(500).json({ message: "Server error during token refresh" });
  }
});

module.exports = router;
