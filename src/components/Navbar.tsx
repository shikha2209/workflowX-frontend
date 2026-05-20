import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
} from "@mui/material";

import {
  NotificationsOutlined,
  Search,
} from "@mui/icons-material";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "black",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f3f4f6",
            px: 2,
            py: 1,
            borderRadius: 3,
            width: "300px",
          }}
        >
          <Search sx={{ color: "gray" }} />

          <InputBase
            placeholder="Search..."
            sx={{
              ml: 1,
              flex: 1,
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton>
            <NotificationsOutlined />
          </IconButton>

          <Avatar>
            S
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}