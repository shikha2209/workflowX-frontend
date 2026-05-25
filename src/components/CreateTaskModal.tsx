import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  assignee: string;
}
interface Props {
  open: boolean;
  handleClose: () => void;
  addTask: (task: Task) => void;  

}

export default function CreateTaskModal({
  open,
  handleClose,
  addTask,
}: Props) {
    
  const [formData,setFormData] =
  useState<Task>({
    id:"",
    title:"",
    description:"",
    priority:"Low",
    dueDate:"",
    assignee:"",
  });

  const handleCreate=()=>{

    addTask({
      ...formData,
      id:Date.now().toString()
    });

    setFormData({
      id:"",
      title:"",
      description:"",
      priority:"Low",
      dueDate:"",
      assignee:"",
    });

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
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />  
 <TextField
            select
            label="Priority"
            value={formData.priority}
            onChange={(e)=>
              setFormData({
                ...formData,
                priority:e.target.value as
                "High"|
                "Medium"|
                "Low"
              })
            }
          >
            <MenuItem value="High">
              High
            </MenuItem>

            <MenuItem value="Medium">
              Medium
            </MenuItem>

            <MenuItem value="Low">
              Low
            </MenuItem>

          </TextField>

          <TextField
            label="Due Date"
            placeholder="10 Aug"
            value={formData.dueDate}
            onChange={(e)=>
              setFormData({
                ...formData,
                dueDate:e.target.value
              })
            }
          />

          <TextField
            label="Assignee"
            value={formData.assignee}
            onChange={(e)=>
              setFormData({
                ...formData,
                assignee:e.target.value
              })
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