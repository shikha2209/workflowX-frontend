import { useState, useEffect } from "react";
import { Box, Typography, Chip, Avatar } from "@mui/material";
import DashboardLayout from "../../layouts/DashboardLayout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import TaskDetailsDrawer from "../../components/TaskDetailsDrawer";
import EditTaskModal from "../../components/EditTaskModal";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  assignee: string;
}

interface Columns {
  [key: string]: {
    title: string;
    tasks: Task[];
  };
}

// ─── default data (used only on very first visit, never again) ───────────────
const DEFAULT_COLUMNS: Columns = {
  todo: {
    title: "Todo",
    tasks: [
      {
        id: "1",
        title: "Task CRUD",
        description: "Implement CRUD functionality",
        priority: "High",
        dueDate: "30 Jul",
        assignee: "Shikha",
      },
    ],
  },
  progress: {
    title: "In Progress",
    tasks: [
      {
        id: "2",
        title: "Dashboard UI",
        description: "Build dashboard layout",
        priority: "Medium",
        dueDate: "1 Aug",
        assignee: "Alex",
      },
    ],
  },
  completed: {
    title: "Completed",
    tasks: [
      {
        id: "3",
        title: "Login UI",
        description: "Authentication completed",
        priority: "Low",
        dueDate: "28 Jul",
        assignee: "John",
      },
    ],
  },
};

const STORAGE_KEY = "kanban_columns";

// ─── helpers ─────────────────────────────────────────────────────────────────
function loadColumns(): Columns {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // If data exists in localStorage, use it; otherwise fall back to defaults
    return saved ? (JSON.parse(saved) as Columns) : DEFAULT_COLUMNS;
  } catch {
    // If JSON is corrupt for any reason, wipe it and start fresh
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_COLUMNS;
  }
}

function saveColumns(columns: Columns) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
}

// ─── component ───────────────────────────────────────────────────────────────
export default function Kanban() {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ✅ Initialize from localStorage instead of hard-coded data
  const [columns, setColumns] = useState<Columns>(loadColumns);

  // ✅ Persist to localStorage whenever columns change (edit, drag, etc.)
  useEffect(() => {
    saveColumns(columns);
  }, [columns]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

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
    const [movedTask] = sourceTasks.splice(source.index, 1);
    destinationTasks.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
      [destination.droppableId]: { ...destinationColumn, tasks: destinationTasks },
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

  const handleSaveTask = (updatedTask: Task) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach((columnId) => {
        newColumns[columnId] = {
          ...newColumns[columnId],
          tasks: newColumns[columnId].tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        };
      });
      return newColumns;
    });
    setSelectedTask(updatedTask);
  };

  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Kanban Board
      </Typography>

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
          {Object.entries(columns).map(([id, column]) => (
            <Droppable key={id} droppableId={id}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    bgcolor: "#f8fafc",
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
                    <Chip label={column.tasks.length} size="small" />
                  </Box>

                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => openTaskDrawer(task)}
                          sx={{
                            bgcolor: "white",
                            p: 2,
                            borderRadius: 3,
                            mb: 2,
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            cursor: "grab",
                            transition: "0.3s",
                            "&:hover": { transform: "translateY(-3px)" },
                          }}
                        >
                          <Typography sx={{ fontWeight: 600 }}>
                            {task.title}
                          </Typography>
                          <Typography
                            sx={{ mt: 1, color: "text.secondary", fontSize: 14 }}
                          >
                            {task.description}
                          </Typography>
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
                            <Typography sx={{ fontSize: 12 }}>
                              📅 {task.dueDate}
                            </Typography>
                            <Avatar sx={{ width: 30, height: 30 }}>
                              {task.assignee[0]}
                            </Avatar>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>

      <TaskDetailsDrawer
        open={drawerOpen}
        handleClose={() => setDrawerOpen(false)}
        task={selectedTask}
        handleEdit={handleEdit}
      />

      <EditTaskModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        task={selectedTask}
        handleSave={handleSaveTask}
      />
    </DashboardLayout>
  );

}
