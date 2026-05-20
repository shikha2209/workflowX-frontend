import { Box } from "@mui/material";
import type { ReactNode } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
           width: "100%",
          overflow: "auto",
        }}
      >
        <Navbar />

        <Box sx={{  width: "100%",p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}