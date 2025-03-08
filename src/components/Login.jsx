import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./TaskSlice";
import logo from "/logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.tasks.isAuthenticated);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter your name");
      return;
    }

    dispatch(login(username));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="w-full max-w-md p-4 sm:p-8 mx-4 rounded-lg shadow-xl backdrop-filter backdrop-blur-lg bg-white/90 dark:bg-white/10 border border-gray-200 dark:border-white/20">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex gap-2">
            <img src={logo}></img>
            <p className="font-bold text-[#3F9142] dark:text-[#347136] font-sen text-xl sm:text-2xl">
              DoIt
            </p>
          </div>
          <p className="text-gray-600 dark:text-white/70 mt-2">
            Sign in to manage your tasks
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-gray-700 dark:text-white text-sm font-medium mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#347136] dark:focus:ring-gray-500 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/50"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {error && (
              <p className="mt-2 text-red-500 dark:text-red-300 text-sm">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#347136] hover:bg-[#2a5c2b] dark:bg-gray-600 dark:hover:bg-gray-700 text-white font-medium rounded-lg transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
