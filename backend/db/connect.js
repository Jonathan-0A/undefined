import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Get the URI from the .env file
    const mongoURI = process.env.MONGO_URI;

    // Connect to MongoDB Atlas
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit process with failure
  }
};

// Gracefully disconnect from MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
  } catch (err) {
    console.error("Error disconnecting from MongoDB:", err);
    process.exit(1); // Exit process with failure
  }
};

export { connectDB, disconnectDB };
