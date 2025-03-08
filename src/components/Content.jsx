import React, { useState, useEffect } from "react";
import TaskManager from "./TaskManager";
import Settings from "./Settings";
import Profile from "./Profile";
import { MdClose } from "react-icons/md";

const Content = ({ profile, setProfile }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [displayContent, setDisplayContent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Check if we're on mobile and adjust layout accordingly
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

  // When a task is selected on mobile, show the settings panel
  useEffect(() => {
    if (isMobile && selectedTask) {
      setShowSettings(true);
    }
  }, [selectedTask, isMobile]);

  // Handle closing the settings panel on mobile
  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Profile Section - Fixed position on mobile when visible */}
      {profile && (
        <>
          <div
            className={`fixed md:static top-[60px] left-0 h-[calc(100vh-60px)] z-40 ${
              isMobile ? "w-64" : "md:col-span-3 lg:col-span-2"
            } border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
              profile && isMobile ? "translate-x-0" : isMobile ? "-translate-x-full" : ""
            }`}
          >
            <Profile
              setDisplayContent={setDisplayContent}
              profile={profile}
              setProfile={setProfile}
            />
          </div>
          
          {/* Overlay for mobile sidebar */}
          {isMobile && profile && (
            <div
              className="fixed inset-0 top-[60px] bg-black bg-opacity-50 z-30"
              onClick={() => setProfile(false)}
            ></div>
          )}
        </>
      )}

      {/* TaskManager Section */}
      <div
        className={`${
          isMobile
            ? "w-full"
            : profile
            ? selectedTask
              ? "md:col-span-5 lg:col-span-7"
              : "md:col-span-9 lg:col-span-10"
            : selectedTask
            ? "md:col-span-8 lg:col-span-9"
            : "md:col-span-12"
        } overflow-y-auto h-screen pt-[60px] md:pt-0`}
      >
        <TaskManager
          setSelectedTask={setSelectedTask}
          selectedTask={selectedTask}
          displayContent={displayContent}
          isMobile={isMobile}
        />
      </div>

      {/* Settings Section - Full screen on mobile when active */}
      {selectedTask && (isMobile ? showSettings : true) && (
        <div
          className={`${
            isMobile
              ? "fixed inset-0 top-[60px] z-50 bg-white dark:bg-gray-800"
              : "md:col-span-4 lg:col-span-3 border-l border-gray-200 dark:border-gray-700"
          } h-[calc(100vh-60px)] md:h-screen overflow-y-auto`}
        >
          {isMobile && (
            <button
              onClick={handleCloseSettings}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <MdClose className="h-6 w-6" />
            </button>
          )}
          <Settings
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        </div>
      )}
    </div>
  );
};

export default Content;
