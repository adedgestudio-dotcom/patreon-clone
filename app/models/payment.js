import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentSchema = new Schema( // Controls and validates account + donation data for dashboard (users + payments)
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    to_username: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    payment_id: {
      type: String,
    },
    signature: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "failed"],
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
  }
);

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Payment) {
  delete mongoose.models.Payment;
}

export default mongoose.model("Payment", paymentSchema);
