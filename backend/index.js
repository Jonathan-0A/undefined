import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import checkPort from "./checkPort.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB, disconnectDB } from "./db/connect.js";
import cookieParser from "cookie-parser";
import { dist } from "./distPath.js";
import fileUpload from "express-fileupload";
import { Server as SocketIOServer } from "socket.io"; // Import Socket.IO

// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 3003;
const frontendUrl = process.env.FRONTEND_URL || `http://localhost:5173`;

// Middleware
app.use(express.static(dist));
app.use(
  cors({
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/message", messageRoutes);

// Fallback route to serve React frontend for any other route
app.use("*", (req, res) => {
  res.sendFile(path.join(dist, "index.html"), (err) => {
    if (err) {
      console.error("Error loading the page:", err);
      res.status(500).json({ message: "Error loading the page" });
    }
  });
});

// Global variables for server and Socket.IO instance
let server;
let io;

// Function to start the server
async function startServer() {
  try {
    await connectDB(); // Connect to the database before starting the server
    // Check if port is in use before starting the server
    checkPort(port, async (isInUse) => {
      if (isInUse) {
        console.error(`Port ${port} is already in use. Please choose another port.`);
        process.exit(1); // Exit process if the port is unavailable
      } else {
        // Start the server
        server = app.listen(port, () => {
          // console.log(`Server is running on port ${port}`);
          console.log(`Backend: http://localhost:${port}`);
          console.log(`Frontend: ${frontendUrl}`);
        });

        // Initialize Socket.IO with the server
        io = new SocketIOServer(server, {
          cors: {
            origin: frontendUrl, // Allow frontend to connect
            methods: ["GET", "POST"],
            credentials: true,
          },
          transports: ["websocket", "polling"],
        });

        console.log("Socket.IO server initialized.");

        // Handle Socket.IO connections
        io.on("connection", (socket) => {
          console.log(`User [${socket.id}] connected [${new Date().toLocaleTimeString()}]`);
          console.log("Number of connected clients:", io.sockets.sockets.size);

          // Emit confirmation to the client
          socket.emit("connectionConfirmed", "You are connected with Socket.IO");

          // Listen for "clientMessage" event from clients
          socket.on("clientMessage", (message) => {
            console.log(`Message received from client (${socket.id}): ${message.content}`);
            io.emit("message", message);
          });

          // Handle disconnect events
          socket.on("disconnect", () => {
            console.log(`User (${socket.id}) disconnected [${new Date().toLocaleTimeString()}]`);
          });
        });
      }
    });
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit if database connection fails
  }
}

// Cleanup function
async function cleanupServer() {
  console.log("Cleaning up server...");
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    console.log("Server closed.");
  }
  await disconnectDB();
  console.log("Database disconnected.");
}

// Graceful shutdown on Nodemon restart or process exit
async function gracefulShutdown() {
  console.log("Shutting down server gracefully...");
  await cleanupServer();
  process.exit(0); // Exit after cleanup
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("exit", gracefulShutdown);

// Start the server
startServer();
