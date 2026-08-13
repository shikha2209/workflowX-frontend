import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import type { Task } from "../types/task";

import dayjs from "dayjs";

import {
  useState,
  useEffect,
} from "react";

import { getUsers } from "../services/userApi";

import {
  useAuth,
} from "../context/useAuth";

import {
  generateTaskWithAI,
} from "../services/aiApi";


// --------------------------------------
// User type
// --------------------------------------

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}


// --------------------------------------
// AI response type
// --------------------------------------

interface GeneratedTask {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedHours: number;
  subtasks: string[];
}


// --------------------------------------
// Props
// --------------------------------------

interface Props {
  open: boolean;
  handleClose: () => void;
  addTask: (task: Task) => void;
}


// --------------------------------------
// Component
// --------------------------------------

export default function CreateTaskModal({
  open,
  handleClose,
  addTask,
}: Props) {

  // --------------------------------------
  // Auth
  // --------------------------------------

  const {
    currentUser,
  } = useAuth();


  // --------------------------------------
  // Users
  // --------------------------------------

  const [users, setUsers] =
    useState<User[]>([]);


  // --------------------------------------
  // Task form
  // --------------------------------------

  const [formData, setFormData] =
    useState({
      _id: "",
      id: "",
      title: "",
      description: "",
      priority: "Low" as
        | "High"
        | "Medium"
        | "Low",
      dueDate: "",
      assignee: "",
      status: "todo",
      createdAt: "",
    });


  // --------------------------------------
  // AI states
  // --------------------------------------

  const [taskIdea, setTaskIdea] =
    useState("");

  const [aiLoading, setAiLoading] =
    useState(false);

  const [aiError, setAiError] =
    useState("");

  const [estimatedHours, setEstimatedHours] =
    useState<number | null>(null);

  const [subtasks, setSubtasks] =
    useState<string[]>([]);


  // --------------------------------------
  // Fetch approved users
  // --------------------------------------

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const response =
          await getUsers(1, 100);

        const approvedUsers =
          response.data.users.filter(
            (user: User) =>
              user.status === "approved" &&
              user._id !== currentUser?.id
          );

        setUsers(
          approvedUsers
        );

      } catch (error) {

        console.error(
          "Failed to fetch users:",
          error
        );

      }

    };

    fetchUsers();

  }, [currentUser?.id]);


  // --------------------------------------
  // Generate task using AI
  // --------------------------------------

  const handleGenerateWithAI =
    async () => {

      if (!taskIdea.trim()) {

        setAiError(
          "Please enter a task idea first."
        );

        return;
      }

      try {

        setAiLoading(true);

        setAiError("");

        const result:
          GeneratedTask =
          await generateTaskWithAI(
            taskIdea
          );


        // ----------------------------------
        // Put AI result into task form
        // ----------------------------------

        setFormData((prev) => ({
          ...prev,

          title:
            result.title,

          description:
            result.description,

          priority:
            result.priority,
        }));


        // ----------------------------------
        // Save additional AI information
        // ----------------------------------

        setEstimatedHours(
          result.estimatedHours
        );

        setSubtasks(
          result.subtasks
        );

      } catch (error) {

        console.error(
          "AI generation failed:",
          error
        );

        setAiError(
          "Unable to generate task. Please try again."
        );

      } finally {

        setAiLoading(false);

      }

    };


  // --------------------------------------
  // Create task
  // --------------------------------------

  const handleCreate = () => {

    if (!formData.title.trim()) {

      return;

    }

    addTask({

      ...formData,

      id:
        Date.now().toString(),

    });


    // ----------------------------------
    // Reset form
    // ----------------------------------

    setFormData({

      _id: "",

      id: "",

      title: "",

      description: "",

      priority: "Low",

      dueDate: "",

      assignee: "",

      status: "todo",

      createdAt: "",

    });

    setTaskIdea("");

    setEstimatedHours(null);

    setSubtasks([]);

    setAiError("");

    handleClose();

  };


  // --------------------------------------
  // Close modal
  // --------------------------------------

  const handleModalClose = () => {

    setAiError("");

    handleClose();

  };


  // --------------------------------------
  // UI
  // --------------------------------------

  return (

    <Dialog
      open={open}
      onClose={handleModalClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle
        sx={{
          fontWeight: 700,
        }}
      >
        Create Task
      </DialogTitle>


      <DialogContent>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            mt: 1,
          }}
        >

          {/* -------------------------------- */}
          {/* AI Task Idea */}
          {/* -------------------------------- */}

          <Box>

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                mb: 1,
              }}
            >
              ✨ Create with AI
            </Typography>

            <TextField
              fullWidth
              label="Describe your task idea"
              placeholder="Example: Build a responsive login page with React"
              value={taskIdea}
              onChange={(e) => {

                setTaskIdea(
                  e.target.value
                );

                setAiError("");

              }}
            />

          </Box>


          {/* -------------------------------- */}
          {/* Generate AI Button */}
          {/* -------------------------------- */}

          <Button
            variant="outlined"
            startIcon={
              aiLoading ? (
                <CircularProgress
                  size={18}
                />
              ) : (
                <AutoAwesomeIcon />
              )
            }
            onClick={
              handleGenerateWithAI
            }
            disabled={aiLoading}
            sx={{
              alignSelf: "flex-start",
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >

            {aiLoading
              ? "Generating..."
              : "Generate with AI"}

          </Button>


          {/* -------------------------------- */}
          {/* AI Error */}
          {/* -------------------------------- */}

          {aiError && (

            <Alert
              severity="error"
              onClose={() =>
                setAiError("")
              }
            >
              {aiError}
            </Alert>

          )}


          {/* -------------------------------- */}
          {/* Task Title */}
          {/* -------------------------------- */}

          <TextField
            label="Task Title"
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                title:
                  e.target.value,
              }))
            }
          />


          {/* -------------------------------- */}
          {/* Description */}
          {/* -------------------------------- */}

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={
              formData.description
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description:
                  e.target.value,
              }))
            }
          />


          {/* -------------------------------- */}
          {/* AI Suggestions */}
          {/* -------------------------------- */}

          {estimatedHours !== null && (

            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor:
                  "action.hover",
                border:
                  "1px solid",
                borderColor:
                  "divider",
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  mb: 1.5,
                }}
              >

                <Typography
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  ✨ AI Suggestions
                </Typography>

                <Chip
                  label={`${estimatedHours} hrs`}
                  size="small"
                  color="primary"
                />

              </Box>


              <Divider
                sx={{ mb: 1.5 }}
              />


              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Suggested Subtasks
              </Typography>


              <Box>

                {subtasks.map(
                  (
                    subtask,
                    index
                  ) => (

                    <Typography
                      key={index}
                      sx={{
                        fontSize: 14,
                        mb: 0.7,
                        color:
                          "text.secondary",
                      }}
                    >
                      ✓ {subtask}
                    </Typography>

                  )
                )}

              </Box>

            </Box>

          )}


          {/* -------------------------------- */}
          {/* Priority */}
          {/* -------------------------------- */}

          <TextField
            select
            label="Priority"
            fullWidth
            value={
              formData.priority
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,

                priority:
                  e.target.value as
                    | "High"
                    | "Medium"
                    | "Low",

              }))
            }
          >

            <MenuItem value="High">
              High
            </MenuItem>

            <MenuItem value="Medium">
              Medium
            </MenuItem>

            <MenuItem value="Low">
              Low
            </MenuItem>

          </TextField>


          {/* Due Date & Time */}

