import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { editProfile, getAllUsers, getUser, getUserById } from "../controllers/user.controller.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const router = express.Router();

router.get("/", checkAuth, getUser);
router.put("/edit-profile", checkAuth, editProfile);
router.get("/all", checkAuth, getAllUsers);
router.get("/:id", checkAuth, getUserById); 

export default router;
