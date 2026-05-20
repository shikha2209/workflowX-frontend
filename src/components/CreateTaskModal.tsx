import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  addTask: (task: {
    title: string;
    description: string;
    status: string;
  }) => void;
}

export default function CreateTaskModal({
  open,
  handleClose,
  addTask,
}: Props) {
    const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const handleCreate = () => {

    addTask({
      title,
      description,
      status: "Pending",
    });

    setTitle("");
    setDescription("");

    handleClose();
  };
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
            value={title}
  onChange={(e)=>
    setTitle(e.target.value)
  }
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={description}
  onChange={(e)=>
    setDescription(e.target.value)
  }
          />

          <Button
            variant="contained"
             onClick={handleCreate}
          >
            Create Task
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}