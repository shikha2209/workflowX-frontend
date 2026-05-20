import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

export default function DeleteTaskModal({
  open,
  handleClose,
  handleDelete,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        Delete Task
      </DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete
          this task?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
        >
          No
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}