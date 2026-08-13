import { Box,IconButton } from "@mui/material";
import { type ReactNode } from "react";
import { useSearch } from "../hooks/useSearch";
import LightModeIcon
from "@mui/icons-material/LightMode";
import {
useThemeContext
}
from "../hooks/useThemeContext";
import DarkModeIcon
from "@mui/icons-material/DarkMode";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import type {Notification
} from "../types/notification";


interface Props{
children:ReactNode;
notifications?:
Notification[];

showNotifications?:boolean;
}

export default function DashboardLayout({
  children,
  notifications=[],
  showNotifications=false,
}: Props) {

const {
  searchTerm,
  setSearchTerm
} =
useSearch();

  const {
toggleTheme,
mode
}
=
useThemeContext();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
bgcolor:"background.default",
color:"text.primary"      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
           width: "100%",
          overflow: "auto",
        }}
      >
        <Navbar
        notifications={notifications}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showNotifications={showNotifications}
        />
<IconButton
onClick={
toggleTheme
}
>

{
mode==="light"

?

<DarkModeIcon/>

:

<LightModeIcon/>

}

</IconButton>
        <Box sx={{  width: "100%",p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}