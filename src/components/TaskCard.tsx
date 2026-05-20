import {
  Card,
  Typography,
  Chip,
  Box,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";


interface TaskProps {
  title: string;
  description: string;
  status: string;
  onDelete?: () => void;
}

export default function TaskCard({
  title,
  description,
  status,
  onDelete,
}: TaskProps) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        position:"relative"
      }}
    >
         <IconButton
        sx={{
          position:"absolute",
          top:10,
          right:10
        }}
        onClick={onDelete}
      >
        <DeleteIcon/>
      </IconButton>
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