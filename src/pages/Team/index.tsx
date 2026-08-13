import {
Box,
Typography,
Button,
Card,
CardContent,
Avatar,
IconButton,
TextField
} from "@mui/material";

import DeleteIcon
from "@mui/icons-material/Delete";

import AddIcon
from "@mui/icons-material/Add";

import { useState } from "react";

import DashboardLayout
from "../../layouts/DashboardLayout";

import defaultMembers
from "../../data/teamMembers";

interface Member{
id:string;
name:string;
}

export default function Team(){

const [members,setMembers] =
useState<Member[]>(

JSON.parse(
localStorage.getItem(
"members"
) || "null"
)

||

defaultMembers

);

const [name,setName] =
useState("");

const addMember=()=>{

if(!name.trim())
return;

const updated=[

...members,

{
id:
Date.now()
.toString(),

name
}

];

setMembers(
updated
);

localStorage.setItem(
"members",
JSON.stringify(
updated
)
);

setName("");

};

const deleteMember=(
id:string
)=>{

const updated=

members.filter(
(member)=>
member.id!==id
);

setMembers(
updated
);

localStorage.setItem(
"members",
JSON.stringify(
updated
)
);

};

return(

<DashboardLayout>

<Typography
variant="h4"
sx={{
fontWeight:700,
mb:3
}}
>
Team Members
</Typography>

<Box
sx={{
display:"flex",
gap:2,
mb:4,
flexDirection:{
xs:"column",
sm:"row"
}
}}
>

<TextField
label="Member Name"
value={name}
onChange={(e)=>
setName(
e.target.value
)}
fullWidth
/>

<Button
variant="contained"
startIcon={
<AddIcon/>
}
onClick={
addMember
}
>

Add Member

</Button>

</Box>

<Box
sx={{
display:"grid",
gap:2
}}
>

{members.map(
(member)=>(

<Card
key={member.id}
>

<CardContent
sx={{
display:"flex",
justifyContent:
"space-between",
alignItems:"center"
}}
>

<Box
sx={{
display:"flex",
alignItems:"center",
gap:2
}}
>

<Avatar>
{member.name[0]}
</Avatar>

<Typography>
{member.name}
</Typography>

</Box>

<IconButton
color="error"
onClick={()=>
deleteMember(
member.id
)
}
>

<DeleteIcon/>

</IconButton>

</CardContent>

</Card>

))

}

</Box>

</DashboardLayout>

)

}