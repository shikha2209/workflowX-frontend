import { Box } from "@mui/material";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/StatCard";
import RecentActivity from "../../components/RecentActivity";

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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 3,
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
      <RecentActivity />
    </DashboardLayout>
  );
}