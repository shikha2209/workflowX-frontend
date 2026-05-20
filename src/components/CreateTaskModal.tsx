import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
} from "@mui/material";

interface Props {
  open: boolean;
  handleClose: () => void;
}

export default function CreateTaskModal({
  open,
  handleClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Create Task
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 2,
          }}
        >
          <TextField
            label="Task Title"
            fullWidth
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
          />

          <Button
            variant="contained"
          >
            Create Task
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}