import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "Name must be at least 3 characters long"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    minLength: [3, "Username must be at least 3 characters long"],
    unique: true,
    trim: true,
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"], // Regex for username validation
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"], // Regex for email validation
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], // Regex for phone number validation
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [6, "Password must be at least 6 characters long"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["male", "female", "other"], // Restrict gender to specific values
    default: "other", // Default gender as "not specified"
  },
  avatarImage: {
    type: String,
    default: "https://i.pravatar.cc/150?img=3", // Default avatar image URL
    public_id: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  skills: {
    type: [String], // Change to array of strings for skills
    default: [], // Default to an empty array
  },
  experience: [
    {
      company: {
        type: String,
        required: [true, "Company name is required"],
      },
      role: {
        type: String,
        required: [true, "Role is required"],
      },
      duration: {
        type: String,
        required: [true, "Duration is required"],
      },
    },
  ],
  education: [
    {
      institution: {
        type: String,
        required: [true, "Institution name is required"],
      },
      degree: {
        type: String,
        required: [true, "Degree is required"],
      },
      year: {
        type: String,
        required: [true, "Year is required"],
      },
    },
  ],
  interests: {
    type: [String], // Change to array of strings for interests
    default: [], // Default to an empty array
  },
  socialLinks: {
    linkedin: {
      type: String,
      trim: true,
      // match: [/^(https?:\/\/)?(www\.)?(linkedin\.com\/in\/[A-z0-9_-]+)$/, "Please enter a valid LinkedIn URL"],
    },
    github: {
      type: String,
      trim: true,
      // match: [/^(https?:\/\/)?(www\.)?(github\.com\/[A-z0-9_-]+)$/, "Please enter a valid GitHub URL"],
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

userSchema.methods.generateAuthToken = async function () {
  try {
    let newToken = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // this.tokens = this.tokens.concat({ token: newToken });
    await this.save();
    return newToken;
  } catch (e) {
    console.error("Error generating token:", e);
    throw new Error("Token generation failed."); // Throw error for calling function to handle
  }
};

// Create User model
const User = mongoose.model("User", userSchema);

export default User;
