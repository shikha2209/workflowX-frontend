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
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
        }}
      >
        <Navbar />

        <Box sx={{ p: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}