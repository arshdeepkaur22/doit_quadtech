import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const Analysis = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    importantTasks: 0,
    completionRate: 0,
    tasksByDate: [],
    tasksByCategory: []
  });

  useEffect(() => {
    // Calculate statistics from tasks
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const importantTasks = tasks.filter(task => task.important).length;
    const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    // Group tasks by date for trend analysis
    const dateMap = new Map();
    tasks.forEach(task => {
      const dateKey = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date';
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { date: dateKey, total: 0, completed: 0 });
      }
      dateMap.get(dateKey).total += 1;
      if (task.completed) {
        dateMap.get(dateKey).completed += 1;
      }
    });
    const tasksByDate = Array.from(dateMap.values());

    // Simulate task categories (in a real app, you'd have actual categories)
    const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Others'];
    const tasksByCategory = categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * (tasks.length + 1)) // Random distribution for demo
    }));

    setTaskStats({
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      importantTasks,
      completionRate: Math.round(completionRate),
      tasksByDate,
      tasksByCategory
    });
  }, [tasks]);

  // Colors for charts
  const COLORS = ['#347136', '#5DA45F', '#97F69B', '#496E4B', '#203622'];
  
  // Data for completion status pie chart
  const statusData = [
    { name: 'Completed', value: taskStats.completedTasks },
    { name: 'Pending', value: taskStats.pendingTasks }
  ];

  // Daily task completion trend data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toLocaleDateString();
  }).reverse();

  const trendData = last7Days.map(date => {
    const matchingDate = taskStats.tasksByDate.find(item => item.date === date);
    return {
      date,
      completed: matchingDate ? matchingDate.completed : 0,
      total: matchingDate ? matchingDate.total : 0
    };
  });

  return (
    <div className="mx-10">
      <h1 className="font-sen font-semibold text-[#347136] dark:text-[#97F69BB5]">Task Analysis</h1>
      <div className="border border-gray-200 dark:border-gray-800 my-3"></div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{taskStats.totalTasks}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-[#347136]">{taskStats.completedTasks}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{taskStats.pendingTasks}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Important</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{taskStats.importantTasks}</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Completion Status Pie Chart */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Task Completion Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#347136' : '#D97706'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#333' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Categories Bar Chart */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Tasks by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taskStats.tasksByCategory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" className="dark:stroke-[#444]" />
                <XAxis dataKey="name" stroke="#666" className="dark:stroke-[#999]" />
                <YAxis stroke="#666" className="dark:stroke-[#999]" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#333' }} />
                <Bar dataKey="value" fill="#97F69B">
                  {taskStats.tasksByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Task Completion Trend */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Last 7 Days Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" className="dark:stroke-[#444]" />
                <XAxis dataKey="date" stroke="#666" className="dark:stroke-[#999]" />
                <YAxis stroke="#666" className="dark:stroke-[#999]" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#333' }} />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#97F69B" name="Total Tasks" />
                <Line type="monotone" dataKey="completed" stroke="#347136" name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Rate Progress */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Overall Completion Rate</h2>
          <div className="h-64 flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center relative">
              <div className="text-3xl font-bold text-gray-800 dark:text-white">{taskStats.completionRate}%</div>
              <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#ddd" 
                  className="dark:stroke-[#444]"
                  strokeWidth="8"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#347136" 
                  strokeWidth="8"
                  strokeDasharray={`${taskStats.completionRate * 2.51} 251`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {taskStats.completedTasks} of {taskStats.totalTasks} tasks completed
            </p>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-6">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Task Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completion Efficiency</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {taskStats.completionRate > 75 ? 'Excellent' : 
               taskStats.completionRate > 50 ? 'Good' : 
               taskStats.completionRate > 25 ? 'Fair' : 'Needs Improvement'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Based on your task completion rate of {taskStats.completionRate}%
            </p>
          </div>
          <div className="border border-gray-300 dark:border-gray-700 p-3 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">Priority Focus</p>
            <p className="font-medium text-gray-800 dark:text-white">
              {taskStats.importantTasks > taskStats.totalTasks / 2 ? 'High Priority Load' : 'Balanced Priorities'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {taskStats.importantTasks} of {taskStats.totalTasks} tasks marked as important
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
