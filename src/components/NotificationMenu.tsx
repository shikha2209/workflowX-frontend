import {
Badge,
Box,
Divider,
IconButton,
Menu,
MenuItem,
Typography,
Avatar,
} from "@mui/material";

import NotificationsNoneOutlinedIcon
from "@mui/icons-material/NotificationsNoneOutlined";

import { useState } from "react";

import type {
Notification
}
from "../types/notification";

interface Props{

notifications: Notification[];

}

export default function NotificationMenu({

notifications,

}:Props){

const [anchorEl,setAnchorEl] =
useState<null | HTMLElement>(null);

const open =
Boolean(anchorEl);

const handleOpen = (
event:React.MouseEvent<HTMLElement>
)=>{

setAnchorEl(event.currentTarget);

};

const handleClose = ()=>{

setAnchorEl(null);

};

const unreadNotifications =

notifications.filter(
(item)=> !item.isRead
);



return(

<>

<IconButton
onClick={handleOpen}
>

<Badge

badgeContent={
unreadNotifications.length
}

color="error"

>

<NotificationsNoneOutlinedIcon />

</Badge>

</IconButton>

<Menu

anchorEl={anchorEl}

open={open}

onClose={handleClose}

transformOrigin={{
horizontal:"right",
vertical:"top",
}}

anchorOrigin={{
horizontal:"right",
vertical:"bottom",
}}

slotProps={{

paper:{

sx:{

width:360,

maxHeight:450,

borderRadius:4,

mt:1.5,

boxShadow:
"0 10px 40px rgba(0,0,0,0.12)",

},

},

}}

>

<Box
sx={{
px:2,
py:1.5,
}}
>

<Typography
sx={{
fontWeight:700,
fontSize:16,
}}
>

Notifications

</Typography>

<Typography
sx={{
fontSize:13,
color:"text.secondary",
}}
>

You have {

unreadNotifications.length

} unread notifications

</Typography>

</Box>

<Divider />

{

notifications.length === 0 ? (

<Box
sx={{
p:3,
textAlign:"center",
}}
>

<Typography
color="text.secondary"
>

No notifications found

</Typography>

</Box>

) : (

notifications.map((item)=>{

return(

<MenuItem

key={item._id}

sx={{

alignItems:"flex-start",

py:2,

gap:1.5,

whiteSpace:"normal",

}}

>

<Avatar
sx={{
width:40,
height:40,
bgcolor:"#4f46e5",
fontSize:14,
}}
>

{
item.message?.charAt(0)
}

</Avatar>

<Box>

<Typography
sx={{
fontSize:14,
fontWeight:item.isRead
? 500
: 700,
}}
>

{
item.message
}

</Typography>

<Typography
sx={{
fontSize:12,
color:"text.secondary",
mt:0.5,
}}
>

{
item.createdAt
? new Date(item.createdAt).toLocaleString()
: "Just now"
}

</Typography>

</Box>

</MenuItem>

);

})

)

}

</Menu>

</>

);

}
