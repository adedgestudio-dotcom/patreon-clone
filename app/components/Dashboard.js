"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchUser, updateProfile } from "@/actions/useractions";
import { toast, Bounce } from "react-toastify";

const Dashboard = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ name: "" });

  useEffect(() => {
    if (session) {
      getData();
    } else {
      router.push("/login"); // if user is not logged in it will redirect to login page
    }
  }, [session, router]);

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

  return (
    <>
      <div className="container mx-auto py-5">
        <h1 className="text-center my-5 font-bold text-3xl text-[var(--color-text)]">
          Welcome to my Dashboard
        </h1>
        <form className="max-w-2xl mx-auto" action={handleSubmit}>
          {/* name */}
          <div className="my-2">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-[var(--color-text)]"
            >
              Name
            </label>
            <input
              value={form.name || ""}
              onChange={handleChange}
              type="text"
              name="name"
              id="name"
              className="block w-full p-2 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-xs focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>

          {/* email */}
          <div className="my-2">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-[var(--color-text)]"
            >
              Email
            </label>
            <input
              value={form.email || ""}
              onChange={handleChange}
              type="text"
              name="email"
              id="email"
              className="block w-full p-2 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-xs focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>
          {/* username */}
          <div className="my-2">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-[var(--color-text)]"
            >
              username
            </label>
            <input
              value={form.username || ""}
              onChange={handleChange}
              type="text"
              name="username"
              id="username"
              className="block w-full p-2 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-xs focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>

          {/* profile picture */}
          <div className="my-2">
            <label
              htmlFor="profilepicture"
              className="block mb-2 text-sm font-medium text-[var(--color-text)]"
            >
              Profile Picture
            </label>
            <input
              value={form.profilepicture || ""}
              onChange={handleChange}
              type="text"
              name="profilepicture"
              id="profilepicture"
              className="block w-full p-2 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-xs focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>

          {/* cover picture  */}
          <div className="my-2">
            <label
              htmlFor="CoverPicture"
              className="block mb-2 text-sm font-medium text-[var(--color-text)]"
            >
              cover picture
            </label>
            <input
              value={form.coverpicture || ""}
              onChange={handleChange}
              type="text"
              name="coverpicture"
              id="coverpicture"
              className="block w-full p-2 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-xs focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Razorpay id */}
          <div className="my-2">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-[var(--color-text)]"
            >
              Razorpay Id
            </label>
            <input
              value={form.razorpayid || ""}
              onChange={handleChange}
              type="text"
              name="razorpayid"
              id="razorpayid"
              className="block w-full p-2 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-xs focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Razorpay Secret */}
          <div className="my-2">
            <label
              htmlFor="razorpaysecret"
              className="block mb-2 text-sm font-medium text-[var(--color-text)]"
            >
              Razorpay Secret
            </label>
            <input
              value={form.razorpaysecret || ""}
              onChange={handleChange}
              type="text"
              name="razorpaysecret"
              id="razorpaysecret"
              className="block w-full p-2 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg bg-[var(--color-card)] text-xs focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            />
          </div>
          <button className="inline-flex items-center justify-center text-white bg-[var(--color-primary)] font-medium rounded-lg text-lg px-4 py-2.5 text-center leading-5 transition-all duration-200 hover:opacity-80 hover:ring-2 hover:ring-[var(--color-accent)] mt-3 w-full">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
