import { useState } from "react";

import {
  Box,
  Button,
  Typography,
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

  const [tasks, setTasks] =
    useState<Task[]>([
      {
        title: "Login UI",
        description:
          "Create authentication screens",
        status: "Completed"
      },

      {
        title: "Dashboard",
        description:
          "Build dashboard layout",
        status: "In Progress"
      },

      {
        title: "Task Module",
        description:
          "Implement task features",
        status: "Pending"
      }
    ]);

  const addTask = (
    newTask: Task
  ) => {

    setTasks((prev) => [
      ...prev,
      newTask
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

  return (
    <DashboardLayout>

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 4
        }}
      >

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700
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
        >
          Create Task
        </Button>

      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",
          gap: 3
        }}
      >

        {tasks.length > 0 ? (

          tasks.map((task) => (

            <TaskCard
              key={task.title}
              title={task.title}
              description={
                task.description
              }
              status={task.status}
              onDelete={() =>
                openDeleteModal(
                  task.title
                )
              }
            />

          ))

        ) : (

          <Typography>
            No tasks available
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