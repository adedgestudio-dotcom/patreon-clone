import React from "react";
import PaymentPage from "../components/PaymentPage";
import { getUserByUsername } from "@/actions/useractions";
import { notFound } from "next/navigation";
import user from "../models/user";
import connectDb from "@/db/connectDb";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  return {
    title: `Support @${resolvedParams.username} - Get Me A Chai`,
    description: `Support ${resolvedParams.username} by buying them a chai. Show your appreciation for their work.`,
  };
}

const Username = async ({ params }) => {
  //if the username is not present in database show 404page
  const resolvedParams = await params;

  const checkUser = async () => {
    await connectDb();
    let u = await user.findOne({ username: resolvedParams.username });
    if (!u) return notFound();
  };

  await checkUser();

  // For now, let's skip the database check and just render the page
  // You can uncomment these lines once you have users in your database
  // const userData = await getUserByUsername(params.username);
  // if (!userData) {
  //   notFound();
  // }

  return <PaymentPage username={resolvedParams.username} />;
};

export default Username;
