import express from "express";
import { sendMessage, getMessage } from "../controllers/message.controller.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()
router.post("/send/:id", checkAuth, sendMessage)
router.get("/get/:id", checkAuth, getMessage)

export default router