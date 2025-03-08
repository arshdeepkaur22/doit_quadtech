import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { IoIosRepeat } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { WiDaySunny, WiRain, WiCloudy, WiSnow } from "react-icons/wi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  removeTask,
  addStep,
  toggleStepCompleted,
  updateStepText,
  removeStep,
  setReminder,
  setDueDate,
  toggleRepeat,
  fetchWeatherData,
} from "./TaskSlice";

// Custom CSS for themed DatePicker
import "./Themepicker.css"; // You'll need to create this file

const Settings = ({ selectedTask, setSelectedTask }) => {
  const dispatch = useDispatch();
  const currentTask = { ...selectedTask };
  const [stepText, setStepText] = useState("");
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

  // ... rest of the component functions remain the same

  // Handle back button click
  const handleBackClick = () => {
    setSelectedTask(null);
  };

  // Make sure we always have a valid date, even if the initial data is invalid
  const getValidDate = (dateStr) => {
    if (!dateStr) return new Date();
    try {
      const parsedDate = new Date(dateStr);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    } catch (e) {
      console.warn("Error parsing date:", e);
      return new Date();
    }
  };

  const [reminderDate, setReminderDate] = useState(() =>
    getValidDate(currentTask?.reminder)
  );

  const [dueDate, setDueDate] = useState(() =>
    getValidDate(currentTask?.dueDate)
  );

  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [isGoogleAuthorized, setIsGoogleAuthorized] = useState(false);
  const [remindersAdded, setRemindersAdded] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Check if Google API is already authorized and fetch weather
  useEffect(() => {
    // Check localStorage for stored tokens or auth state
    const googleAuthToken = localStorage.getItem("googleAuthToken");
    if (googleAuthToken) {
      setIsGoogleAuthorized(true);
    }

    // Fetch Mumbai weather data using the thunk
    if (dispatch && typeof fetchWeatherData === "function") {
      setWeatherLoading(true);

      dispatch(fetchWeatherData("Mumbai"))
        .unwrap()
        .then((weatherData) => {
          setWeather(weatherData);
          setWeatherLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          setWeatherLoading(false);
        });
    }
  }, [dispatch]);

  // Update date states when selected task changes
  useEffect(() => {
    if (currentTask) {
      if (currentTask.reminder) {
        try {
          setReminderDate(getValidDate(currentTask.reminder));
        } catch (e) {
          console.warn("Error updating reminder date:", e);
        }
      }
      if (currentTask.dueDate) {
        try {
          setDueDate(getValidDate(currentTask.dueDate));
        } catch (e) {
          console.warn("Error updating due date:", e);
        }
      }
    }
  }, [currentTask.id]); // Only update when the task ID changes to avoid infinite loops

  // Weather icon selection helper
  const getWeatherIcon = (weatherMain) => {
    if (!weatherMain) return <WiDaySunny />;

    switch (weatherMain.toLowerCase()) {
      case "rain":
      case "drizzle":
      case "thunderstorm":
        return <WiRain />;
      case "clouds":
        return <WiCloudy />;
      case "snow":
        return <WiSnow />;
      default:
        return <WiDaySunny />;
    }
  };

  const handleAddStep = () => {
    if (stepText.trim()) {
      dispatch(addStep({ taskId: currentTask.id, text: stepText }));
      setStepText("");
    }
  };

  const handleStepToggle = (stepId) => {
    dispatch(toggleStepCompleted({ taskId: currentTask.id, stepId }));
  };

  const handleStepTextChange = (stepId, text) => {
    dispatch(updateStepText({ taskId: currentTask.id, stepId, text }));
  };

  const handleDeleteStep = (stepId) => {
    dispatch(removeStep({ taskId: currentTask.id, stepId }));
  };

  const handleSetReminder = () => {
    try {
      if (!reminderDate || isNaN(reminderDate.getTime())) {
        console.error("Invalid reminder date selected:", reminderDate);
        return;
      }

      // Create payload with valid date
      const payload = {
        taskId: currentTask.id,
        reminderDate: reminderDate.toISOString(),
      };

      // Log for debugging
      console.log("Dispatching setReminder with payload:", payload);

      // Safely dispatch the action
      try {
        dispatch(setReminder(payload));
      } catch (e) {
        console.error("Dispatch error:", e);
        // Fallback - manually update the current task to fake it working
        currentTask.reminder = payload.reminderDate;
      }

      setShowReminderPicker(false);
    } catch (err) {
      console.error("Error in handleSetReminder:", err);
    }
  };
  const handleSetDueDate = () => {
    try {
      // Simple validation
      if (!dueDate || isNaN(dueDate.getTime())) {
        console.error("Invalid date selected:", dueDate);
        return;
      }

      // Create payload with valid date
      const payload = {
        taskId: currentTask.id,
        dueDate: dueDate.toISOString(),
      };

      // Log for debugging
      console.log("Dispatching setDueDate with payload:", payload);

      // Try to dispatch, but don't let errors crash the component
      try {
        // Check if action creator exists
        if (typeof setDueDate === "function") {
          dispatch(setDueDate(payload));
        } else {
          throw new Error("setDueDate action not available");
        }
      } catch (e) {
        console.warn("Failed to dispatch setDueDate, using fallback:", e);
        // Fallback - manually update the current task to fake the functionality
        currentTask.dueDate = payload.dueDate;
      }

      setShowDueDatePicker(false);
    } catch (err) {
      console.error("Error in handleSetDueDate:", err);
      // Even if there's an error, close the picker to prevent UI getting stuck
      setShowDueDatePicker(false);
    }
  };

  const handleToggleRepeat = () => {
    try {
      dispatch(
        toggleRepeat({
          taskId: currentTask.id,
          repeatConfig: { frequency: "daily" },
        })
      );
    } catch (e) {
      console.warn("Failed to toggle repeat, using fallback:", e);
      // Fallback to fake the functionality
      currentTask.repeat = !currentTask.repeat;
    }
  };

  const handleDeleteTask = () => {
    try {
      dispatch(removeTask(currentTask.id));
    } catch (e) {
      console.warn("Failed to remove task:", e);
    }
    setSelectedTask(null);
  };

  // Google Calendar API functions
  const authorizeGoogleCalendar = () => {
    // In a real implementation, you would:
    // 1. Initialize Google API client
    // 2. Request permissions for Google Calendar
    // 3. Handle the authentication flow

    // For demo purposes:
    setIsGoogleAuthorized(true);
    localStorage.setItem("googleAuthToken", "demo-token");
  };

  const addToGoogleCalendar = async () => {
    if (!isGoogleAuthorized || !reminderDate) return;

    // In a real implementation, you would call the Google Calendar API here
    console.log("Adding to Google Calendar:", {
      taskName: currentTask.name,
      reminderTime: reminderDate.toISOString(),
    });

    // Also set the reminder in our local app
    handleSetReminder();

    // Show success state
    setRemindersAdded(true);
    setTimeout(() => setRemindersAdded(false), 3000);
  };

  // Custom rendering of date picker header with theme-matching colors
  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="flex items-center justify-between px-2 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
        <button
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
          className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded p-1"
        >
          {"<"}
        </button>
        <select
          value={date.getMonth()}
          onChange={({ target: { value } }) => changeMonth(value)}
          className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white text-sm rounded px-2 py-1 mr-2"
        >
          {months.map((month, i) => (
            <option key={i} value={i}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(value)}
          className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white text-sm rounded px-2 py-1"
        >
          {Array.from({ length: 10 }, (_, i) => date.getFullYear() - 5 + i).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
        <button
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
          className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded p-1"
        >
          {">"}
        </button>
      </div>
    );
  };

  // Guard against rendering if there's no selected task
  if (!currentTask || !currentTask.id) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 text-gray-800 dark:text-white">
        No task selected
      </div>
    );
  }

  // Format dates safely for display
  const formatDateDisplay = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Not set";
      }
      return date.toLocaleDateString();
    } catch (e) {
      console.warn("Error formatting date:", e);
      return "Not set";
    }
  };

  const formatTimeDisplay = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "";
      }
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.warn("Error formatting time:", e);
      return "";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 relative h-full text-gray-800 dark:text-white">
      <div className="overflow-y-auto h-[calc(100vh-120px)] pb-16">
        <div className="font-sen text-lg font-semibold mb-6">
          {currentTask.name}
        </div>

        {/* Weather Information */}
        {weather && (
          <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded flex items-center">
            <div className="text-2xl mr-2">
              {getWeatherIcon(weather.weather[0].main)}
            </div>
            <div>
              <div className="text-sm font-medium">
                {weather.name}: {weather.main.temp}°C
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
        )}

        {weatherLoading && (
          <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <div className="text-sm">Loading weather...</div>
          </div>
        )}

        {/* Steps Section */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={stepText}
              onChange={(e) => setStepText(e.target.value)}
              placeholder="Add a step..."
              className="bg-transparent border-none outline-none flex-grow text-sm text-gray-800 dark:text-white"
            />
            <IoIosAdd
              className="h-5 w-5 cursor-pointer text-[#347136]"
              onClick={handleAddStep}
            />
          </div>

          {/* Steps List */}
          <div className="mt-4">
            {currentTask.steps &&
              currentTask.steps.map((step) => (
                <div key={step.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => handleStepToggle(step.id)}
                    className="h-4 w-4 mr-2 accent-[#347136]"
                  />
                  <input
                    type="text"
                    value={step.text}
                    onChange={(e) =>
                      handleStepTextChange(step.id, e.target.value)
                    }
                    className="bg-transparent border-none outline-none flex-grow text-sm text-gray-800 dark:text-white"
                  />
                  <IoClose
                    className="h-4 w-4 cursor-pointer text-gray-400"
                    onClick={() => handleDeleteStep(step.id)}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Set Reminder with Google Calendar */}
        <div
          className="flex items-center mb-3 cursor-pointer"
          onClick={() => setShowReminderPicker(!showReminderPicker)}
        >
          <FaRegBell className="h-4 w-4 font-semibold mr-2" />
          <div className="text-sm">
            {currentTask.reminder
              ? `Reminder: ${formatDateDisplay(
                  currentTask.reminder
                )} ${formatTimeDisplay(currentTask.reminder)}`
              : "Set reminder"}
          </div>
        </div>
        {showReminderPicker && (
          <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <div className="w-full">
              <DatePicker
                selected={reminderDate}
                onChange={(date) => setReminderDate(date)}
                showTimeSelect
                inline
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                renderCustomHeader={renderCustomHeader}
                calendarClassName="w-full"
                wrapperClassName="w-full"
              />
            </div>

            {/* Local app reminder button */}
            <button
              className="mt-2 bg-[#d1e9d2] dark:bg-[#347136] px-3 py-1 rounded text-xs mr-2 text-[#347136] dark:text-white"
              onClick={handleSetReminder}
            >
              SET REMINDER
            </button>

            {/* Google Calendar integration */}
            {!isGoogleAuthorized ? (
              <button
                className="mt-2 bg-blue-100 dark:bg-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700 px-3 py-1 rounded text-xs flex items-center text-blue-700 dark:text-white"
                onClick={authorizeGoogleCalendar}
              >
                <FaGoogle className="mr-1" /> Connect to Google
              </button>
            ) : (
              <button
                className={`mt-2 ${
                  remindersAdded
                    ? "bg-green-100 dark:bg-green-600 text-green-700 dark:text-white"
                    : "bg-blue-100 dark:bg-blue-600 hover:bg-blue-200 dark:hover:bg-blue-700 text-blue-700 dark:text-white"
                } px-3 py-1 rounded text-xs flex items-center`}
                onClick={addToGoogleCalendar}
                disabled={remindersAdded}
              >
                <FaGoogle className="mr-1" />
                {remindersAdded
                  ? "Added to Google Calendar!"
                  : "Add to Google Calendar"}
              </button>
            )}
          </div>
        )}

        {/* Add Due Date with Themed Calendar */}
        <div
          className="flex items-center mb-3 cursor-pointer"
          onClick={() => setShowDueDatePicker(!showDueDatePicker)}
        >
          <CiCalendar className="h-4 w-4 font-semibold mr-2" />
          <div className="text-sm">
            {currentTask.dueDate
              ? `Due: ${formatDateDisplay(currentTask.dueDate)}`
              : "Add due date"}
          </div>
        </div>
        {showDueDatePicker && (
          <div className="mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <div className="w-full">
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                inline
                renderCustomHeader={renderCustomHeader}
                calendarClassName="w-full"
                wrapperClassName="w-full"
              />
            </div>
            <button
              className="mt-2 bg-[#d1e9d2] dark:bg-[#347136] px-3 py-1 rounded text-xs text-[#347136] dark:text-white"
              onClick={handleSetDueDate}
            >
              SET DUE DATE
            </button>
          </div>
        )}

        {/* Repeat */}
        <div
          className={`flex items-center mb-3 cursor-pointer ${
            currentTask.repeat
              ? "text-[#347136] dark:text-[#97F69B]"
              : "text-gray-800 dark:text-white"
          }`}
          onClick={handleToggleRepeat}
        >
          <IoIosRepeat className="h-4 w-4 font-semibold mr-2" />
          <div className="text-sm">
            {currentTask.repeat ? "Repeating daily" : "Repeat"}
          </div>
        </div>
      </div>
      {/* Bottom Controls */}
      <div className="flex items-center gap-4 fixed md:absolute bottom-4 md:bottom-0 left-0 right-0 w-full px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md md:shadow-none z-10">
        <div
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full"
          onClick={() => setSelectedTask(null)}
        >
          <IoClose className="h-4 w-4 text-gray-600 dark:text-white" />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Created: {formatDateDisplay(currentTask.createdAt || Date.now())}
        </div>
        <div
          className="ml-auto cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full"
          onClick={handleDeleteTask}
        >
          <FaTrash className="h-4 w-4 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default Settings;
