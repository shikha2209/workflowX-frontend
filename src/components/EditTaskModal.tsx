import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import type { Task } from "../types/task";
import {
  LocalizationProvider
} from "@mui/x-date-pickers/LocalizationProvider";

import {
  AdapterDayjs
} from "@mui/x-date-pickers/AdapterDayjs";

import {
  DatePicker
} from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

import {
  useState,
  useEffect,
} from "react";

import {
  getUsers
} from "../services/userApi";

import {
  useAuth
} from "../context/useAuth";

interface User {

  _id:string;

  name:string;

  email:string;

  role:string;

  status?:string;

}

interface Props {

  open: boolean;

  handleClose: () => void;

  task: Task | null;

  handleSave:
  (
    updatedTask: Task
  ) => void;

}

function TaskForm({

  task,

  handleClose,

  handleSave,

}: {

  task: Task;

  handleClose: () => void;

  handleSave:
  (
    updatedTask: Task
  ) => void;

}) {

  const [formData,
  setFormData] =
  useState<Task>({
    ...task
  });

  const [users,
  setUsers] =
  useState<User[]>([]);

  const {
    currentUser
  } =
  useAuth();

  useEffect(()=>{

    const fetchUsers =
    async()=>{

      try{

        const response =
        await getUsers();

        setUsers(

          response.data.filter(
            (member:User)=>

              member.status ===
              "approved"

              &&

              member.email !==
              currentUser?.email

          )

        );

      }
      catch(error){

        console.log(error);

      }

    };

    fetchUsers();

  },[
    currentUser?.email
  ]);

  const handleChange =
  (
    field:keyof Task
  ) =>
  (
    e:React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData((prev)=>({

      ...prev,

      [field]:
      e.target.value

    }));

  };

  return (

    <Box
      sx={{

        display:"flex",

        flexDirection:"column",

        gap:3,

        mt:2,

      }}
    >

      <TextField
        label="Title"
        value={formData.title}
        onChange={handleChange("title")}
      />

      <TextField
        label="Description"
        multiline
        rows={3}
        value={formData.description}
        onChange={handleChange("description")}
      />

      <TextField
        select
        label="Priority"
        value={formData.priority}
        onChange={(e)=>

          setFormData((prev)=>({

            ...prev,

            priority:
            e.target.value as
            "High"
            |
            "Medium"
            |
            "Low",

          }))

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

      <LocalizationProvider
        dateAdapter={AdapterDayjs}
      >

        <DatePicker

          label="Due Date"

          value={

            formData.dueDate

            ? dayjs(
                formData.dueDate
              )

            : null

          }

          onChange={(newValue)=>

            setFormData({

              ...formData,

              dueDate:

              newValue

              ? newValue.toISOString()

              : ""

            })

          }

          slotProps={{

            textField:{

              fullWidth:true

            }

          }}

        />

      </LocalizationProvider>

      <TextField

        select

        label="Assign To"

        value={formData.assignee}

        onChange={handleChange("assignee")}

      >

        {users.map((user)=>(

          <MenuItem

            key={user._id}

            value={user.email}

          >

            {user.name}
            {" "}
            ({user.role})

          </MenuItem>

        ))}

      </TextField>

      <Button

        variant="contained"

        onClick={()=>{

          handleSave(
            formData
          );

          handleClose();

        }}

      >

        Save Changes

      </Button>

    </Box>

  );

}

export default function EditTaskModal({

  open,

  handleClose,

  task,

  handleSave,

}: Props) {

  return (

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>
        Edit Task
      </DialogTitle>

      <DialogContent>

        {task && (

          <TaskForm

            key={task.id}

            task={task}

            handleClose={handleClose}

            handleSave={handleSave}

          />

        )}

      </DialogContent>

    </Dialog>

  );

}


// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   Button,
//   Box,
//   MenuItem,
// } from "@mui/material";

// import { useState } from "react";
// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   priority: "High" | "Medium" | "Low";
//   dueDate: string;
//   assignee: string;
// }

// interface Props {
//   open: boolean;
//   handleClose: () => void;
//   task: Task | null;
//   handleSave: (updatedTask: Task) => void;
// }

// interface Member {
//   id: string;
//   name: string;
// }

// const teamMembers: Member[] =
// JSON.parse(
//   localStorage.getItem(
//     "members"
//   ) || "[]"
// );
// // Inner form component — remounts fresh every time `task.id` changes
// // because the parent passes key={task.id} to it. This lets useState
// // initialize from props correctly without needing useEffect + setState.
// function TaskForm({
//   task,
//   handleClose,
//   handleSave,
// }: {
//   task: Task;
//   handleClose: () => void;
//   handleSave: (updatedTask: Task) => void;
// }) {
//   const [formData, setFormData] = useState<Task>({ ...task });

//   const handleChange =
//     (field: keyof Task) => (e: React.ChangeEvent<HTMLInputElement>) => {
//       setFormData((prev) => ({ ...prev, [field]: e.target.value }));
//     };

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
//       <TextField
//         label="Title"
//         value={formData.title}
//         onChange={handleChange("title")}
//       />

//       <TextField
//         label="Description"
//         multiline
//         rows={3}
//         value={formData.description}
//         onChange={handleChange("description")}
//       />

//       <TextField
//         select
//         label="Priority"
//         value={formData.priority}
//         onChange={(e) =>
//           setFormData((prev) => ({
//             ...prev,
//             priority: e.target.value as "High" | "Medium" | "Low",
//           }))
//         }
//       >
//         <MenuItem value="High">High</MenuItem>
//         <MenuItem value="Medium">Medium</MenuItem>
//         <MenuItem value="Low">Low</MenuItem>
//       </TextField>

//       <TextField
//         label="Due Date"
//         value={formData.dueDate}
//         onChange={handleChange("dueDate")}
//       />

//       <TextField
//         select
//         label="Assign To"
//         value={formData.assignee}
//         onChange={handleChange("assignee")}
//       >
//         {teamMembers.map((member) => (
//           <MenuItem key={member.id} value={member.name}>
//             {member.name}
//           </MenuItem>
//         ))}
//       </TextField>

//       <Button
//         variant="contained"
//         onClick={() => {
//           handleSave(formData);
//           handleClose();
//         }}
//       >
//         Save Changes
//       </Button>
//     </Box>
//   );
// }

// export default function EditTaskModal({
//   open,
//   handleClose,
//   task,
//   handleSave,
// }: Props) {
//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//       <DialogTitle>Edit Task</DialogTitle>
//       <DialogContent>
//         {/* key={task.id} causes TaskForm to fully remount whenever a
//             different task is selected, so useState always gets fresh
//             initial values — no useEffect, no cascading renders. */}
//         {task && (
//           <TaskForm
//             key={task.id}
//             task={task}
//             handleClose={handleClose}
//             handleSave={handleSave}
//           />
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
