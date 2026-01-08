import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import payment from "@/app/models/payment";
import connectDb from "@/db/connectDb";
import User from "@/app/models/user";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.text();
    const params = new URLSearchParams(body);

    const razorpay_order_id = params.get("razorpay_order_id");
    const razorpay_payment_id = params.get("razorpay_payment_id");
    const razorpay_signature = params.get("razorpay_signature");

    // Verify the payment signature
    const isValid = validatePaymentVerification(
      {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      },
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (isValid) {
      // Update payment status in database
      const updatedPayment = await payment.findOneAndUpdate(
        { order_id: razorpay_order_id },
        {
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          status: "completed",
        },
        { new: true }
      );

      if (!updatedPayment) {
        console.error(
          "No payment record found with order_id:",
          razorpay_order_id
        );

        return NextResponse.redirect(new URL(`/?payment=error`, req.url));
      }

      return NextResponse.redirect(
        new URL(`/${updatedPayment.to_username}?payment=success`, req.url)
      );
    } else {
      // Get payment record for failed payment redirect
      const paymentRecord = await payment.findOne({
        order_id: razorpay_order_id,
      });
      const username = paymentRecord?.to_username || "";

      return NextResponse.redirect(
        new URL(`/${username}?payment=failed`, req.url)
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);

    // Try to get the payment record to redirect to the correct user page
    try {
      const paymentRecord = await payment.findOne({
        order_id: razorpay_order_id,
      });
      if (paymentRecord) {
        return NextResponse.redirect(
          new URL(`/${paymentRecord.to_username}?payment=error`, req.url)
        );
      }
    } catch (dbError) {
      console.error("Error fetching payment record:", dbError);
    }

    // Fallback redirect if we can't find the payment record
    return NextResponse.redirect(new URL("/?payment=error", req.url));
  }
}
