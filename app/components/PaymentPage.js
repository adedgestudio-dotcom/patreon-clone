"use client";
import React, { useEffect } from "react";
import Script from "next/script";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  fetchUser,
  fetchPayments,
  fetchPaymentStats,
  initiate,
} from "@/actions/useractions";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const PaymentPage = ({ username }) => {
  const [paymentform, setpaymentform] = useState({
    name: "",
    message: "",
    amount: "",
  });
  const { data: session } = useSession();
  const [currentUser, setcurrentUser] = useState({});
  const [payments, setpayments] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPayments: 0,
    totalEarnings: 0,
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    if (session) {
      getData();
    }
  }, [session, username]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const paymentStatus = searchParams.get("payment");

      if (paymentStatus === "success") {
        toast.success("Payment Successful! Thank you for your support😊", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        getData();
      } else if (paymentStatus === "failed") {
        toast.error("❌ Payment failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (paymentStatus === "error") {
        toast.error("⚠️ Payment error occurred. Please contact support.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleChange = (e) => {
    setpaymentform({
      ...paymentform,
      [e.target.name]: e.target.value,
    });
  };

  const getData = async () => {
    let u = await fetchUser(username);
    setcurrentUser(u || {});

    let dbpayments = await fetchPayments(username);
    setpayments(dbpayments);

    let statsData = await fetchPaymentStats(username);
    setStats(statsData);
  };

  const pay = async (amount) => {
    try {
      if (!paymentform.name || paymentform.name.trim().length < 3) {
        toast.error("Please enter a valid name (at least 3 characters)");
        return;
      }

      if (!paymentform.message || paymentform.message.trim().length < 4) {
        toast.error("Please enter a message (at least 4 characters)");
        return;
      }

      if (!currentUser.razorpayid) {
        toast.error("Payment not configured. Please contact the creator.");
        return;
      }

      let order_id = await initiate(amount, username, paymentform);

      var options = {
        key: currentUser.razorpayid,
        amount: amount,
        currency: "INR",
        name: "Get Me A Chai",
        description: "Support " + username,
        image: "https://example.com/your_logo",
        order_id: order_id,
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
        prefill: {
          name: paymentform.name || "Anonymous",
          email: "user@example.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment initialization failed. Please try again.");
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="cover relative">
        <img
          className="h-48 md:h-64 lg:h-[300px] w-full object-cover"
          src={currentUser?.coverpicture || "/tea.gif"}
          alt="Cover"
        />
        <div className="image-profile absolute -bottom-12 md:-bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            className="rounded-xl ring-2 ring-gray-800 w-24 h-24 md:w-32 md:h-32 lg:w-[130px] lg:h-[130px]"
            src={currentUser?.profilepicture || "/avatar.gif"}
            alt="Profile"
          />
        </div>
      </div>

      <div className="info my-16 md:my-20 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 mt-2">
          @{username}
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-4 md:mb-6 text-center">
          Lets help {username} get a chai!
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-center">
          <div className="px-3 md:px-4 py-2">
            <div className="text-xl md:text-2xl font-bold">
              {stats.totalMembers || 0}
            </div>
            <div className="text-xs md:text-sm text-gray-400">
              Top 10 supporters
            </div>
          </div>
          <div className="px-3 md:px-4 py-2">
            <div className="text-xl md:text-2xl font-bold">
              {stats.totalPayments || 0}
            </div>
            <div className="text-xs md:text-sm text-gray-400">payments</div>
          </div>
          <div className="px-3 md:px-4 py-2">
            <div className="text-xl md:text-2xl font-bold text-green-400">
              ₹{stats.totalEarnings ? stats.totalEarnings.toLocaleString() : 0}
            </div>
            <div className="text-xs md:text-sm text-gray-400">total raised</div>
          </div>
        </div>
      </div>

      <div className="payment flex flex-col lg:flex-row gap-3 md:gap-5 w-full max-w-6xl mx-auto mt-8 md:mt-11 px-4 mb-10">
        <div className="supporters w-full lg:w-1/2 bg-slate-900 rounded-lg p-4 md:p-6 lg:p-10">
          <h2 className="text-xl md:text-2xl font-bold my-3 md:my-5">
            Supporters
          </h2>
          <ul className="max-h-64 md:max-h-80 overflow-y-auto">
            {payments.length === 0 && (
              <li className="text-gray-400 text-sm md:text-base">
                No payments yet
              </li>
            )}
            {payments.map((p, i) => {
              return (
                <li key={i} className="my-2 md:my-4 flex items-center gap-2">
                  <img
                    width={33}
                    src="/avatar.gif"
                    alt="user avatar"
                    className="w-8 h-8 md:w-9 md:h-9"
                  />
                  <span className="text-sm md:text-base">
                    {p.name}{" "}
                    <span className="font-bold text-green-400">
                      ₹{p.amount / 100}
                    </span>{" "}
                    — {p.message}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="make-payment w-full lg:w-1/2 bg-slate-900 rounded-lg p-4 md:p-6 lg:p-10">
          <h2 className="text-xl md:text-2xl font-bold my-3 md:my-5 text-center">
            Make a payment
          </h2>
          <div className="pay-inputs">
            <input
              onChange={handleChange}
              value={paymentform.name || ""}
              name="name"
              type="text"
              placeholder="Name"
              className="w-full p-2 md:p-3 rounded-md bg-slate-800 text-white text-sm md:text-base"
            />
            <input
              onChange={handleChange}
              value={paymentform.message || ""}
              name="message"
              type="text"
              placeholder="Enter message"
              className="w-full p-2 md:p-3 rounded-md bg-slate-800 text-white mt-3 text-sm md:text-base"
            />
            <input
              onChange={handleChange}
              value={paymentform.amount || ""}
              name="amount"
              type="number"
              placeholder="Enter amount"
              className="w-full p-2 md:p-3 rounded-md bg-slate-800 text-white mt-3 text-sm md:text-base"
            />
            <button
              onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
              className="inline-flex items-center justify-center text-white bg-gradient-to-br from-purple-900 to-blue-800 font-medium rounded-lg text-sm md:text-base px-4 py-2.5 text-center leading-5 transition-all duration-200 hover:bg-gray-800 hover:bg-none hover:ring-2 hover:ring-purple-400 mt-3 w-full disabled:bg-gray-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                !paymentform.name ||
                paymentform.name.length < 3 ||
                !paymentform.message ||
                paymentform.message.length < 4 ||
                !paymentform.amount ||
                paymentform.amount <= 0
              }
            >
              Pay
            </button>
          </div>

          <div className="choose-amount mt-5">
            <h3 className="my-2 text-sm md:text-base">or choose an amount</h3>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button
                onClick={() => pay(2000)}
                className="w-full p-2 md:p-3 rounded-md bg-slate-800 text-white hover:bg-slate-700 cursor-pointer text-sm md:text-base transition-colors"
              >
                ₹20
              </button>
              <button
                onClick={() => pay(5000)}
                className="w-full p-2 md:p-3 rounded-md bg-slate-800 text-white hover:bg-slate-700 cursor-pointer text-sm md:text-base transition-colors"
              >
                ₹50
              </button>
              <button
                onClick={() => pay(10000)}
                className="w-full p-2 md:p-3 rounded-md bg-slate-800 text-white hover:bg-slate-700 cursor-pointer text-sm md:text-base transition-colors"
              >
                ₹100
              </button>
            </div>
          </div>

          <div className="pay-methods mt-5">
            <h3 className="text-base md:text-lg lg:text-xl font-bold my-3 md:my-5">
              Payment methods
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button className="w-full p-2 md:p-3 rounded-md bg-slate-800 text-white text-xs md:text-sm hover:bg-slate-700 transition-colors">
                Pay with Debit/Credit Card
              </button>
              <button className="w-full p-2 md:p-3 rounded-md bg-slate-800 text-white text-xs md:text-sm hover:bg-slate-700 transition-colors">
                Pay with UPI
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
