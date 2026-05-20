import {
  Card,
  Typography,
  Box,
} from "@mui/material";

const activities = [
  {
    user: "John",
    action: "assigned a task",
    time: "2 mins ago",
  },
  {
    user: "Shikha",
    action: "created a project",
    time: "5 mins ago",
  },
  {
    user: "Alex",
    action: "completed a task",
    time: "10 mins ago",
  },
];

export default function RecentActivity() {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        mt: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
        }}
      >
        Recent Activity
      </Typography>

      {activities.map((item, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            borderBottom:
              index !== activities.length - 1
                ? "1px solid #eee"
                : "none",
            pb: 2,
          }}
        >
          <Typography>
            <strong>{item.user}</strong>{" "}
            {item.action}
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "gray",
            }}
          >
            {item.time}
          </Typography>
        </Box>
      ))}
    </Card>
  );
}