import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";

export async function GET() {
  try {
    await connectDb();
    return NextResponse.json({
      success: true,
      message: "Dataconnected successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
