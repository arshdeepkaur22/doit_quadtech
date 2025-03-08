import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegBell } from "react-icons/fa";
import { IoIosRepeat } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

import Analysis from "../components/Content/Analysis";
import Important from "../components/Content/Important";
import Today from "../components/Content/Today";
import Alltasks from "../components/Content/Alltasks";

import {
  addTask,
  toggleCompleted,
  toggleImportant,
  removeTask,
  addStep,
  toggleStepCompleted,
  updateStepText,
  removeStep,
} from "./TaskSlice";

const TaskManager = ({ setSelectedTask, selectedTask, displayContent }) => {


  if (selectedTask === "alltask") {
    return <Alltasks setSelectedTask={setSelectedTask} selectedTask={selectedTask}></Alltasks>;
  } else if (displayContent === "todays") {
    return <Today setSelectedTask={setSelectedTask} selectedTask={selectedTask}/>;
  } else if (displayContent === "important") {
    return <Important setSelectedTask={setSelectedTask} selectedTask={selectedTask}/>;
  } else if (displayContent === "analysis") {
    return <Analysis />;
  } else {
    return <Alltasks setSelectedTask={setSelectedTask} selectedTask={selectedTask}></Alltasks>;
  }
};

export default TaskManager;
