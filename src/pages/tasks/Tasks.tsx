import { useState } from "react";

import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import DashboardLayout from "../../layouts/DashboardLayout";

import TaskCard from "../../components/TaskCard";
import CreateTaskModal from "../../components/CreateTaskModal";
import DeleteTaskModal from "../../components/DeleteTaskModal";

interface Task {
  title: string;
  description: string;
  status: string;
}

export default function Tasks() {
  const [open, setOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const [tasks, setTasks] =
    useState<Task[]>([
      {
        title: "Login UI",
        description:
          "Create authentication screens",
        status: "Completed",
      },

      {
        title: "Dashboard",
        description:
          "Build dashboard layout",
        status: "In Progress",
      },

      {
        title: "Task Module",
        description:
          "Implement task features",
        status: "Pending",
      },
    ]);

  const addTask = (
    newTask: Task
  ) => {
    setTasks((prev) => [
      ...prev,
      newTask,
    ]);
  };

  const openDeleteModal = (
    title: string
  ) => {
    setSelectedTask(title);

    setDeleteOpen(true);
  };

  const handleDelete = () => {
    setTasks(
      tasks.filter(
        (task) =>
          task.title !==
          selectedTask
      )
    );

    setDeleteOpen(false);
  };

  const filteredTasks =
    tasks.filter((task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "All" ||
        task.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
      xs: "column",
      sm: "row",
    },
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Tasks
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            setOpen(true)
          }
          sx={{
      width: {
        xs: "100%",
        sm: "auto",
      }
    }}
        >
          Create Task
        </Button>
      </Box>

      {/* Search + Filter */}

      <Box
        sx={{
          display: "flex",
           flexDirection: {
      xs: "column",
      md: "row",
    },
          gap: 2,
          mb: 4,
        }}
      >
        <TextField
          label="Search Tasks"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          fullWidth
        />

        <TextField
          select
          label="Filter"
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
          sx={{
            width:{ xs: "100%",
        md: 200,
      },
          }}
        >
          <MenuItem value="All">
            All
          </MenuItem>

          <MenuItem value="Pending">
            Pending
          </MenuItem>

          <MenuItem value="In Progress">
            In Progress
          </MenuItem>

          <MenuItem value="Completed">
            Completed
          </MenuItem>
        </TextField>
      </Box>

      {/* Task Grid */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
           { xs: "1fr",
      sm: "repeat(2,1fr)",
      lg: "repeat(3,1fr)",},
          gap: 3,
        }}
      >
        {filteredTasks.length >
        0 ? (
          filteredTasks.map(
            (task) => (
              <TaskCard
                key={task.title}
                title={
                  task.title
                }
                description={
                  task.description
                }
                status={
                  task.status
                }
                onDelete={() =>
                  openDeleteModal(
                    task.title
                  )
                }
              />
            )
          )
        ) : (
          <Typography>
            No tasks found
          </Typography>
        )}
      </Box>

      <CreateTaskModal
        open={open}
        handleClose={() =>
          setOpen(false)
        }
        addTask={addTask}
      />

      <DeleteTaskModal
        open={deleteOpen}
        handleClose={() =>
          setDeleteOpen(false)
        }
        handleDelete={
          handleDelete
        }
      />
    </DashboardLayout>
  );
}