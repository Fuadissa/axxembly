import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Database is already connected.");
      return;
    }

    // Ensure MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined.");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error(
      "Error connecting to MongoDB:",
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    process.exit(1); // Exit the process with failure
  }
};

export default dbConnect;
