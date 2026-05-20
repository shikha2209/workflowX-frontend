import { useState } from "react";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import DashboardLayout from "../../layouts/DashboardLayout";

import TaskCard from "../../components/TaskCard";
import CreateTaskModal from "../../components/CreateTaskModal";

export default function Tasks() {
  const [open,setOpen]=useState(false);

  const tasks=[
    {
      title:"Login UI",
      description:
      "Create authentication screens",
      status:"Completed"
    },

    {
      title:"Dashboard",
      description:
      "Build dashboard layout",
      status:"In Progress"
    },

    {
      title:"Task Module",
      description:
      "Implement task features",
      status:"Pending"
    }
  ];

  return(
    <DashboardLayout>

      <Box
        sx={{
          display:"flex",
          justifyContent:
          "space-between",
          alignItems:"center",
          mb:4
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight:700
          }}
        >
          Tasks
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon/>}
          onClick={()=>
            setOpen(true)
          }
        >
          Create Task
        </Button>
      </Box>

      <Box
        sx={{
          display:"grid",
          gridTemplateColumns:
          "repeat(auto-fit,minmax(280px,1fr))",
          gap:3
        }}
      >
        {tasks.map((task)=>(
          <TaskCard
            key={task.title}
            title={task.title}
            description={
              task.description
            }
            status={task.status}
          />
        ))}
      </Box>

      <CreateTaskModal
        open={open}
        handleClose={()=>
          setOpen(false)
        }
      />

    </DashboardLayout>
  )
}