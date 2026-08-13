// import {
//   Drawer,
//   Box,
//   Typography,
//   Chip,
//   Avatar,
//   Button,
// } from "@mui/material";

// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   priority: string;
//   dueDate: string;
//   assignee: string;
// }

// interface Props {
//   open: boolean;
//   handleClose: () => void;
//   task: Task | null;
//   // ✅ FIX 1: both are optional — undefined when user role (no edit/delete)
//   handleEdit?: () => void;
//   handleDelete?: () => void;
// }

// export default function TaskDetailsDrawer({
//   open,
//   handleClose,
//   task,
//   handleEdit,
//   handleDelete,
// }: Props) {
//   if (!task) return null;

//   const isAdmin = !!handleEdit && !!handleDelete;

//   return (
//     <Drawer anchor="right" open={open} onClose={handleClose}>
//       <Box sx={{ width: 350, p: 3 }}>
//         <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
//           Task Details
//         </Typography>

//         <Typography sx={{ fontWeight: 600 }}>{task.title}</Typography>

//         <Typography sx={{ mt: 2, color: "text.secondary" }}>
//           {task.description}
//         </Typography>

//         <Chip sx={{ mt: 3 }} label={task.priority} />

//         <Typography sx={{ mt: 3 }}>📅 {new Date(task.dueDate).toLocaleString(
// "en-IN",
// {
// dateStyle:"medium",
// timeStyle:"short",
// timeZone:"Asia/Kolkata",
// }
// )}</Typography>

//         <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}>
//           <Avatar>{task.assignee[0]}</Avatar>
//           <Typography>{task.assignee}</Typography>
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             gap: 1.5,
//             mt: 4,
//             justifyContent: "center",
//             flexWrap: "wrap",
//           }}
//         >
//           {/* ✅ FIX 2: only render Edit/Delete buttons when admin */}
//           {isAdmin && (
//             <>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={handleEdit}
//                 sx={{ borderRadius: "999px", px: 3, minWidth: "90px" }}
//               >
//                 Edit
//               </Button>

//               <Button
//                 variant="outlined"
//                 color="error"
//                 size="small"
//                 onClick={handleDelete}
//                 sx={{ borderRadius: "999px", px: 3, minWidth: "90px" }}
//               >
//                 Delete
//               </Button>
//             </>
//           )}

//           {/* ✅ user sees a read-only label instead */}
//           {!isAdmin && (
//             <Chip
//               label="View only — contact admin to edit"
//               size="small"
//               sx={{ mb: 1 }}
//             />
//           )}

//           <Button
//             fullWidth
//             variant="contained"
//             sx={{ mt: 1 }}
//             onClick={handleClose}
//           >
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// }
import {
Drawer,
Box,
Typography,
Chip,
Avatar,
Button,
TextField,
Divider,
List,
ListItem,
ListItemText,
} from "@mui/material";

import {
useEffect,
useState,
} from "react";

import axios from "axios";

interface Task {
_id:string;
title:string;
description:string;
priority:string;
dueDate:string;
assignee:string;
}

interface Submission {

_id:string;

githubLink:string;

liveLink:string;

notes:string;

attachments:string[];

submittedBy:string;

submittedAt:string;

status:string;

}

interface Props {

open:boolean;

handleClose:()=>void;

task:Task | null;

handleEdit?:()=>void;

handleDelete?:()=>void;

}

