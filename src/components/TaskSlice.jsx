import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching weather data for Mumbai
export const fetchWeatherData = createAsyncThunk(
  "tasks/fetchWeatherData",
  async (city = "Mumbai", { rejectWithValue }) => {
    try {
      // In a real app, replace with your actual API call
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`);
      // if (!response.ok) throw new Error(`Weather data fetch failed: ${response.statusText}`);
      // return await response.json();

      // Mock response for demo
      return {
        main: { temp: 30 },
        weather: [{ main: "Clear", description: "clear sky" }],
        name: city,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch weather data");
    }
  }
);

const initialState = {
  tasks: [],
  currentUser: null,
  isAuthenticated: false,
  weather: null,
  weatherStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  weatherError: null,
  lastError: null, // General error tracking
};

// Helper function to get user-specific tasks from localStorage with error handling
const getUserTasks = (username) => {
  try {
    const userTasks = localStorage.getItem(`tasks_${username}`);
    return userTasks ? JSON.parse(userTasks) : [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return [];
  }
};

// Helper function to save user-specific tasks to localStorage with error handling
const saveUserTasks = (username, tasks) => {
  try {
    localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
    return false;
  }
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.lastError = null;
    },

    // Authentication reducers
    login: (state, action) => {
      try {
        const username = action.payload;
        state.currentUser = username;
        state.isAuthenticated = true;
        state.tasks = getUserTasks(username);
        state.lastError = null;
      } catch (error) {
        state.lastError = `Login failed: ${error.message}`;
        console.error("Login error:", error);
      }
    },

    logout: (state) => {
      try {
        // Save current tasks before logout
        if (state.currentUser) {
          const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
          if (!saveSuccess) {
            state.lastError = "Warning: Could not save tasks before logout";
          }
        }
        state.currentUser = null;
        state.isAuthenticated = false;
        state.tasks = [];
        state.lastError = null;
      } catch (error) {
        state.lastError = `Logout failed: ${error.message}`;
        console.error("Logout error:", error);
      }
    },

    // Task reducers with error handling
    addTask: (state, action) => {
      try {
        const newTask = {
          id: Date.now(),
          name: action.payload,
          completed: false,
          important: false,
          steps: [],
          reminder: null,
          dueDate: null,
          repeat: false,
          createdAt: new Date().toISOString(),
        };

        state.tasks.push(newTask);

        // Save to localStorage
        if (state.currentUser) {
          const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
          if (!saveSuccess) {
            state.lastError = "Warning: Task added but not saved to storage";
          }
        }
      } catch (error) {
        state.lastError = `Failed to add task: ${error.message}`;
        console.error("Add task error:", error);
      }
    },

    removeTask: (state, action) => {
      try {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);

        // Save to localStorage
        if (state.currentUser) {
          const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
          if (!saveSuccess) {
            state.lastError =
              "Warning: Task removed but changes not saved to storage";
          }
        }
      } catch (error) {
        state.lastError = `Failed to remove task: ${error.message}`;
        console.error("Remove task error:", error);
      }
    },

    toggleCompleted: (state, action) => {
      try {
        const task = state.tasks.find((task) => task.id === action.payload);
        if (task) {
          task.completed = !task.completed;

          // Save to localStorage
          if (state.currentUser) {
            const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
            if (!saveSuccess) {
              state.lastError =
                "Warning: Task updated but changes not saved to storage";
            }
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to toggle task completion: ${error.message}`;
        console.error("Toggle completed error:", error);
      }
    },

    toggleImportant: (state, action) => {
      try {
        const task = state.tasks.find((task) => task.id === action.payload);
        if (task) {
          task.important = !task.important;

          // Save to localStorage
          if (state.currentUser) {
            const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
            if (!saveSuccess) {
              state.lastError =
                "Warning: Task importance toggled but changes not saved to storage";
            }
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to toggle task importance: ${error.message}`;
        console.error("Toggle important error:", error);
      }
    },

    // Add step to a task
    addStep: (state, action) => {
      try {
        const { taskId, text } = action.payload;
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          const newStep = {
            id: Date.now(),
            text: text || "New step",
            completed: false,
          };
          task.steps.push(newStep);

          // Save to localStorage
          if (state.currentUser) {
            const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
            if (!saveSuccess) {
              state.lastError =
                "Warning: Step added but changes not saved to storage";
            }
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to add step: ${error.message}`;
        console.error("Add step error:", error);
      }
    },

    // Toggle step completion
    toggleStepCompleted: (state, action) => {
      try {
        const { taskId, stepId } = action.payload;
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          const step = task.steps.find((step) => step.id === stepId);
          if (step) {
            step.completed = !step.completed;

            // Save to localStorage
            if (state.currentUser) {
              const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
              if (!saveSuccess) {
                state.lastError =
                  "Warning: Step status toggled but changes not saved to storage";
              }
            }
          } else {
            state.lastError = "Step not found";
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to toggle step completion: ${error.message}`;
        console.error("Toggle step completed error:", error);
      }
    },

    // Update step text
    updateStepText: (state, action) => {
      try {
        const { taskId, stepId, text } = action.payload;
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          const step = task.steps.find((step) => step.id === stepId);
          if (step) {
            step.text = text;

            // Save to localStorage
            if (state.currentUser) {
              const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
              if (!saveSuccess) {
                state.lastError =
                  "Warning: Step text updated but changes not saved to storage";
              }
            }
          } else {
            state.lastError = "Step not found";
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to update step text: ${error.message}`;
        console.error("Update step text error:", error);
      }
    },

    // Remove step
    removeStep: (state, action) => {
      try {
        const { taskId, stepId } = action.payload;
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          const stepIndex = task.steps.findIndex((step) => step.id === stepId);
          if (stepIndex !== -1) {
            task.steps = task.steps.filter((step) => step.id !== stepId);

            // Save to localStorage
            if (state.currentUser) {
              const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
              if (!saveSuccess) {
                state.lastError =
                  "Warning: Step removed but changes not saved to storage";
              }
            }
          } else {
            state.lastError = "Step not found";
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to remove step: ${error.message}`;
        console.error("Remove step error:", error);
      }
    },

    // Set reminder
    setReminder: (state, action) => {
      try {
        const { taskId, reminderDate } =
          typeof action.payload === "object"
            ? action.payload
            : {
                taskId: action.payload,
                reminderDate: new Date(
                  Date.now() + 24 * 60 * 60 * 1000
                ).toISOString(),
              };

        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          task.reminder = reminderDate;

          // Save to localStorage
          if (state.currentUser) {
            const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
            if (!saveSuccess) {
              state.lastError =
                "Warning: Reminder set but changes not saved to storage";
            }
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to set reminder: ${error.message}`;
        console.error("Set reminder error:", error);
      }
    },

    // Remove reminder
    removeReminder: (state, action) => {
      try {
        const taskId = action.payload;
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          task.reminder = null;

          // Save to localStorage
          if (state.currentUser) {
            const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
            if (!saveSuccess) {
              state.lastError =
                "Warning: Reminder removed but changes not saved to storage";
            }
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to remove reminder: ${error.message}`;
        console.error("Remove reminder error:", error);
      }
    },

    // Set due date
    setDueDate: (state, action) => {
      try {
        const { taskId, dueDate } =
          typeof action.payload === "object"
            ? action.payload
            : {
                taskId: action.payload,
                dueDate: new Date(
                  Date.now() + 3 * 24 * 60 * 60 * 1000
                ).toISOString(),
              };

        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          task.dueDate = dueDate;

          // Save to localStorage
          if (state.currentUser) {
            const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
            if (!saveSuccess) {
              state.lastError =
                "Warning: Due date set but changes not saved to storage";
            }
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to set due date: ${error.message}`;
        console.error("Set due date error:", error);
      }
    },

    // Remove due date
    removeDueDate: (state, action) => {
      try {
        const taskId = action.payload;
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          task.dueDate = null;

          // Save to localStorage
          if (state.currentUser) {
            const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
            if (!saveSuccess) {
              state.lastError =
                "Warning: Due date removed but changes not saved to storage";
            }
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to remove due date: ${error.message}`;
        console.error("Remove due date error:", error);
      }
    },

    // Toggle repeat
    toggleRepeat: (state, action) => {
      try {
        const { taskId, repeatConfig } =
          typeof action.payload === "object"
            ? action.payload
            : { taskId: action.payload, repeatConfig: { frequency: "daily" } };

        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          if (task.repeat) {
            task.repeat = false;
          } else {
            task.repeat = repeatConfig;
          }

          // Save to localStorage
          if (state.currentUser) {
            const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
            if (!saveSuccess) {
              state.lastError =
                "Warning: Repeat status toggled but changes not saved to storage";
            }
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to toggle repeat: ${error.message}`;
        console.error("Toggle repeat error:", error);
      }
    },

    // Update task name
    updateTaskName: (state, action) => {
      try {
        const { taskId, name } = action.payload;
        const task = state.tasks.find((task) => task.id === taskId);
        if (task) {
          task.name = name;

          // Save to localStorage
          if (state.currentUser) {
            const saveSuccess = saveUserTasks(state.currentUser, state.tasks);
            if (!saveSuccess) {
              state.lastError =
                "Warning: Task name updated but changes not saved to storage";
            }
          }
        } else {
          state.lastError = "Task not found";
        }
      } catch (error) {
        state.lastError = `Failed to update task name: ${error.message}`;
        console.error("Update task name error:", error);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.weatherStatus = "loading";
        state.weatherError = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.weatherStatus = "succeeded";
        state.weather = action.payload;
        state.weatherError = null;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.weatherStatus = "failed";
        state.weatherError = action.payload || "Unknown error";
      });
  },
});

export const {
  // Error handling
  clearError,
  // Auth actions
  login,
  logout,
  // Task actions
  addTask,
  removeTask,
  toggleCompleted,
  toggleImportant,
  addStep,
  toggleStepCompleted,
  updateStepText,
  removeStep,
  setReminder,
  removeReminder,
  setDueDate,
  removeDueDate,
  toggleRepeat,
  updateTaskName,
} = taskSlice.actions;

export default taskSlice.reducer;
