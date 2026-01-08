"use server";

import Razorpay from "razorpay";
import payment from "@/app/models/payment";
import connectDb from "@/db/connectDb";
import user from "@/app/models/user";

export const initiate = async (amount, to_username, paymentform) => {
  try {
    await connectDb();

    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    let options = {
      amount: Number.parseInt(amount),
      currency: "INR",
    };

    let x = await instance.orders.create(options);

    // Save payment record to database with pending status
    await payment.create({
      order_id: x.id,
      amount: amount,
      to_username: to_username,
      name: paymentform.name,
      message: paymentform.message,
      status: "pending", // Mark as pending initially
    });

    return x.id;
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw new Error(`Payment initiation failed: ${error.message}`);
  }
};

export const fetchUser = async (username) => {
  await connectDb();
  let u = await user.findOne({ username: username }).lean();
  if (!u) return null;

  // Convert ObjectId to string for serialization
  return {
    ...u,
    _id: u._id.toString(),
  };
};

export const getUserByUsername = async (username) => {
  await connectDb();
  let u = await user.findOne({ username: username }).lean();
  if (!u) return null;

  // Convert ObjectId to string for serialization
  return {
    ...u,
    _id: u._id.toString(),
  };
};

export const fetchPayments = async (username) => {
  await connectDb();

  //find all completed payments sorted by decreasing order of amount
  let payments = await payment
    .find({
      to_username: username,
      status: "completed", // Only show completed payments
    })
    .sort({ amount: -1 })
    .limit(10) // Show only top 10 payments
    .lean();

  // Convert ObjectIds to strings for serialization
  return payments.map((payment) => ({
    ...payment,
    _id: payment._id.toString(),
  }));
};

export const fetchPaymentStats = async (username) => {
  await connectDb();

  // Get all completed payments for the user
  let payments = await payment
    .find({
      to_username: username,
      status: "completed",
    })
    .lean();

  // Calculate stats
  const totalPayments = payments.length;
  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

  // Count unique supporters by name (you could also use email if available)
  const uniqueSupporters = new Set(
    payments.map((p) => p.name.toLowerCase().trim())
  );
  const totalMembers = uniqueSupporters.size;

  return {
    totalMembers,
    totalPayments,
    totalEarnings: totalEarnings / 100, // Convert paise to rupees
  };
};

export const updateProfile = async (data, username) => {
  await connectDb();
  let ndata = data; // data is already an object, no need to convert from FormData
  //if username is being updated ,check if username is available
  if (username !== ndata.username) {
    let u = await user.findOne({ username: ndata.username });
    if (u) {
      return { error: "Username already exists" };
    }
    await user.updateOne({ username: username }, ndata);

    //now update all payments with old username to new username
    await payment.updateMany(
      { to_username: username },
      { $set: { to_username: ndata.username } }
    );
  } else {
    await user.updateOne({ username: username }, ndata);
  }
};
