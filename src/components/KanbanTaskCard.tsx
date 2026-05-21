import {
  Card,
  Typography,
} from "@mui/material";

interface Props {
  title:string;
  description:string;
}

export default function KanbanTaskCard({
title,
description
}:Props){

return(

<Card
sx={{
p:2,
borderRadius:3,
mb:2,
cursor:"pointer",
transition:"0.3s",

"&:hover":{
transform:
"translateY(-3px)"
}
}}
>

<Typography
sx={{
fontWeight:600
}}
>
{title}
</Typography>

<Typography
sx={{
fontSize:14,
color:"gray",
mt:1
}}
>
{description}
</Typography>

</Card>

)

}