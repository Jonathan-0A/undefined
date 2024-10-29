import express from "express";
import { logIn, logOut, signUp, forgotPass } from "../controllers/auth.controller.js";
import checkAuth from "../middleware/checkNotAuth.js"; // Middleware to check if user is not authenticated
import path from "path"; // Import path module to handle file paths
import { dist } from "../distPath.js"; // Import the dist path

const router = express.Router();

// Serve login page
router.get("/login", checkAuth, (req, res) => {
  res.sendFile(path.join(dist, "index.html"), (err) => {
    if (err) {
      console.error("Error loading the login page:", err);
      res.status(500).json({ message: "Error loading the login page" });
    }
  });
});

// Serve signup page
router.get("/signup", checkAuth, (req, res) => {
  res.sendFile(path.join(dist, "index.html"), (err) => {
    if (err) {
      console.error("Error loading the signup page:", err);
      res.status(500).json({ message: "Error loading the signup page" });
    }
  });
});

router.post("/login", logIn);
router.post("/signup", signUp);
router.post("/logout", logOut);
router.post("/forgot-password", forgotPass);

export default router;
