import {
Box,
Typography
} from "@mui/material";

import KanbanTaskCard from "./KanbanTaskCard";

interface Task{
title:string;
description:string;
}

interface Props{
title:string;
tasks:Task[];
}

export default function
KanbanColumn({
title,
tasks
}:Props){

return(

<Box
sx={{
bgcolor:"#f8fafc",
borderRadius:4,
p:3,
minHeight:500
}}
>

<Typography
variant="h6"
sx={{
fontWeight:700,
mb:3
}}
>
{title}
</Typography>

{tasks.map((task)=>(

<KanbanTaskCard
key={task.title}
title={task.title}
description={
task.description
}
/>

))}

</Box>

)

}