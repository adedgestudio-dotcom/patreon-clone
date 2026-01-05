// Quick test to verify MongoDB connection
import mongoose from "mongoose";

const testConnection = async () => {
  try {
    console.log("Testing MongoDB connection...");
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Set" : "Not set");

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Successfully connected to MongoDB!");

    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};

testConnection();
