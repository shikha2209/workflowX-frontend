import {
  Card,
  Typography,
  Chip,
  Box,
} from "@mui/material";

interface TaskProps {
  title: string;
  description: string;
  status: string;
}

export default function TaskCard({
  title,
  description,
  status,
}: TaskProps) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "gray",
          mb: 2,
        }}
      >
        {description}
      </Typography>

      <Box>
        <Chip
          label={status}
          color={
            status === "Completed"
              ? "success"
              : status === "In Progress"
              ? "warning"
              : "default"
          }
        />
      </Box>
    </Card>
  );
}