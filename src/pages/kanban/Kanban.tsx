import axios from "axios";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import DashboardLayout from "../../layouts/DashboardLayout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import TaskDetailsDrawer from "../../components/TaskDetailsDrawer";
import EditTaskModal from "../../components/EditTaskModal";
import CreateTaskModal from "../../components/CreateTaskModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import ActivityPanel from "../../components/ActivityPanel";
import {
  createTask,
  deleteTaskApi,
  getTasks,
  updateTaskStatus,
  updateTaskApi,
} from "../../services/taskApi";
import { getActivities } from "../../services/activityApi";
import type { Task } from "../../types/task";
import ExpandableText from "../../components/Expandable";

interface Columns {
  [key: string]: {
    title: string;
    tasks: Task[];
  };
}

interface BackendTask {
  _id: string;

  title: string;

  description: string;

  priority: "High" | "Medium" | "Low";

  dueDate: string;

  assignee: string;

  status: string;

  createdAt: string;
}

interface Activity {
  _id: string;
  user: string;
  action: string;
  taskTitle: string;
  message: string;
  createdAt?: string;
}

export default function Kanban() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });
  };

  const isAdmin = user.role === "admin";
  // ✅ current user's name — used to filter tasks for user role.
  // In a real app this comes from the auth token/profile.
  // For now we read the email stored at login time as the display name.
  const currentUser = user?.email || "";

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [columns, setColumns] = useState<Columns>({
    todo: {
      title: "Todo",
      tasks: [],
    },

    inProgress: {
      title: "In Progress",
      tasks: [],
    },

    completed: {
      title: "Completed",
      tasks: [],
    },
  });
  const fetchTasks = async () => {
    try {
      const response = await getTasks();

      const tasks = response.data;

      console.log("FETCHED TASKS:", tasks);

      // map backend tasks into columns

      setColumns({
        todo: {
          title: "Todo",

          tasks: tasks
            .filter((task: BackendTask) => task.status === "todo")
            .map((task: BackendTask) => ({
              _id: task._id,
              id: task._id,

              title: task.title,

              description: task.description,

              priority: task.priority,

              dueDate: task.dueDate,

              assignee: task.assignee,
            })),
        },

        inProgress: {
          title: "In Progress",

          tasks: tasks
            .filter(
              (task: BackendTask) =>
                task.status === "progress" || task.status === "inprogress",
            )
            .map((task: BackendTask) => ({
              _id: task._id,
              id: task._id,

              title: task.title,

              description: task.description,

              priority: task.priority,

              dueDate: task.dueDate,

              assignee: task.assignee,
            })),
        },

        completed: {
          title: "Completed",

          tasks: tasks
            .filter((task: BackendTask) => task.status === "completed")
            .map((task: BackendTask) => ({
              _id: task._id,

              id: task._id,

              title: task.title,

              description: task.description,

              priority: task.priority,

              dueDate: task.dueDate,

              assignee: task.assignee,
            })),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      await fetchTasks();

      const activityResponse = await getActivities();

      const allActivities: Activity[] = activityResponse.data;

      const filteredActivities =
        user.role === "admin"
          ? allActivities
          : allActivities.filter(
              (activity: Activity) =>
                activity.user?.toLowerCase() === user.name?.toLowerCase(),
            );

      console.log("ACTIVITIES:", filteredActivities);

      setActivities(filteredActivities);
    };

    loadTasks();
  }, [user.name, user.role]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // ✅ GATE: users can only drag their own tasks
    if (!isAdmin) {
      const allTasks = Object.values(columns).flatMap((c) => c.tasks);
      const draggedTask = allTasks.find((t) => t.id === draggableId);
      if (!draggedTask || draggedTask.assignee !== currentUser) return;

      // ✅ GATE: users can only move forward (todo→progress→completed)
      const columnOrder = ["todo", "inProgress", "completed"];
      const srcIndex = columnOrder.indexOf(source.droppableId);
      const dstIndex = columnOrder.indexOf(destination.droppableId);
      if (dstIndex < srcIndex) return; // block moving backwards
    }

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];

    if (source.droppableId === destination.droppableId) {
      const copiedTasks = [...sourceColumn.tasks];
      const [movedTask] = copiedTasks.splice(source.index, 1);
      copiedTasks.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, tasks: copiedTasks },
      });
      return;
    }

    const sourceTasks = [...sourceColumn.tasks];
    const destinationTasks = [...destinationColumn.tasks];

    const [removedTask] = sourceTasks.splice(source.index, 1);

    const movedTask = {
      ...removedTask,

      status:
        destination.droppableId === "inProgress"
          ? "inprogress"
          : destination.droppableId,
    };

    destinationTasks.splice(destination.index, 0, movedTask);

    const newStatus =
      destination.droppableId === "inProgress"
        ? "inprogress"
        : destination.droppableId;

    try {
      await updateTaskStatus(movedTask._id, newStatus);
    } catch (error) {
      console.log("STATUS UPDATE ERROR:", error);
    }

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: {
        ...destinationColumn,
        tasks: destinationTasks,
      },
    });
    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: {
        ...destinationColumn,
        tasks: destinationTasks,
      },
    });
  };

  const openTaskDrawer = (task: Task) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const handleEdit = () => {
    setDrawerOpen(false);
    setEditOpen(true);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      console.log("UPDATED TASK:", updatedTask);
      console.log("TASK ID:", updatedTask._id);

      if (!updatedTask._id) {
        console.error("Task ID is missing!");
        return;
      }

      const payload = {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        dueDate: updatedTask.dueDate,
        assignee: updatedTask.assignee,
        status: updatedTask.status,
      };

      console.log("UPDATE PAYLOAD:", payload);

      const response = await updateTaskApi(updatedTask._id, payload);

      console.log("UPDATE RESPONSE:", response.data);

      // Use backend returned task if available
      const savedTask = response.data.task || response.data;

      setColumns((prev) => {
        const newColumns = { ...prev };

        Object.keys(newColumns).forEach((columnId) => {
          newColumns[columnId] = {
            ...newColumns[columnId],
            tasks: newColumns[columnId].tasks.map((task) =>
              task._id === updatedTask._id ? savedTask : task,
            ),
          };
        });

        return newColumns;
      });

      setSelectedTask(savedTask);
      setEditOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "UPDATE TASK ERROR:",
          error.response?.data || error.message,
        );
      } else if (error instanceof Error) {
        console.error("UPDATE TASK ERROR:", error.message);
      } else {
        console.error("UPDATE TASK ERROR:", error);
      }
    }
  };

  const addTask = async (newTask: Task) => {
    try {
      const response = await createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        assignee: newTask.assignee,
        status: "todo",
      } as Task);

      const savedTask = {
        ...newTask,
        id: response.data._id,
      };

      setColumns((prev) => ({
        ...prev,
        todo: {
          ...prev.todo,
          tasks: [...prev.todo.tasks, savedTask],
        },
      }));

      // setActivities((prev) => [
      //   {
      //     id: Date.now().toString(),
      //     message: `🟢 Created ${newTask.title}`,
      //   },
      //   ...prev,
      // ]);

      setSearch("");
      setPriorityFilter("All");
    } catch (error) {
      console.log("CREATE TASK ERROR:", error);
    }
  };
  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    const taskId = selectedTask.id ?? selectedTask._id;

    try {
      // delete from MongoDB
      await deleteTaskApi(taskId);

      // remove from frontend
      setColumns((prev) => {
        const updated = {
          ...prev,
        };

        Object.keys(updated).forEach((columnId) => {
          updated[columnId] = {
            ...updated[columnId],

            tasks: updated[columnId].tasks.filter(
              (task) => (task.id ?? task._id) !== taskId,
            ),
          };
        });

        return updated;
      });

      setSelectedTask(null);

      setDrawerOpen(false);

      // setActivities((prev)=>[

      // {
      // id:Date.now().toString(),

      // message:
      // `🔴 Deleted ${selectedTask.title}`
      // },

      // ...prev

      // ]);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ stat counts — users only see their own tasks in counts too
  const visibleTasks = (tasks: Task[]) =>
    isAdmin ? tasks : tasks.filter((t) => t.assignee === currentUser);

  const totalTasks = Object.values(columns).reduce(
    (acc, col) => acc + visibleTasks(col.tasks).length,
    0,
  );
  const todoCount = visibleTasks(columns.todo.tasks).length;
  const progressCount = visibleTasks(columns.inProgress.tasks).length;
  const completedCount = visibleTasks(columns.completed.tasks).length;

  const getDueStatus = (
    dueDate: string,

    taskStatus: string,
  ) => {
    if (taskStatus === "completed") {
      return {
        label: "Completed",

        color: "success.main",
      };
    }

    const today = new Date();

    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);

    due.setHours(0, 0, 0, 0);

    if (due.getTime() === today.getTime()) {
      return {
        label: "Due Today",

        color: "warning.main",
      };
    }

    if (due < today) {
      return {
        label: "Overdue",

        color: "error.main",
      };
    }

    return {
      label: "Upcoming",

      color: "success.main",
    };
  };

  const notifications = Object.values(columns)

    .flatMap((col) => col.tasks)

    .map((task) => {
      const status = getDueStatus(task.dueDate, task.status);

      return {
        _id: task._id,

        id: task._id,

        title:
          status.label === "Overdue"
            ? "Task Overdue"
            : status.label === "Due Today"
              ? "Due Today"
              : "Upcoming Task",

        message:
          status.label === "Overdue"
            ? `${task.title} is overdue`
            : status.label === "Due Today"
              ? `${task.title} is due today`
              : `${task.title} upcoming`,

        type: (status.label === "Overdue" ? "deadline" : "task") as
          | "deadline"
          | "task",

        isRead: false,

        createdAt: task.createdAt ||
        task.dueDate ||
        new Date().toISOString(),
      };
    });

  return (
    <DashboardLayout notifications={notifications} showNotifications={true}>
      <Box sx={{ mb: 4 }}>
        <ActivityPanel activities={activities} />
        {/* <div>Activity Panel Removed</div> */}
      </Box>

      {/* ── Stat cards ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(4,1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {[
          { label: "Total Tasks", value: totalTasks },
          { label: "Todo", value: todoCount },
          { label: "In Progress", value: progressCount },
          { label: "Completed", value: completedCount },
        ].map((stat) => (
          <Card key={stat.label} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary">{stat.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ── Header row ── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.7rem", sm: "2rem" },
            }}
          >
            Kanban Board
          </Typography>

          {/* ✅ role badge so user always knows their access level */}
          <Chip
            label={
              isAdmin ? "Admin — full access" : "User — assigned tasks only"
            }
            size="small"
            color={isAdmin ? "primary" : "default"}
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* ✅ GATE: only admin sees Create Task button */}
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ width: { xs: "100%", sm: "auto" }, py: 1.2, borderRadius: 3 }}
          >
            + Create Task
          </Button>
        )}
      </Box>

      {/* ── Board ── */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              lg: "repeat(3,1fr)",
            },
            gap: 3,
            alignItems: "start",
          }}
        >
          {Object.entries(columns).map(([id, column]) => {
            // ✅ GATE: users only see their assigned tasks per column
            const visibleColumnTasks = visibleTasks(column.tasks).filter(
              (task) => {
                const searchMatch = task.title
                  .toLowerCase()
                  .includes(search.toLowerCase());
                const priorityMatch =
                  priorityFilter === "All"
                    ? true
                    : task.priority === priorityFilter;
                return searchMatch && priorityMatch;
              },
            );

            return (
              <Droppable key={id} droppableId={id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      bgcolor: "background.paper",
                      p: { xs: 2, sm: 3 },
                      borderRadius: 4,
                      border: "1px solid #e5e7eb",
                      minHeight: { xs: "auto", md: 420 },
                      height: "fit-content",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {column.title}
                      </Typography>
                      <Chip label={visibleColumnTasks.length} size="small" />
                    </Box>

                    {visibleColumnTasks.map((task, index) => {
                      // ✅ user can only drag their own tasks — lock others visually
                      const isOwn = isAdmin || task.assignee === currentUser;
                      const draggableTaskId = String(
                        task.id ?? task._id ?? task.title ?? `task-${index}`,
                      );

                      return (
                        <Draggable
                          key={draggableTaskId}
                          draggableId={draggableTaskId}
                          index={index}
                          isDragDisabled={!isOwn}
                        >
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => openTaskDrawer(task)}
                              sx={{
                                bgcolor: "background.default",
                                p: 2,
                                borderRadius: 3,
                                mb: 2,
                                border: "1px solid #e5e7eb",
                                boxShadow: 2,
                                // ✅ locked tasks look slightly muted
                                opacity: isOwn ? 1 : 0.6,
                                cursor: isOwn ? "grab" : "default",
                                transition: "0.3s",
                                "&:hover": {
                                  transform: isOwn
                                    ? "translateY(-3px)"
                                    : "none",
                                },
                              }}
                            >
                              <ExpandableText
                                text={task.title}
                                wordLimit={3}
                                titleStyle={{
                                  fontWeight: 600,
                                }}
                              />
                              <ExpandableText
                                text={task.description}
                                wordLimit={4}
                                textStyle={{
                                  mt: 1,

                                  color: "text.secondary",

                                  fontSize: 14,
                                }}
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mt: 2,
                                }}
                              >
                                <Chip
                                  label={task.priority}
                                  size="small"
                                  color={
                                    task.priority === "High"
                                      ? "error"
                                      : task.priority === "Medium"
                                        ? "warning"
                                        : "success"
                                  }
                                />
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Avatar
                                    sx={{
                                      width: 30,
                                      height: 30,
                                      bgcolor: "primary.main",
                                    }}
                                  >
                                    {task.assignee?.[0] || "?"}
                                  </Avatar>
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      color: "text.secondary",
                                    }}
                                  >
                                    {task.assignee || "Unassigned"}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mt: 1.5,
                                }}
                              >
                                <Typography sx={{ fontSize: 12 }}>
                                  📅 {formatDate(task.dueDate)}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color:
                                      getDueStatus(task.dueDate, task.status)
                                        .color === "error"
                                        ? "#d32f2f"
                                        : getDueStatus(
                                              task.dueDate,
                                              task.status,
                                            ).color === "warning"
                                          ? "#ed6c02"
                                          : "#2e7d32",
                                  }}
                                >
                                  {
                                    getDueStatus(task.dueDate, task.status)
                                      .label
                                  }
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}

                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            );
          })}
        </Box>
      </DragDropContext>

      <TaskDetailsDrawer
        open={drawerOpen}
        handleClose={() => setDrawerOpen(false)}
        task={selectedTask}
        // ✅ GATE: only admin gets edit/delete handlers — user sees read-only drawer
        handleEdit={isAdmin ? handleEdit : undefined}
        handleDelete={isAdmin ? () => setDeleteOpen(true) : undefined}
      />

      {/* ✅ GATE: modals only mount for admin */}
      {isAdmin && (
        <>
          <EditTaskModal
            open={editOpen}
            handleClose={() => setEditOpen(false)}
            task={selectedTask}
            handleSave={handleSaveTask}
          />
          <CreateTaskModal
            open={open}
            handleClose={() => setOpen(false)}
            addTask={addTask}
          />
          <DeleteConfirmModal
            open={deleteOpen}
            handleClose={() => setDeleteOpen(false)}
            handleDelete={handleDeleteTask}
          />
        </>
      )}
    </DashboardLayout>
  );
}
