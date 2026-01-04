"use client";
import React, { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Debug logging
  console.log("Session user:", session?.user);
  console.log("Username for navigation:", session?.user?.name);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLinkClick = (href) => {
    console.log("Link clicked:", href);
    // Close dropdown when a link is clicked
    setShowDropdown(false);
  };

  const handleYourPageClick = (e) => {
    e.preventDefault();
    if (session?.user) {
      const username = session.user.username || session.user.name;
      console.log("Navigating to user page:", username);
      setShowDropdown(false);
      router.push(`/${username}`);
    }
  };
  ``;

  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   );
  // }
  return (
    <nav className="bg-gray-900 text-white flex justify-between px-4 h-16 items-center">
      <div className="logo font-bold text-lg flex items-center justify-center cursor-pointer">
        <Link
          href="/"
          onClick={() => handleLinkClick("/")}
          className="flex items-center justify-center"
        >
          <img className="invertImg" width={44} src="tea.gif" alt="" />
          <span>GetMeAChai!</span>
        </Link>
      </div>
      {/* <ul classNameName="flex justify-between gap-4">
        <li>Home</li>
        <li>About</li>
        <li>Projects</li>
        <li>Signup</li>
        <li>Login</li>
      </ul> */}

      {session && (
        <div className="flex gap-4 items-center">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleDropdownToggle}
              className="inline-flex items-center justify-center text-white bg-gradient-to-br from-purple-600 to-blue-500 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 transition-all duration-200 hover:bg-gray-800 hover:bg-none hover:ring-2 hover:ring-purple-600"
            >
              Welcome {session?.user?.email || "User"}
              <svg
                className="w-4 h-4 ms-1.5 -me-0.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>
            {/* Dropdown menu */}
            <div
              id="dropdownDelay"
              className={`z-10 ${
                showDropdown ? "block" : "hidden"
              } absolute right-0 mt-2 bg-gray-900  border border-gray-200 rounded-lg shadow-lg w-44`}
            >
              <ul className="p-2 text-sm text-white font-medium">
                <li>
                  <Link
                    href="/"
                    onClick={() => handleLinkClick("/")}
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-gray-950 rounded"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => handleLinkClick("/dashboard")}
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-gray-950 rounded"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    onClick={() => handleLinkClick("#")}
                    className="block px-4 py-2 hover:bg-gray-100 hover:text-gray-950 rounded"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleYourPageClick}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-gray-950 rounded"
                  >
                    Your page
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLinkClick("signout");
                      signOut();
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-gray-950 rounded"
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Direct buttons */}

          <button
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 transition-all duration-200 hover:bg-gray-800 hover:bg-none hover:ring-2 hover:ring-purple-600"
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </button>
        </div>
      )}
      {!session && (
        <Link href={"/login"}>
          <div className="login">
            <button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 font-medium rounded-lg text-sm px-4 py-2.5 text-center leading-5 transition-all duration-200 hover:bg-gray-800 hover:bg-none hover:ring-2 hover:ring-purple-600">
              Login
            </button>
          </div>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
