import { useEffect, useState } from "react";
import axios from "axios";
import type { Notification } from "../../types/notification";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  CheckCircleOutlined,
  GroupOutlined,
  AssignmentOutlined,
  PendingActionsOutlined,
} from "@mui/icons-material";

import DashboardLayout from "../../layouts/DashboardLayout";
import PendingApprovals from "../../components/PendingApprovals";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../../services/taskApi";
import { getUsers } from "../../services/userApi";
import { useSearch } from "../../hooks/useSearch";
import ExpandableText from "../../components/Expandable";
interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate?: string;

  createdAt?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function AdminDashboard() {
  const { searchTerm } = useSearch();

  const [notifications, setNotifications] =
useState<Notification[]>([]);

  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);

  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    setNotifications(response.data);

  } catch (error) {

    console.log(error);

  }

};

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const tasksRes = await getTasks();

        const usersRes = await getUsers(
          1,
          1000
        );

        setTasks(tasksRes.data);

        setUsers(usersRes.data.users);

        await fetchNotifications();

  }


       catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase();

    return (
      task.title?.toLowerCase().includes(search) ||
      task.priority?.toLowerCase().includes(search) ||
      task.status?.toLowerCase().includes(search) ||
      task.assignee?.toLowerCase().includes(search)
    );
  });

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search)
    );
  });
  // ── Dynamic Stats ──

  const totalTasks = filteredTasks.length;

  const completedTasks = filteredTasks.filter(
    (task) => task.status === "completed",
  ).length;

  const pendingTasks = filteredTasks.filter(
    (task) => task.status === "todo",
  ).length;

  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "inprogress",
  ).length;

  const totalUsers = filteredUsers.filter(
    (user) => user.status === "approved",
  ).length;

  const pendingApprovals = filteredUsers.filter(
    (user) => user.status === "pending",
  ).length;
  const progressPct =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Typography>Loading dashboard...</Typography>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout notifications={notifications}
    showNotifications={true}>
      {/* ── Header ── */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Admin Dashboard
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mt: 0.5,
          }}
        >
          Welcome back! Here's what's happening today.
        </Typography>
      </Box>

      {/* ── Stats Cards ── */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",

          gap: 3,

          mb: 4,
        }}
      >
        {[
          {
            title: "Total Tasks",
            value: totalTasks,
            icon: <AssignmentOutlined />,
            color: "#4f46e5",
          },

          {
            title: "Completed Tasks",
            value: completedTasks,
            icon: <CheckCircleOutlined />,
            color: "#16a34a",
          },

          {
            title: "Team Members",
            value: totalUsers,
            icon: <GroupOutlined />,
            color: "#0891b2",
          },

          {
            title: "Pending Approvals",
            value: pendingApprovals,
            icon: <PendingActionsOutlined />,
            color: "#dc2626",
          },
        ].map((item) => (
          <Card
            key={item.title}
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 14,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mt: 1,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: item.color + "18",

                  color: item.color,

                  p: 1.2,

                  borderRadius: 3,

                  display: "flex",
                }}
              >
                {item.icon}
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* ── Middle Section ── */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.5fr 1fr",
          },

          gap: 3,

          mb: 4,
        }}
      >
        {/* ── Workflow Progress ── */}

        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            Workflow Progress
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                Overall Completion
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {progressPct}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{
                height: 10,
                borderRadius: 5,
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip label={`${completedTasks} Completed`} color="success" />

            <Chip label={`${inProgressTasks} In Progress`} color="warning" />

            <Chip label={`${pendingTasks} Pending`} color="error" />
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography
              sx={{
                fontWeight: 600,
                mb: 2,
                fontSize: 15,
              }}
            >
              Recent Workflow Activity
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,

                maxHeight: 260,
                overflowY: "auto",

                pr: 1,

                "&::-webkit-scrollbar": {
                  width: "6px",
                },

                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#cbd5e1",
                  borderRadius: "10px",
                },
              }}
            >
              {tasks.map((task) => (
                <Box
                  key={task._id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "background.default",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {task.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >
                      {task.assignee}
                    </Typography>
                  </Box>

                  <Chip
                    label={task.status}
                    size="small"
                    color={
                      task.status === "completed"
                        ? "success"
                        : task.status === "inprogress"
                          ? "warning"
                          : "error"
                    }
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Card>

        {/* ── Team Overview ── */}

        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: 2,
          }}
        >
          {/* Header */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Team Overview
            </Typography>

            <Chip
              label="View All"
              clickable
              color="primary"
              variant="outlined"
              onClick={() => navigate("/users")}
              sx={{
                fontWeight: 600,
                cursor: "pointer",
              }}
            />
          </Box>

          {/* Team List */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {filteredUsers
              .filter((user) => user.status === "approved")
              .slice(0, 5)
              .map((user) => (
                <Box
                  key={user._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,

                    p: 1.8,

                    borderRadius: 3,

                    bgcolor: "background.default",

                    transition: "0.2s",

                    "&:hover": {
                      transform: "translateY(-2px)",

                      boxShadow: 1,
                    },
                  }}
                >
                  {/* Avatar */}

                  <Avatar
                    sx={{
                      bgcolor: "#4f46e5",

                      width: 42,
                      height: 42,

                      fontWeight: 700,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>

                  {/* User Info */}

                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {user.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "text.secondary",

                        textTransform: "capitalize",
                      }}
                    >
                      {user.role}
                    </Typography>
                  </Box>

                  {/* Assigned Tasks */}

                  <Chip
                    label={`${
                      tasks.filter((task) => task.assignee === user.email)
                        .length
                    } tasks`}
                    size="small"
                    sx={{
                      fontWeight: 600,
                    }}
                  />
                </Box>
              ))}
          </Box>
        </Card>
      </Box>

      {/* ── Bottom Section ── */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            lg: "2fr 1fr",
          },

          gap: 3,
        }}
      >
        {/* ── Recent Tasks ── */}

        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: 2,
          }}
        >
          {/* Header */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Recent Tasks
            </Typography>

            <Chip
              label="View All"
              clickable
              color="primary"
              variant="outlined"
              onClick={() => navigate("/kanban")}
              sx={{
                fontWeight: 600,
                cursor: "pointer",
              }}
            />
          </Box>

          {/* Table */}

          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
              flexDirection: "column",
              gap: 2,
            }}
          >
            {[...filteredTasks]

              .sort(
                (a, b) =>
                  new Date(b.createdAt || "").getTime() -
                  new Date(a.createdAt || "").getTime(),
              )

              .slice(0, 5)

              .map((task) => (
                <Box
                  key={task._id}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid #e5e7eb",
                    bgcolor: "background.default",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {task.title}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      mb: 1,
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

                    <Chip
                      label={task.status}
                      size="small"
                      color={
                        task.status === "completed"
                          ? "success"
                          : task.status === "inprogress"
                            ? "warning"
                            : "default"
                      }
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "text.secondary",
                    }}
                  >
                    Due: {formatDate(task.dueDate)}
                  </Typography>
                </Box>
              ))}
          </Box>

          {/* Desktop Table */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Task
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Priority
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Status
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Due Date
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {[...filteredTasks]

                  .sort(
                    (a, b) =>
                      new Date(b.createdAt || "").getTime() -
                      new Date(a.createdAt || "").getTime(),
                  )

                  .slice(0, 5)

                  .map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>
                        <ExpandableText
                          text={task.title}
                          wordLimit={3}
                          titleStyle={{
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>

                      <TableCell>
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
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={task.status}
                          size="small"
                          color={
                            task.status === "completed"
                              ? "success"
                              : task.status === "inprogress"
                                ? "warning"
                                : "default"
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: 14,
                          }}
                        >
                          {formatDate(task.dueDate)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
        {/* ── Activity ── */}

        <PendingApprovals />
      </Box>
    </DashboardLayout>
  );
}
// import {
//   Box,
//   Typography,
//   Card,
//   Avatar,
//   AvatarGroup,
//   Chip,
//   LinearProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
// } from "@mui/material";
// import {
//   CheckCircleOutlined,
//   GroupOutlined,
//   AssignmentOutlined,
//   TrendingUpOutlined,
// } from "@mui/icons-material";
// import DashboardLayout from "../../layouts/DashboardLayout";
// // import StatCard from "../../components/StatCard";
// import RecentActivity from "../../components/RecentActivity";
// import { useAuth } from "../../context/useAuth";
// import { useNavigate } from "react-router-dom";

// const stats = [
//   { title: "Active Projects", value: "24", icon: <AssignmentOutlined />, color: "#4f46e5" },
//   { title: "Completed Tasks", value: "78", icon: <CheckCircleOutlined/>, color: "#16a34a" },
//   { title: "Team Members",    value: "12", icon: <GroupOutlined />,      color: "#0891b2" },
//   { title: "Pending Tasks",   value: "8",  icon: <TrendingUpOutlined />, color: "#d97706" },
// ];

// const projects = [
//   { name: "WorkflowX Frontend", progress: 72, status: "In Progress", team: ["S", "A", "J"] },
//   { name: "API Integration",    progress: 45, status: "In Progress", team: ["A", "M"] },
//   { name: "Auth Module",        progress: 100, status: "Completed", team: ["J", "S"] },
//   { name: "Dashboard UI",       progress: 90, status: "In Progress", team: ["S", "A", "J", "M"] },
// ];

// const tasks = [
//   { task: "Create Login API",  status: "In Progress", assignee: "Shikha", priority: "High" },
//   { task: "Dashboard UI",      status: "Completed",   assignee: "Alex",   priority: "Low" },
//   { task: "Task Module",       status: "Pending",     assignee: "John",   priority: "Medium" },
//   { task: "Notification Menu", status: "In Progress", assignee: "Maya",   priority: "High" },
//   { task: "Role Auth Guard",   status: "Completed",   assignee: "Shikha", priority: "Medium" },
// ];

// const teamMembers = [
//   { name: "Shikha", role: "Frontend Dev", tasks: 8,  avatar: "S", color: "#4f46e5" },
//   { name: "Alex",   role: "Backend Dev",  tasks: 5,  avatar: "A", color: "#0891b2" },
//   { name: "John",   role: "UI/UX",        tasks: 6,  avatar: "J", color: "#16a34a" },
//   { name: "Maya",   role: "QA Engineer",  tasks: 3,  avatar: "M", color: "#d97706" },
// ];

// export default function AdminDashboard() {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <DashboardLayout>

//       {/* ── Header ── */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
//         <Box>
//           <Typography variant="h4" sx={{ fontWeight: 700 }}>
//             Admin Dashboard
//           </Typography>
//           <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
//             Welcome back! Here's what's happening today.
//           </Typography>
//         </Box>
//         <Button variant="outlined" color="error" onClick={handleLogout} sx={{ borderRadius: 3 }}>
//           Logout
//         </Button>
//       </Box>

//       {/* ── Stat cards ── */}
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//           gap: 3,
//           mb: 4,
//         }}
//       >
//         {stats.map((item) => (
//           <Card key={item.title} sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//               <Box>
//                 <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
//                   {item.title}
//                 </Typography>
//                 <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
//                   {item.value}
//                 </Typography>
//               </Box>
//               <Box
//                 sx={{
//                   bgcolor: item.color + "18",
//                   color: item.color,
//                   p: 1.2,
//                   borderRadius: 3,
//                   display: "flex",
//                 }}
//               >
//                 {item.icon}
//               </Box>
//             </Box>
//           </Card>
//         ))}
//       </Box>

//       {/* ── Middle row: Projects + Team ── */}
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr", lg: "1.6fr 1fr" },
//           gap: 3,
//           mb: 4,
//         }}
//       >
//         {/* Project progress */}
//         <Card sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
//           <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//             Project Progress
//           </Typography>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//             {projects.map((p) => (
//               <Box key={p.name}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//                   <Box>
//                     <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{p.name}</Typography>
//                     <Chip
//                       label={p.status}
//                       size="small"
//                       color={p.status === "Completed" ? "success" : "warning"}
//                       sx={{ mt: 0.5 }}
//                     />
//                   </Box>
//                   <Box sx={{ textAlign: "right" }}>
//                     <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
//                       {p.progress}%
//                     </Typography>
//                     <AvatarGroup max={3} sx={{ mt: 0.5, justifyContent: "flex-end" }}>
//                       {p.team.map((t) => (
//                         <Avatar key={t} sx={{ width: 24, height: 24, fontSize: 11 }}>
//                           {t}
//                         </Avatar>
//                       ))}
//                     </AvatarGroup>
//                   </Box>
//                 </Box>
//                 <LinearProgress
//                   variant="determinate"
//                   value={p.progress}
//                   sx={{ borderRadius: 2, height: 6 }}
//                   color={p.progress === 100 ? "success" : "primary"}
//                 />
//               </Box>
//             ))}
//           </Box>
//         </Card>

//         {/* Team overview */}
//         <Card sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
//           <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//             Team Overview
//           </Typography>
//           <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//             {teamMembers.map((m) => (
//               <Box
//                 key={m.name}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 2,
//                   p: 1.5,
//                   borderRadius: 3,
//                   bgcolor: "background.default",
//                 }}
//               >
//                 <Avatar sx={{ bgcolor: m.color, width: 38, height: 38 }}>
//                   {m.avatar}
//                 </Avatar>
//                 <Box sx={{ flex: 1 }}>
//                   <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{m.name}</Typography>
//                   <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{m.role}</Typography>
//                 </Box>
//                 <Chip label={`${m.tasks} tasks`} size="small" />
//               </Box>
//             ))}
//           </Box>
//         </Card>
//       </Box>

//       {/* ── Bottom row: Task table + Activity ── */}
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
//           gap: 3,
//         }}
//       >
//         {/* Task table */}
//         <Card sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
//           <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
//             Today's Tasks
//           </Typography>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 600 }}>Task</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Assignee</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tasks.map((t) => (
//                 <TableRow key={t.task} sx={{ "&:hover": { bgcolor: "background.default" } }}>
//                   <TableCell>{t.task}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={t.priority}
//                       size="small"
//                       color={
//                         t.priority === "High" ? "error" :
//                         t.priority === "Medium" ? "warning" : "success"
//                       }
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip
//                       label={t.status}
//                       size="small"
//                       color={
//                         t.status === "Completed" ? "success" :
//                         t.status === "In Progress" ? "warning" : "default"
//                       }
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       <Avatar sx={{ width: 26, height: 26, fontSize: 12 }}>
//                         {t.assignee[0]}
//                       </Avatar>
//                       {t.assignee}
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </Card>

//         {/* Recent activity */}
//         <RecentActivity />
//       </Box>

//     </DashboardLayout>
//   );
// }
