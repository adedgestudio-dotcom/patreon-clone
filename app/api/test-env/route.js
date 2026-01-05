import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasGithubId: !!process.env.GITHUB_ID,
    hasGithubSecret: !!process.env.GITHUB_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL, // Safe to show
    publicUrl: process.env.NEXT_PUBLIC_URL, // Safe to show
  });
}
