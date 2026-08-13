import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate }
from "react-router-dom";
import { useAuth }
from "../context/useAuth";



export default function Sidebar() {
  const navigate =
useNavigate();
const {
    role
  } =
  useAuth();

  const menuItems = [

    {
      label: "Dashboard",

      path:
      role?.toLowerCase() === "admin"
      ? "/dashboard/admin"
      : "/dashboard/user",
    },

    {
      label: "Kanban",
      path: "/kanban",
    },

    ...(role?.toLowerCase() === "admin"

      ? [

          {
            label: "Users",
            path: "/users",
          },

        ]

      : []),

  ];
  return (
    <Box
        sx={{
    width: {
      xs: 0,
      md: 260,
    },
    minWidth: {
      md: 260,
    },
    minHeight: "100vh",
    flexShrink: 0,
    bgcolor: "#111827",
    color: "white",
    p: 3,
    overflow: "hidden",
    display: {
      xs: "none",
      md: "block",
    }
  }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 4,
        }}
      >
        WorkFlow
      </Typography>

      <List>
        {menuItems.map((item) => (

  <ListItemButton
    key={item.label}
    onClick={() =>
      navigate(item.path)
    }
    sx={{
      borderRadius: 2,
      mb: 1,
    }}
  >
    <ListItemText
      primary={item.label}
    />
  </ListItemButton>

))}
      </List>
    </Box>
  );
}