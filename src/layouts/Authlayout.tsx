import { Box, Card, Typography } from "@mui/material";
import type { ReactNode } from "react";
interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b,#111827)",
        p: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          borderRadius: 6,
          overflow: "hidden",
          display: "flex",
          minHeight: "90vh",
        }}
      >
        {/* Left side */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            p: 6,
            background:
              "linear-gradient(135deg,#4f46e5,#7c3aed)",
            color: "white",
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 700 }}
          >
            TaskFlow
          </Typography>

          <Typography sx={{ mt: 3 }}>
            Collaborate with your team,
            manage projects and work faster.
          </Typography>
        </Box>

        {/* Right side */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          {children}
        </Box>
      </Card>
    </Box>
  );
}