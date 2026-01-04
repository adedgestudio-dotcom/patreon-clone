import mongoose from "mongoose";

const schema = new mongoose.Schema( // Controls and validates account + donation data for dashboard (users + payments)
  {
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    profilepicture: {
      type: String,
    },
    coverpicture: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayid: {
      type: String,
    },
    razorpaysecret: {
      type: String,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
  }
);

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", schema);