<Box
  sx={{
    display: "flex",
    gap: 2,
    flexDirection: {
      xs: "column",
      sm: "row",
    },
  }}
>
  {/* Due Date */}

  <TextField
    fullWidth
    label="Due Date"
    type="date"
    value={
      formData.dueDate
        ? dayjs(formData.dueDate).format("YYYY-MM-DD")
        : ""
    }
    onChange={(e) => {
      const date = e.target.value;

      if (!date) {
        setFormData((prev) => ({
          ...prev,
          dueDate: "",
        }));

        return;
      }

      const currentTime = formData.dueDate
        ? dayjs(formData.dueDate).format("HH:mm")
        : "12:00";

      const combined =
        dayjs(`${date}T${currentTime}`);

      setFormData((prev) => ({
        ...prev,
        dueDate: combined.toISOString(),
      }));
    }}
   slotProps={{
  inputLabel: {
    shrink: true,
  },
}}
    sx={{
      flex: 1,
    }}
  />

  {/* Due Time */}

  <TextField
    fullWidth
    label="Due Time"
    type="time"
    value={
      formData.dueDate
        ? dayjs(formData.dueDate).format("HH:mm")
        : ""
    }
    onChange={(e) => {
      const time = e.target.value;

      if (!time) return;

      const currentDate = formData.dueDate
        ? dayjs(formData.dueDate).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");

      const combined =
        dayjs(`${currentDate}T${time}`);

      setFormData((prev) => ({
        ...prev,
        dueDate: combined.toISOString(),
      }));
    }}
   slotProps={{
  inputLabel: {
    shrink: true,
  },
}}
    sx={{
      flex: 1,
    }}
  />
</Box>


          {/* -------------------------------- */}
          {/* Assign User */}
          {/* -------------------------------- */}

          <TextField
            select
            label="Assign To"
            fullWidth
            value={
              formData.assignee
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,

                assignee:
                  e.target.value,

              }))
            }
          >

            {users.length === 0 ? (

              <MenuItem
                disabled
              >
                No approved users available
              </MenuItem>

            ) : (

              users.map((user) => (

                <MenuItem
                  key={user._id}
                  value={user.email}
                >

                  {user.name} (
                  {user.role}
                  )

                </MenuItem>

              ))

            )}

          </TextField>


          {/* -------------------------------- */}
          {/* Create Task */}
          {/* -------------------------------- */}

          <Button
            variant="contained"
            fullWidth
            onClick={
              handleCreate
            }
            disabled={
              !formData.title.trim()
            }
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontWeight: 700,
              textTransform:
                "uppercase",
            }}
          >
            Create Task
          </Button>

        </Box>

      </DialogContent>

    </Dialog>

  );
}