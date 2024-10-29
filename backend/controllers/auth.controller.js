import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Sign Up Function
export const signUp = async (req, res) => {
  try {
    const { name, username, email, phone, password, gender } = req.body;

    // Input Validation
    if (!name || !username || !email ||!phone || !password || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Ensure strong password hashing (bcrypt rounds of 12 for better security)
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(password, salt);

    // Determine avatar image based on gender
    const gen = gender === "male" ? "boy" : "girl";

    // Create a new user instance
    const newUser = new User({
      name,
      username,
      email,
      phone,
      password: hashedPass,  // Save the hashed password
      gender,
      avatarImage: `https://avatar.iran.liara.run/public/${gen}?username=${username}`,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    console.error("Error in signUp:", e);

    // Handle duplicate key error (MongoDB message code 11000)
    if (e.code === 11000) {
      const duplicateField = Object.keys(e.keyValue)[0];
      return res.status(400).json({
        message: `${duplicateField} already exists`,
        fieldErrors: { [duplicateField]: `${duplicateField} already exists` }
      });
    }

    // General server error
    res.status(500).json({ message: `Internal server error: ${e.message}` });
  }
};

// Log In Function
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = await user.generateAuthToken();

    // Set the token in a cookie
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 86400000), // 1 day
      httpOnly: true,
      sameSite: "Strict", // Prevents CSRF attacks by restricting the cookie to the same site
      secure: process.env.NODE_ENV === "production", // Use 'secure' only in production
    });

    // Return user details
    return res.status(200).json({
      message: "User logged in successfully!",
      _id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      gender: user.gender,
      avatarImage: user.avatarImage,
      joined: user.createdAt,
    });
  } catch (e) {
    console.error("Error in logIn:", e);
    return res.status(500).json({ message: `Internal server error: ${e.message}` });
  }
};

// Log Out Function
export const logOut = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (e) {
    console.error("Error in logOut:", e);
    return res.status(500).json({ message: `Internal server error: ${e.message}` });
  }
};

// Forgot Password Function
export const forgotPass = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    // Set the reset token and its expiration (e.g., 1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    // Create a nodemailer transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'arpanghosh2106@gmail.com',
        pass: 'Arpan@2106'
      }
    });
    // Send the password reset email
    const resetLink = `http://your-website.com/reset-password/${resetToken}`;
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>
You requested a password reset. Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (e) {
    console.error("Error in forgotPass:", e);
    return res.status(500).json({ message: `Internal server error: ${e.message}` });
  }
};
