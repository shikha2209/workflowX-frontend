import {
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

interface Activity {
  id:string;
  message:string;
}

interface Props{
  activities:Activity[];
}

export default function ActivityPanel({
activities
}:Props){

return(

<Card
sx={{
borderRadius:4,
height:"100%"
}}
>

<CardContent>

<Typography
variant="h6"
sx={{
fontWeight:700,
mb:3
}}
>
Recent Activity
</Typography>

<Box
sx={{
display:"flex",
flexDirection:"column",
gap:2,
maxHeight:300,
overflow:"auto"
}}
>

{activities.length ? (

activities.map(
(activity)=>(

<Box
key={activity.id}
sx={{
p:1.5,
borderRadius:2,
bgcolor:"#f8fafc"
}}
>

<Typography
sx={{
  fontSize: 14
}}
>
{activity.message}
</Typography>

</Box>

))

):(

<Typography
color="text.secondary"
>
No activity yet
</Typography>

)}

</Box>

</CardContent>

</Card>

)

}