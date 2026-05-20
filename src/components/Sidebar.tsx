import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

const menuItems = [
  "Dashboard",
  "Projects",
  "Tasks",
  "Team",
  "Notifications",
  "Settings",
];

export default function Sidebar() {
  return (
    <Box
      sx={{
        width:{
   xs:80,
   md:260
},
       
        bgcolor: "#111827",
        color: "white",
        p: 3,
        minHeight:"100vh",
flexShrink:0
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
            key={item}
            sx={{
              borderRadius: 2,
              mb: 1,
            }}
          >
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}