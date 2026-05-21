import {
  Drawer,
  Box,
  Typography,
  Chip,
  Avatar,
  Button
} from "@mui/material";

interface Task {
  id:string;
  title:string;
  description:string;
  priority:string;
  dueDate:string;
  assignee:string;
}

interface Props{
  open:boolean;
  handleClose:()=>void;
  task:Task | null;
}

export default function TaskDetailsDrawer({
open,
handleClose,
task
}:Props){

if(!task) return null;

return(

<Drawer
anchor="right"
open={open}
onClose={handleClose}
>

<Box
sx={{
width:350,
p:3
}}
>

<Typography
variant="h5"
 sx={{
    fontWeight: 700,
    mb: 3,
  }}
>
Task Details
</Typography>

<Typography
 sx={{
    fontWeight: 600,
  }}
>
{task.title}
</Typography>

<Typography
sx={{
    mt: 2,
    color: "text.secondary",
  }}
>
{task.description}
</Typography>

<Chip
sx={{mt:3}}
label={task.priority}
/>

<Typography
sx={{
    mt: 3,
  }}
>
📅 {task.dueDate}
</Typography>

<Box 
sx={{
  display: "flex",
  alignItems: "center",
  gap: 2,
  mt: 3,
}}
>
<Avatar>
{task.assignee[0]}
</Avatar>

<Typography>
{task.assignee}
</Typography>

</Box>

<Button
fullWidth
variant="contained"
sx={{mt:4}}
onClick={handleClose}
>
Close
</Button>

</Box>

</Drawer>

)

}