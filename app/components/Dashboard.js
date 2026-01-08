"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchUser, updateProfile } from "@/actions/useractions";
import { toast, Bounce } from "react-toastify";

const Dashboard = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ name: "" });

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (status === "unauthenticated") {
      router.push("/login"); // if user is not logged in it will redirect to login page
    } else if (session?.user?.name) {
      const fetchData = async () => {
        let u = await fetchUser(session.user.name);
        setForm(u);
      };
      fetchData();
    }
  }, [session, status, router]);

  const getData = async () => {
    if (session?.user?.name) {
      let u = await fetchUser(session.user.name);
      setForm(u);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (session?.user?.name) {
      update();
      await updateProfile(form, session.user.name);

      toast("Profile Updated Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="container mx-auto py-5">
        <h1 className="text-center my-5 font-bold text-3xl text-white">
          Loading...
        </h1>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session?.user) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto py-5 px-6">
        <h1 className="text-center my-5 font-bold text-3xl text-white">
          Welcome to my Dashboard
        </h1>
        <form className="max-w-2xl mx-auto" action={handleSubmit}>
          {/* name */}
          <div className="my-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-white"
            >
              Name
            </label>
            <input
              value={form.name || ""}
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              className="block w-full p-2 text-white border border-gray-900 rounded-lg bg-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* email */}
          <div className="my-2">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              value={form.email || ""}
              onChange={handleChange}
              type="text"
              name="email"
              id="email"
              className="block w-full p-2 text-white border border-gray-900 rounded-lg bg-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* username */}
          <div className="my-2">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-white"
            >
              username
            </label>
            <input
              value={form.username || ""}
              onChange={handleChange}
              type="text"
              name="username"
              id="username"
              className="block w-full p-2 text-white border border-gray-900 rounded-lg bg-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* profile picture */}
          <div className="my-2">
            <label
              htmlFor="profilepicture"
              className="block mb-2 text-sm font-medium text-white"
            >
              Profile Picture
            </label>
            <input
              value={form.profilepicture || ""}
              onChange={handleChange}
              type="text"
              name="profilepicture"
              id="profilepicture"
              className="block w-full p-2 text-white border border-gray-900 rounded-lg bg-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* cover picture  */}
          <div className="my-2">
            <label
              htmlFor="CoverPicture"
              className="block mb-2 text-sm font-medium text-white"
            >
              cover picture
            </label>
            <input
              value={form.coverpicture || ""}
              onChange={handleChange}
              type="text"
              name="coverpicture"
              id="coverpicture"
              className="block w-full p-2 text-white border border-gray-900 rounded-lg bg-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Razorpay id */}
          <div className="my-2">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-white"
            >
              Razorpay Id
            </label>
            <input
              value={form.razorpayid || ""}
              onChange={handleChange}
              type="text"
              name="razorpayid"
              id="razorpayid"
              className="block w-full p-2 text-white border border-gray-900 rounded-lg bg-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Razorpay Secret */}
          <div className="my-2">
            <label
              htmlFor="razorpaysecret"
              className="block mb-2 text-sm font-medium text-white"
            >
              Razorpay Secret
            </label>
            <input
              value={form.razorpaysecret || ""}
              onChange={handleChange}
              type="text"
              name="razorpaysecret"
              id="razorpaysecret"
              className="block w-full p-2 text-white border border-gray-900 rounded-lg bg-gray-900 text-xs focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="inline-flex items-center justify-center text-white bg-gradient-to-br from-purple-900 to-blue-800 font-medium rounded-lg text-lg px-4 py-2.5 text-center leading-5 transition-all duration-200 hover:bg-gray-800 hover:bg-none hover:ring-2 hover:ring-purple-400 mt-3 w-full">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
