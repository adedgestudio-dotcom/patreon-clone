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
    // Add a small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      const paymentStatus = searchParams.get("payment");
      console.log("Payment status from URL:", paymentStatus);
      console.log("Current URL:", window.location.href);

      if (paymentStatus === "success") {
        console.log("Showing success toast");
        toast.success("Payment Successful! Thank you for your support😊", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Refresh payment data and stats after successful payment
        getData();
      } else if (paymentStatus === "failed") {
        console.log("Showing failed toast");
        toast.error("❌ Payment failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (paymentStatus === "error") {
        console.log("Showing error toast");
        toast.error("⚠️ Payment error occurred. Please contact support.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }, 500); // Increased delay to 500ms

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleChange = (e) => {
    setpaymentform({
      ...paymentform,
      [e.target.name]: e.target.value,
    });
  };

  const getData = async () => {
    console.log("Fetching data for username:", username);
    let u = await fetchUser(username);
    console.log("User data:", u);
    setcurrentUser(u || {});

    let dbpayments = await fetchPayments(username);
    console.log("Payments data:", dbpayments);
    setpayments(dbpayments);

    let statsData = await fetchPaymentStats(username);
    console.log("Stats data:", statsData);
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

      //get order id
      let order_id = await initiate(amount, username, paymentform);

      var options = {
        key: currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
        amount: amount, // Amount is in currency subunits.
        currency: "INR",
        name: "Get Me A Chai", // your business name
        description: "Support " + username,
        image: "https://example.com/your_logo",
        order_id: order_id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
        prefill: {
          // We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
          name: paymentform.name || "Anonymous", //your customer's name
          email: "user@example.com",
          contact: "9000090000", //Provide the customer's phone number for better conversion rates
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
      <div className="payment-container"></div>
      <div className="cover relative">
        <img
          className="h-[300] w-full object-cover"
          src={currentUser?.coverpicture || "/tea.gif"}
          alt="Cover"
        />
        <div className="image-profile absolute -bottom-16 right-[45.5%]">
          <img
            className="rounded-xl ring-2 ring-gray-800 w-[130px] h-[130px]"
            src={currentUser?.profilepicture || "/avatar.gif"}
            alt="Profile"
          />
        </div>
      </div>
      <div className="info my-16 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl font-bold mb-4 mt-2">@{username}</h1>
        <p className="text-xl text-gray-300 mb-6">
          Lets help {username} get a chai!
        </p>
        <div className="flex gap-6 text-center">
          <div className="px-4 py-2">
            <div className="text-2xl font-bold">{stats.totalMembers || 0}</div>
            <div className="text-sm text-gray-400">supporters</div>
          </div>
          <div className="px-4 py-2">
            <div className="text-2xl font-bold">{stats.totalPayments || 0}</div>
            <div className="text-sm text-gray-400">payments</div>
          </div>
          <div className="px-4 py-2">
            <div className="text-2xl font-bold text-green-400">
              ₹{stats.totalEarnings ? stats.totalEarnings.toLocaleString() : 0}
            </div>
            <div className="text-sm text-gray-400">total raised</div>
          </div>
        </div>
        <div className="payment flex gap-3 w-[80%] mt-11">
          <div className="supporters w-1/2 bg-slate-900 rounded-lg p-10">
            <h2 className="text-2xl font-bold my-5">Supporters</h2>
            <ul>
              {payments.length == 0 && <li>No payments yet</li>}
              {payments.map((p, i) => {
                return (
                  <li key={i} className="my-4 flex items-center gap-2">
                    <img width={33} src="/avatar.gif" alt="user avatar" />
                    <span>
                      {p.name}{" "}
                      <span className="font-bold text-green-400">
                        ₹{p.amount / 100}
                      </span>{" "}
                      —{p.message}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="make-payment supporters w-1/2 bg-slate-900 rounded-lg p-10">
            <h2 className="text-2xl font-bold my-5 text-center">
              Make a payment
            </h2>
            <div className="pay-inputs">
              <input
                onChange={handleChange}
                value={paymentform.name || ""}
                name="name"
                type="text"
                placeholder="Name"
                className="w-full p-2 rounded-md bg-slate-800 text-white"
              />
              <input
                onChange={handleChange}
                value={paymentform.message || ""}
                name="message"
                type="text"
                placeholder="Enter message"
                className="w-full p-2 rounded-md bg-slate-800 text-white mt-3"
              />
              <input
                onChange={handleChange}
                value={paymentform.amount || ""}
                name="amount"
                type="number"
                placeholder="Enter amount"
                className="w-full p-2 rounded-md bg-slate-800 text-white mt-3"
              />
              <button
                onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                className="inline-flex items-center justify-center text-white bg-gradient-to-br from-purple-900 to-blue-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 transition-all duration-200 hover:bg-gray-800 hover:bg-none hover:ring-2 hover:ring-purple-400 mt-3 w-full disabled:bg-gray-700 disabled:from-purple-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4
                }
              >
                Pay
              </button>
            </div>

            <div className="choose-amount">
              <h3 className="my-1">or choose an amount</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => pay(2000)}
                  className="w-full p-2 rounded-md bg-slate-800 text-white mt-3 hover:bg-slate-700 cursor-pointer"
                >
                  ₹20
                </button>
                <button
                  onClick={() => pay(5000)}
                  className="w-full p-2 rounded-md bg-slate-800 text-white mt-3 hover:bg-slate-700 cursor-pointer"
                >
                  ₹50
                </button>
                <button
                  onClick={() => pay(10000)}
                  className="w-full p-2 rounded-md bg-slate-800 text-white mt-3 hover:bg-slate-700 cursor-pointer"
                >
                  ₹100
                </button>
              </div>
            </div>

            <div className="pay-methods mt-5">
              <h3 className="text-xl font-bold my-5">Payment methods</h3>
              <div className="flex gap-3">
                <button className="w-full p-2 rounded-md bg-slate-800 text-white mt-3">
                  Pay with Debit/Credit Card
                </button>
                <button className="w-full p-2 rounded-md bg-slate-800 text-white mt-3">
                  Pay with UPI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
