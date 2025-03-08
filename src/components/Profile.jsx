import React from "react";
import {
  MdCheckBoxOutlineBlank,
  MdOutlineCalendarToday,
  MdOutlineAdd,
  MdOutlineInfo,
  MdLogout,
} from "react-icons/md";
import { FiStar, FiList } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { logout } from "./TaskSlice";

import user from "/user.png";

const Profile = ({ setDisplayContent, profile, setProfile }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const currentUser = useSelector((state) => state.tasks.currentUser);

  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const doneTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = pendingTasks + doneTasks;

  const data = [
    { name: "Pending", value: pendingTasks, color: "#66BB6A" },
    { name: "Done", value: doneTasks, color: "#2E7D32" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    // Close the profile sidebar after logout
    setProfile(false);
  };

  const handleNavClick = (content) => {
    setDisplayContent(content);
    // Always close the sidebar after navigation, on both mobile and desktop
    setProfile(false);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 h-full w-full md:w-64 overflow-y-auto">
      <div className="p-4 flex items-center space-x-3 border-b border-gray-200 dark:border-gray-800">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={user}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-gray-800 dark:text-white">
          Hey, {currentUser || "User"}
        </div>
      </div>

      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg mb-4 shadow-sm">
          <div
            className="p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-t-lg"
            onClick={() => handleNavClick("alltask")}
          >
            <MdCheckBoxOutlineBlank className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span>All Tasks</span>
          </div>

          <div
            className="p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
            onClick={() => handleNavClick("todays")}
          >
            <MdOutlineCalendarToday className="h-5 w-5 text-gray-600 dark:text-white" />
            <span>Due Today</span>
          </div>

          <div
            className="p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
            onClick={() => handleNavClick("important")}
          >
            <FiStar className="h-5 w-5 text-gray-600 dark:text-white" />
            <span>Important</span>
          </div>

          <div
            className="p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-b-lg"
            onClick={() => handleNavClick("analysis")}
          >
            <FiList className="h-5 w-5 text-gray-600 dark:text-white" />
            <span>Analysis</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg mb-4 p-3 shadow-sm">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg"
            onClick={() => {
              // You can add functionality for adding a list here
              setProfile(false); // Close sidebar after action
            }}
          >
            <MdOutlineAdd className="h-5 w-5 text-gray-600 dark:text-white" />
            <span>Add list</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4 text-gray-800 dark:text-white">
            <span>Today Tasks</span>
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
              <MdOutlineInfo className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            {totalTasks}
          </div>

          {/* Recharts Donut Chart */}
          <div className="flex justify-center">
            <PieChart width={120} height={120}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#333', border: 'none', borderRadius: '4px' }} />
            </PieChart>
          </div>

          <div className="flex justify-center space-x-8 mt-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Pending</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-700 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">Done</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg mt-4 p-3 shadow-sm">
          <div
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500 dark:text-red-400 rounded-lg"
            onClick={handleLogout}
          >
            <MdLogout className="h-5 w-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
