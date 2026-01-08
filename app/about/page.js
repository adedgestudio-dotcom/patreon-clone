import React from "react";

export const metadata = {
  title: "About - Get Me A Chai",
  description:
    "Learn more about Get Me A Chai, a crowdfunding platform designed for creators to receive support from their fans.",
};

const About = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">
          About Get Me A Chai
        </h1>

        <div className="space-y-6 text-lg text-gray-300">
          <p>
            Get Me A Chai is a crowdfunding platform designed for creators to
            receive support from their fans and followers. It's a simple way for
            your audience to show appreciation for your work.
          </p>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">
            How It Works
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Creators sign up and set up their profile</li>
            <li>Share your unique page link with your audience</li>
            <li>Supporters can contribute any amount they choose</li>
            <li>Receive payments directly to your account</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-8 mb-4">
            Why Get Me A Chai?
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Easy to set up and use</li>
            <li>Secure payment processing</li>
            <li>No monthly fees</li>
            <li>Direct support from your community</li>
          </ul>

          <div className="mt-12 text-center">
            <p className="text-xl">Ready to get started?</p>
            <a
              href="/login"
              className="inline-block mt-4 text-white bg-gradient-to-br from-purple-600 to-blue-500 font-medium rounded-lg text-lg px-6 py-3 hover:ring-2 hover:ring-purple-400"
            >
              Join Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
