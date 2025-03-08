import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegBell } from "react-icons/fa";
import { IoIosRepeat } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import {
  addTask,
  toggleCompleted,
  toggleImportant,
  removeTask,
  addStep,
  toggleStepCompleted,
  updateStepText,
  removeStep,
} from "../TaskSlice";

const ImportantTasks = ({ setSelectedTask, selectedTask }) => {
  const [taskText, setTaskText] = useState("");
  const [newStepTexts, setNewStepTexts] = useState({});
  const [lastAddedTaskName, setLastAddedTaskName] = useState(null);
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.tasks.tasks);

  // Filter for important tasks
  const tasks = allTasks.filter((task) => task.important);

  // Effect to mark newly added task as important
  useEffect(() => {
    if (lastAddedTaskName) {
      // Find the task with matching name that isn't already important
      const taskToMark = allTasks.find(
        (task) => task.name === lastAddedTaskName && !task.important
      );

      if (taskToMark) {
        // Mark it as important
        dispatch(toggleImportant(taskToMark.id));
        // Clear the tracked name
        setLastAddedTaskName(null);
      }
    }
  }, [allTasks, dispatch, lastAddedTaskName]);

  const handleAddTask = () => {
    if (taskText.trim()) {
      // Add task using the regular action
      dispatch(addTask(taskText));

      // Track this task name to find and mark as important in the effect
      setLastAddedTaskName(taskText);

      setTaskText("");
    }
  };

  const handleCheckbox = (taskid) => {
    dispatch(toggleCompleted(taskid));
  };

  const handleAddStepToTask = (taskId) => {
    if (newStepTexts[taskId]?.trim()) {
      dispatch(addStep({ taskId, text: newStepTexts[taskId] }));
      setNewStepTexts((prev) => ({
        ...prev,
        [taskId]: "",
      }));
    }
  };

  const handleStepToggle = (taskId, stepId, e) => {
    e.stopPropagation();
    dispatch(toggleStepCompleted({ taskId, stepId }));
  };

  const handleStepTextChange = (taskId, stepId, text, e) => {
    e.stopPropagation();
    dispatch(updateStepText({ taskId, stepId, text }));
  };

  const handleRemoveStep = (taskId, stepId, e) => {
    e.stopPropagation();
    dispatch(removeStep({ taskId, stepId }));
  };

  return (
    <div className="mx-4 sm:mx-6 md:mx-10">
      <h1 className="font-sen font-semibold text-[#347136] dark:text-[#97F69BB5]">
        Important Tasks
      </h1>
      <div className="border border-gray-200 dark:border-gray-800 my-3"></div>

      {/* Add Task Input */}
      <div className="bg-[#f5f9f5] dark:bg-[#496E4B33]/20 p-4 sm:p-6 rounded dark:rounded-none">
        <input
          className="bg-transparent outline-none border-none mb-6 sm:mb-10 text-gray-800 dark:text-white w-full"
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add an important task..."
        />
        <div className="flex gap-3">
          <FaRegBell className="h-4 w-4 font-semibold text-gray-600 dark:text-white"></FaRegBell>
          <IoIosRepeat className="h-4 w-4 font-semibold text-gray-600 dark:text-white" />
          <CiCalendar className="h-4 w-4 font-semibold text-gray-600 dark:text-white"></CiCalendar>

          <button
            className="flex ml-auto bg-[#d1e9d2] dark:bg-[#347136] px-3 sm:px-4 py-2 rounded text-xs sm:text-sm text-[#347136] dark:text-white font-medium dark:font-normal"
            onClick={handleAddTask}
          >
            ADD TASK
          </button>
        </div>
      </div>

      {/* Unchecked Tasks */}
      <div className="mt-6 sm:mt-10">
        {tasks.map((task, index) =>
          task.completed ? null : (
            <div key={index}>
              <div className="border border-gray-200 dark:border-gray-800 my-3 sm:my-5"></div>
              <div
                className={`${
                  selectedTask?.id === task.id
                    ? "bg-gray-100 dark:bg-gray-800 p-3"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 p-3"
                }`}
              >
                <div className="flex">
                  <input
                    className="h-4 w-4 mr-3 sm:mr-6 accent-[#347136]"
                    type="checkbox"
                    onChange={() => handleCheckbox(task.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-grow">
                    <div
                      className="font-sen flex items-center text-gray-800 dark:text-white"
                      onClick={() => setSelectedTask(task)}
                    >
                      <span>{task.name}</span>
                    </div>

                    {/* Steps for this task - always visible if they exist */}
                    {task.steps && task.steps.length > 0 && (
                      <div
                        className="ml-4 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {task.steps.map((step) => (
                          <div key={step.id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={step.completed}
                              onChange={(e) =>
                                handleStepToggle(task.id, step.id, e)
                              }
                              className="h-3 w-3 mr-2 accent-[#347136]"
                            />
                            <input
                              type="text"
                              value={step.text}
                              onChange={(e) =>
                                handleStepTextChange(
                                  task.id,
                                  step.id,
                                  e.target.value,
                                  e
                                )
                              }
                              className="bg-transparent border-none outline-none flex-grow text-xs text-gray-700 dark:text-white"
                            />
                            <IoClose
                              className="h-3 w-3 cursor-pointer text-gray-400"
                              onClick={(e) =>
                                handleRemoveStep(task.id, step.id, e)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    {task.dueDate && (
                      <span className="text-xs text-gray-400">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.repeat && (
                      <IoIosRepeat className="h-3 w-3 text-[#347136]" />
                    )}
                    <FaStar
                      className="h-4 w-4 cursor-pointer text-black dark:text-yellow-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleImportant(task.id));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Checked Tasks */}
      <div className="mt-6 sm:mt-10">
        <h2 className="text-gray-700 dark:text-white font-medium">Completed</h2>
        {tasks.map((task, index) =>
          !task.completed ? null : (
            <div key={index}>
              <div className="border border-gray-200 dark:border-gray-800 my-3"></div>
              <div
                className={`${
                  selectedTask?.id === task.id
                    ? "bg-gray-100 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex">
                  <input
                    className="h-4 w-4 mr-3 sm:mr-6 accent-[#347136]"
                    type="checkbox"
                    checked
                    onChange={() => handleCheckbox(task.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-grow">
                    <div
                      className="font-sen flex items-center text-gray-600 dark:text-white line-through"
                      onClick={() => setSelectedTask(task)}
                    >
                      <span>{task.name}</span>
                    </div>

                    {/* Steps for this task - always visible if they exist */}
                    {task.steps && task.steps.length > 0 && (
                      <div
                        className="ml-4 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {task.steps.map((step) => (
                          <div key={step.id} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={step.completed}
                              onChange={(e) =>
                                handleStepToggle(task.id, step.id, e)
                              }
                              className="h-3 w-3 mr-2 accent-[#347136]"
                            />
                            <input
                              type="text"
                              value={step.text}
                              onChange={(e) =>
                                handleStepTextChange(
                                  task.id,
                                  step.id,
                                  e.target.value,
                                  e
                                )
                              }
                              className="bg-transparent border-none outline-none flex-grow text-xs text-gray-500 dark:text-white"
                            />
                            <IoClose
                              className="h-3 w-3 cursor-pointer text-gray-400 mr-3"
                              onClick={(e) =>
                                handleRemoveStep(task.id, step.id, e)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    {task.dueDate && (
                      <span className="text-xs text-gray-400 m-1 sm:m-2">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.repeat && (
                      <IoIosRepeat className="h-3 w-3 text-[#347136] m-1 sm:m-2" />
                    )}
                    <FaStar
                      className="h-4 w-4 cursor-pointer text-black dark:text-yellow-400 m-1 sm:m-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleImportant(task.id));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImportantTasks;
