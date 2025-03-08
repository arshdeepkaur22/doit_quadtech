import React, { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import { RiMoonClearLine } from "react-icons/ri";
import { IoSunnyOutline } from "react-icons/io5";
import { FiGrid } from "react-icons/fi";
import { FaList } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import logo from '/logo.png'

const Navbar = ({ profile, setProfile }) => {
  const [display, setDisplay] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleDisplay = () => {
    setDisplay(!display);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleProfile = () => {
    setProfile(!profile);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm dark:shadow-none">
      <div className="flex items-center px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <button 
            onClick={handleProfile}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Toggle profile sidebar"
          >
            {profile && isMobile ? (
              <IoClose className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800 dark:text-white" />
            ) : (
              <IoMenu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800 dark:text-white" />
            )}
          </button>
          <div className="flex gap-2">
            <img src={logo}></img>
            <p className="font-bold text-[#3F9142] dark:text-[#347136] font-sen text-xl sm:text-2xl">
              DoIt
            </p>
          </div>
        </div>

        {/* Search bar - shown when search is active on mobile */}
       
        <div className="flex items-center gap-2 sm:gap-5 ml-auto">
          {/* Search icon - toggles search on mobile */}
          <button 
            onClick={toggleSearch}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Search"
          >
            <IoSearchSharp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800 dark:text-white" />
          </button>

          {/* Search bar - always visible on desktop */}
          

          {/* View toggle button */}
          <button 
            onClick={handleDisplay}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Toggle view"
          >
            {display ? (
              <FiGrid className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800 dark:text-white" />
            ) : (
              <FaList className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800 dark:text-white" />
            )}
          </button>

          {/* Dark mode toggle button */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <IoSunnyOutline className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
            ) : (
              <RiMoonClearLine className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
