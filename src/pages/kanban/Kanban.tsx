import { Box } from "@mui/material";

import DashboardLayout
from "../../layouts/DashboardLayout";

import KanbanColumn
from "../../components/KanbanColumn";

export default function Kanban(){

const todo=[
{
title:"Task CRUD",
description:
"Implement create update delete"
}
];

const inProgress=[
{
title:"Dashboard UI",
description:
"Build dashboard section"
}
];

const completed=[
{
title:"Login UI",
description:
"Authentication screens completed"
}
];

return(

<DashboardLayout>

<Box
sx={{
display:"grid",
gridTemplateColumns:{
xs:"1fr",
md:"repeat(3,1fr)"
},
gap:3
}}
>

<KanbanColumn
title="Todo"
tasks={todo}
/>

<KanbanColumn
title="In Progress"
tasks={inProgress}
/>

<KanbanColumn
title="Completed"
tasks={completed}
/>

</Box>

</DashboardLayout>

)

}