export default function TaskDetailsDrawer({

open,
handleClose,
task,
handleEdit,
handleDelete,

}:Props){

const isAdmin =
!!handleEdit &&
!!handleDelete;

const token =
localStorage.getItem(
"token"
);

const [githubLink,setGithubLink] =
useState("");

const [liveLink,setLiveLink] =
useState("");

const [notes,setNotes] =
useState("");

const [files,setFiles] =
useState<FileList | null>(null);

const [submissions,setSubmissions] =
useState<Submission[]>([]);

const fetchSubmissions =
async()=>{

if(!task) return;

try{

const response =
await axios.get(

`http://localhost:5000/api/task-submissions/${task._id}`,

{
headers:{
Authorization:
`Bearer ${token}`
}
}

);

setSubmissions(
response.data
);

}
catch(error){

console.log(error);

}

};

useEffect(()=>{

if(!task) return;

let mounted = true;

const fetchSubmissions =
async()=>{

try{

const response =
await axios.get(

`http://localhost:5000/api/task-submissions/${task._id}`,

{
headers:{
Authorization:
`Bearer ${token}`,
},
}

);

if(mounted){

setSubmissions(
response.data
);

}

}
catch(error){

console.log(error);

}

};

fetchSubmissions();

return ()=>{

mounted = false;

};

},[task,token]);


const handleSubmitWork =
async()=>{

if(!task) return;

try{

const formData =
new FormData();

formData.append(
"taskId",
task._id
);

formData.append(
"githubLink",
githubLink
);

formData.append(
"liveLink",
liveLink
);

formData.append(
"notes",
notes
);

if(files){

Array.from(files).forEach(
(file)=>{

formData.append(
"attachments",
file
);

});

}

await axios.post(

"http://localhost:5000/api/task-submissions",

formData,

{
headers:{
Authorization:
`Bearer ${token}`
}
}

);

setGithubLink("");
setLiveLink("");
setNotes("");

await fetchSubmissions();

alert(
"Work submitted successfully"
);

}
catch(error){

console.log(error);

}

};

if(!task) return null;

return(

<Drawer
anchor="right"
open={open}
onClose={handleClose}
>

<Box
sx={{
width:400,
p:3,
}}
>

<Typography
variant="h5"
sx={{
fontWeight:700,
mb:3,
}}
>
Task Details
</Typography>

<Typography
sx={{
fontWeight:700,
fontSize:20,
}}
>
{task.title}
</Typography>

<Typography
sx={{
mt:2,
color:"text.secondary",
}}
>
{task.description}
</Typography>

<Chip
sx={{ mt:3 }}
label={task.priority}
/>

<Typography sx={{ mt:3 }}>
📅 {
new Date(task.dueDate)
.toLocaleString(
"en-IN",
{
dateStyle:"medium",
timeStyle:"short",
timeZone:"Asia/Kolkata",
}
)
}
</Typography>

<Box
sx={{
display:"flex",
alignItems:"center",
gap:2,
mt:3,
}}
>

<Avatar>
{task.assignee[0]}
</Avatar>

<Typography>
{task.assignee}
</Typography>

</Box>

<Divider sx={{ my:4 }} />

{/* USER SUBMISSION FORM */}

{!isAdmin && (

<Box>

<Typography
sx={{
fontWeight:700,
mb:2,
}}
>
Submit Work
</Typography>

<TextField
fullWidth
label="GitHub Branch / PR Link"
value={githubLink}
onChange={(e)=>
setGithubLink(
e.target.value
)
}
sx={{ mb:2 }}
/>

<TextField
fullWidth
label="Live URL"
value={liveLink}
onChange={(e)=>
setLiveLink(
e.target.value
)
}
sx={{ mb:2 }}
/>

<TextField
fullWidth
multiline
rows={4}
label="Work Notes"
value={notes}
onChange={(e)=>
setNotes(
e.target.value
)
}
sx={{ mb:2 }}
/>

<input
type="file"
multiple
onChange={(e)=>
setFiles(
e.target.files
)
}
/>

<Button
fullWidth
variant="contained"
sx={{ mt:3 }}
onClick={handleSubmitWork}
>
Submit Work
</Button>

</Box>

)}

{/* ADMIN REVIEW */}

{isAdmin && (

<Box>

<Typography
sx={{
fontWeight:700,
mb:2,
}}
>
Submissions
</Typography>

{submissions.length === 0 ? (

<Typography>
No submissions yet
</Typography>

) : (

<List>

{submissions.map(
(submission)=>(

<ListItem
key={submission._id}
sx={{
display:"block",
border:"1px solid #eee",
borderRadius:3,
mb:2,
}}
>

<ListItemText

primary={
submission.submittedBy
}

secondary={
new Date(
submission.submittedAt
).toLocaleString()
}

/>

<Typography
sx={{
fontSize:14,
mb:1,
}}
>
GitHub:
<a
href={submission.githubLink}
target="_blank"
>
 Open
</a>
</Typography>

<Typography
sx={{
fontSize:14,
mb:1,
}}
>
Live:
<a
href={submission.liveLink}
target="_blank"
>
 Open
</a>
</Typography>

<Typography
sx={{
fontSize:14,
mb:1,
}}
>
{submission.notes}
</Typography>

{submission.attachments.map(
(file,index)=>(

<Box key={index}>

<a
href={`http://localhost:5000/${file}`}
target="_blank"
>

View Attachment

</a>

</Box>

)
)}

</ListItem>

)
)}

</List>

)}

</Box>

)}

<Box
sx={{
display:"flex",
gap:2,
mt:4,
}}
>

{isAdmin && (

<>

<Button
variant="outlined"
size="small"
onClick={handleEdit}
sx={{ minWidth:"70px", px:1.5, py:0.4, fontSize:"12px", borderRadius:"8px", }}
>
Edit
</Button>

<Button
variant="outlined"
size="small"
color="error"
onClick={handleDelete}
sx={{ minWidth:"70px", px:1.5, py:0.4, fontSize:"12px", borderRadius:"8px", }}
>
Delete
</Button>

</>

)}

<Button
variant="contained"
fullWidth
onClick={handleClose}
size="small"
>
Close
</Button>

</Box>

</Box>

</Drawer>

);

}
