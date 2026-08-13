import {
  Box,
  Typography,
  Card,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
} from "@mui/material";
import {
  CheckCircleOutlined,
  RadioButtonUnchecked,
  AccessTimeOutlined,
  NotificationsOutlined,
} from "@mui/icons-material";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { getTasks } from "../../services/taskApi";
import { Link } from "react-router-dom";
import type { Task } from "../../types/task";
import type { Notification } from "../../types/notification";
import axios from "axios";



export default function UserDashboard() {


const [notifications, setNotifications] =
useState<Notification[]>([]);

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

 const [myTasks, setMyTasks] =
useState<Task[]>([]);

const currentUser =
JSON.parse(
localStorage.getItem("user") || "{}"
);

useEffect(() => {

  const fetchTasks = async () => {

    try {

      const response =
        await getTasks();

      const userTasks =
        response.data.filter(
          (task: Task) =>
            task.assignee ===
            currentUser.email
        );

      setMyTasks(userTasks);

    } catch (error) {

      console.log(error);

    }

  };

  fetchTasks();

}, [currentUser.email]);

useEffect(() => {

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

  fetchNotifications();

}, []);

const completed =
myTasks.filter(
task =>
task.status === "completed"
).length;

const inProgress =
myTasks.filter(
task =>
task.status === "inprogress"
).length;

const pending =
myTasks.filter(
task =>
task.status === "todo"
).length;

const total =
myTasks.length;

const progressPct =
total > 0
? Math.round(
(completed / total) * 100
)
: 0;

const alerts = myTasks
.filter(

(task: Task)=>

task.priority === "High"

||

task.status === "todo"

)
.slice(0,4);
  return (
       //✅ pass notifications to DashboardLayout → Navbar bell icon only
    <DashboardLayout notifications={notifications} showNotifications={true}>

      {/* ── Header ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#0891b2", width: 48, height: 48, fontSize: 20 }}>{currentUser.name.charAt(0)}</Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Hey, {currentUser.name} 👋
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
              You have {pending + inProgress} tasks pending today
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Stat row ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        {[
          { label: "Total",       value: total,      color: "#4f46e5" },
          { label: "completed",   value: completed,  color: "#16a34a" },
          { label: "In Progress", value: inProgress, color: "#d97706" },
          { label: "Pending",     value: pending,    color: "#dc2626" },
        ].map((s) => (
          <Card key={s.label} sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
            <Typography sx={{ color: "text.secondary", fontSize: 13 }}>{s.label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: s.color }}>
              {s.value}
            </Typography>
          </Card>
        ))}
      </Box>

      {/* ── Middle row: Progress + Notifications ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Overall progress */}
        <Card sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            My Progress
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 3 }}>
            {completed} of {total} tasks completed
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{ flex: 1, borderRadius: 2, height: 10 }}
              color="primary"
            />
            <Typography sx={{ fontWeight: 700, minWidth: 36 }}>{progressPct}%</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, mt: 3, flexWrap: "wrap" }}>
            <Chip label={`${completed} Done`}     size="small" color="success" />
            <Chip label={`${inProgress} Ongoing`} size="small" color="warning" />
            <Chip label={`${pending} Pending`}    size="small" color="error" />
          </Box>
        </Card>

        {/* Recent alerts card — separate from navbar bell */}
        <Card sx={{ p: 3, borderRadius: 4, boxShadow: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <NotificationsOutlined fontSize="small" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Alerts
            </Typography>
          </Box>
          <List
dense
disablePadding
>

{

alerts.length > 0

?

alerts.map((task: Task,index:number)=>(

<Box
key={task._id}
>

<ListItem
disableGutters
sx={{

alignItems:"flex-start",

py:1,

}}
>

<ListItemText

primary={

<Typography
sx={{

fontSize:13,

fontWeight:500,

}}
>

⚠️ {task.title}

</Typography>

}

secondary={

<Typography
sx={{

fontSize:11,

color:"text.secondary",

}}
>

Due:
{formatDate(task.dueDate)}

</Typography>

}

/>

</ListItem>

{

index < alerts.length - 1

&&

<Divider />

}

</Box>

))

:

(

<Typography
sx={{

fontSize:13,

color:"text.secondary",

mt:2,

}}
>

No recent alerts 🎉

</Typography>

)

}

</List>
        </Card>
      </Box>

      {/* ── Assigned tasks ── */}
     <Card
  sx={{
    p: {
      xs: 2,
      sm: 2.5,
      md: 3,
    },
    borderRadius: 4,
    boxShadow: 2,
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    overflow: "hidden",
  }}
>
  {/* Header */}
  <Box
    sx={{
      display: "flex",
      alignItems: {
        xs: "flex-start",
        sm: "center",
      },
      justifyContent: "space-between",
      gap: 2,
      mb: 3,

      // Mobile: stack title and button
      flexDirection: {
        xs: "column",
        sm: "row",
      },
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        fontSize: {
          xs: 18,
          sm: 20,
        },
        lineHeight: 1.3,
      }}
    >
      My Assigned Tasks
    </Typography>

    <Button
      variant="outlined"
      size="small"
      component={Link}
      to="/kanban"
      sx={{
        borderRadius: 3,
        whiteSpace: "nowrap",
        flexShrink: 0,

        // Mobile button doesn't go outside card
        width: {
          xs: "100%",
          sm: "auto",
        },
      }}
    >
      View Kanban
    </Button>
  </Box>

  {/* Tasks */}
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      width: "100%",
      minWidth: 0,
    }}
  >
    {myTasks.map((task) => (
      <Box
        key={task._id}
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          gap: {
            xs: 1,
            sm: 2,
          },
          p: {
            xs: 1.5,
            sm: 2,
          },
          borderRadius: 3,
          bgcolor: "background.default",
          border: "1px solid",
          borderColor: "divider",
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",

          // Mobile: allow task information to wrap properly
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        {/* Task icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: "auto",
            }}
          >
            {task.status === "completed" ? (
              <CheckCircleOutlined
                sx={{ color: "#16a34a" }}
              />
            ) : task.status === "inprogress" ? (
              <AccessTimeOutlined
                sx={{ color: "#d97706" }}
              />
            ) : (
              <RadioButtonUnchecked
                sx={{ color: "text.disabled" }}
              />
            )}
          </ListItemIcon>
        </Box>

        {/* Task information */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: {
                xs: 14,
                sm: 14,
              },
              textDecoration:
                task.status === "completed"
                  ? "line-through"
                  : "none",
              color:
                task.status === "completed"
                  ? "text.secondary"
                  : "text.primary",

              // Prevent long title from breaking layout
              overflow: "hidden",
              textOverflow: "ellipsis",

              // Desktop = one line
              // Mobile = allow wrapping
              whiteSpace: {
                xs: "normal",
                sm: "nowrap",
              },

              overflowWrap: "anywhere",
            }}
          >
            {task.title}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              mt: 0.5,
              whiteSpace: "normal",
            }}
          >
            📅 Due {formatDate(task.dueDate)}
          </Typography>
        </Box>

        {/* Status / Priority */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexShrink: 0,

            // Mobile: chips stay together
            flexWrap: "wrap",

            width: {
              xs: "100%",
              sm: "auto",
            },
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
            sx={{
              flexShrink: 0,
            }}
          />

          <Chip
            label={task.status}
            size="small"
            variant="outlined"
            color={
              task.status === "completed"
                ? "success"
                : task.status === "inprogress"
                ? "warning"
                : "default"
            }
            sx={{
              flexShrink: 0,
            }}
          />
        </Box>
      </Box>
    ))}
  </Box>
</Card>

    </DashboardLayout>
  );
}