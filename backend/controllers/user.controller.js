import User from "../models/user.model.js";

export const editProfile = async (req, res) => {
    try {
        let { name, username, email, bio, location, gender, phone, skills, experience, education, interests, socialLinks } = req.body;
        // Parse JSON strings back into objects/arrays if necessary
        skills = JSON.parse(skills || "[]");
        experience = JSON.parse(experience || "[]");
        education = JSON.parse(education || "[]");
        interests = JSON.parse(interests || "[]");
        socialLinks = JSON.parse(socialLinks || "{}")

        const userId = req.user._id; // Get user ID from the authenticated user
        let avatarImage = req.user.avatarImage;
        // Handle avatar image upload
        if (req.files && req.files.photo) {
            const file = req.files.photo;
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "avatars",
                public_id: `${userId}_avatar`,
            });
            // console.log(result)
            avatarImage = result.secure_url;
        }
        // Find the user and update their information
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name, username, email, bio, location, gender,
                avatarImage, phone, skills, experience,
                education, interests, socialLinks
            },
            { new: true, runValidators: true } // Return the updated document and apply validation
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the updated user information
        return res.status(200).json(updatedUser);
    } catch (e) {
        console.error("Error updating user:", e); // Log the error to the console
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getUser = async (req, res) => {
    try {
        return res.status(200).json(req.user); // Return user data as JSON
    } catch (err) {
        console.error("Error fetching user data:", err);
        if (err.name === "MongoError" || err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user data" });
        } else if (err.message.includes("failed to connect")) {
            return res.status(500).json({ message: "Database unavailable" });
        } else {
            return res.status(500).json({ message: "Failed to fetch user data" });
        }
    }
}
export const getAllUsers = async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const allUsers = await User.find({ _id: { $ne: loggedUser } }).select("-password -tokens");

        res.status(200).json({ allUsers });
    } catch (error) {
        console.log("Error getting all users: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
