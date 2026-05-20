import { Box, Typography } from "@mui/material";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import RecentActivity from "../../components/RecentActivity";
import TaskTable from "../../components/TaskTable";

export default function Dashboard() {
  const stats = [
    {
      title: "Active Projects",
      value: "24",
    },
    {
      title: "Completed Tasks",
      value: "78",
    },
    {
      title: "Team Members",
      value: "12",
    },
    {
      title: "Pending Tasks",
      value: "8",
    },
  ];

  return (
    <DashboardLayout>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
        }}
      >
        Dashboard
      </Typography>

      {/* Stats Section */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
          />
        ))}
      </Box>

      {/* Bottom Section */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 2fr",
          },
          gap: 3,
        }}
      >
        <RecentActivity />

        <TaskTable />
      </Box>
    </DashboardLayout>
  );
}