import mongoose from "mongoose";

const connectDb = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDb;
