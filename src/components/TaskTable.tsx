import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";

const tasks = [
  {
    task: "Create Login API",
    status: "In Progress",
    assignee: "Shikha",
  },
  {
    task: "Dashboard UI",
    status: "Completed",
    assignee: "Alex",
  },
  {
    task: "Task Module",
    status: "Pending",
    assignee: "John",
  },
];

export default function TaskTable() {
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
        Today's Tasks
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assignee</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.task}>
              <TableCell>
                {task.task}
              </TableCell>

              <TableCell>
                <Chip
                  label={task.status}
                  color={
                    task.status === "Completed"
                      ? "success"
                      : task.status === "In Progress"
                      ? "warning"
                      : "default"
                  }
                />
              </TableCell>

              <TableCell>
                {task.assignee}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}