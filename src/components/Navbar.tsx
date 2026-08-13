// import {
//   AppBar,
//   Avatar,
//   Box,
//   IconButton,
//   InputBase,
//   Toolbar,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import NotificationMenu from "./NotificationMenu";
// import {

//   Search,
// } from "@mui/icons-material";

// interface Notification {
// id:string;
// message:string;
// }

// interface Props{
// notifications:
// Notification[];
// }
// export default function Navbar({
// notifications
// }:Props){
//   return (
//     <AppBar
//       position="static"
//       elevation={0}
//       sx={{
//         bgcolor: "background.default",
//         color: "text.primary",
//         borderBottom: "1px solid #e5e7eb",
//       }}
//     >
//       <Toolbar
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <IconButton
//   sx={{
//     display: {
//       xs: "flex",
//       md: "none",
//     }
//   }}
// >
//   <MenuIcon />
// </IconButton>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             bgcolor: "#f3f4f6",
//             px: 2,
//             py: 1,
//             borderRadius: 3,
//             width: "300px",
//           }}
//         >
//           <Search sx={{ color: "text.secondary" }} />

//           <InputBase
//             placeholder="Search..."
//             sx={{
//               ml: 1,
//               flex: 1,
//             }}
//           />
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//        <NotificationMenu
// notifications={
// notifications
// }
// />

//           <Avatar>
//             S
//           </Avatar>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

import {
AppBar,
Avatar,
Box,
IconButton,
InputBase,
Toolbar,
Menu,
MenuItem,
ListItemIcon,
Typography,
Divider,
} from "@mui/material";

import MenuIcon
from "@mui/icons-material/Menu";

import {
Search,
PersonOutlined,
LogoutOutlined,
}
from "@mui/icons-material";

import NotificationMenu
from "./NotificationMenu";

import { useState } from "react";

import { useAuth }
from "../context/useAuth";

import {
useNavigate
}
from "react-router-dom";

import type {
Notification
}
from "../types/notification";

interface Props {

notifications:
Notification[];

showNotifications?:
boolean;

searchTerm:
string;

setSearchTerm:
React.Dispatch<
React.SetStateAction<string>
>;

}

export default function Navbar({

notifications,

showNotifications= false,

searchTerm,

setSearchTerm

}: Props) {

const {

role,

logout,

currentUser

}

=

useAuth();

const navigate =
useNavigate();

const isAdmin =
role === "admin";

// avatar menu state

const [

avatarAnchorEl,

setAvatarAnchorEl

]

=

useState<null | HTMLElement>(
null
);

// mobile menu state

const [

menuAnchorEl,

setMenuAnchorEl

]

=

useState<null | HTMLElement>(
null
);

const open =
Boolean(
avatarAnchorEl
);

const openMenu = (

event:
React.MouseEvent<HTMLElement>

) => {

setMenuAnchorEl(
event.currentTarget
);

};

const closeMenu = () => {

setMenuAnchorEl(null);

};

const handleLogout = () => {

setAvatarAnchorEl(null);

logout();

navigate("/login");

};

const displayName =

currentUser?.name

// ||

// "User";

const displayRole =

isAdmin

? "Administrator"

: "Team Member";

const avatarLetter =

currentUser?.name
?.charAt(0)
?.toUpperCase()

// ||

// "U";

return (

<AppBar

position="static"

elevation={0}

sx={{

bgcolor:
"background.default",

color:
"text.primary",

borderBottom:
"1px solid #e5e7eb",

}}

>

<Toolbar
sx={{

display:"flex",

justifyContent:
"space-between"

}}
>

{/* Mobile hamburger */}

<IconButton

onClick={openMenu}

sx={{

display:{

xs:"flex",

md:"none",

},

}}

>

<MenuIcon />

</IconButton>

{/* Search bar */}

<Box
sx={{

display:"flex",

alignItems:"center",

bgcolor:
"background.default",

border:
"1px solid #e5e7eb",

px:2,

py:1,

borderRadius:3,

width:"300px",

}}
>

<Search
sx={{
color:
"text.secondary"
}}
/>

<InputBase

placeholder=
"Search tasks, users..."

value={searchTerm}

onChange={(e)=>

setSearchTerm(
e.target.value
)

}

sx={{

ml:1,

flex:1,

}}

/>

</Box>

{/* Right side */}

<Box
sx={{

display:"flex",

alignItems:"center",

gap:1,

}}
>

{/* Notifications */}
{showNotifications &&(
<NotificationMenu
notifications={notifications}
/>
)}

{/* Avatar */}

<IconButton

onClick={(e)=>

setAvatarAnchorEl(
e.currentTarget
)

}

sx={{
p:0.5
}}

>

<Avatar
sx={{

bgcolor:

isAdmin

? "#4f46e5"

: "#0891b2",

width:36,

height:36,

fontSize:14,

fontWeight:700,

}}

>

{avatarLetter}

</Avatar>

</IconButton>

{/* Profile Menu */}

<Menu

anchorEl={avatarAnchorEl}

open={open}

onClose={()=>

setAvatarAnchorEl(null)

}

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

borderRadius:3,

minWidth:230,

mt:1,

boxShadow:4,

},

},

}}

>

{/* User Info */}

<Box
sx={{
px:2,
py:1.5
}}
>

<Typography
sx={{

fontWeight:700,

fontSize:15,

}}
>

{displayName}

</Typography>

<Typography
sx={{

fontSize:13,

color:
"text.secondary",

}}
>

{displayRole}

</Typography>

<Typography
sx={{

fontSize:12,

color:
"text.disabled",

mt:0.3,

}}
>

{
currentUser?.email
}

</Typography>

</Box>

<Divider />

{/* Profile */}

<MenuItem

onClick={()=>{

navigate("/profile");

setAvatarAnchorEl(null);

}}

sx={{
py:1.2
}}

>

<ListItemIcon>

<PersonOutlined
fontSize="small"
/>

</ListItemIcon>

<Typography
sx={{
fontSize:14
}}
>

Profile

</Typography>

</MenuItem>



{/* <MenuItem

onClick={()=>{

navigate("/settings");

setAvatarAnchorEl(null);

}}

sx={{
py:1.2
}}

> */}

{/* <ListItemIcon>

<SettingsOutlined
fontSize="small"
/> */}

{/* </ListItemIcon> */}
{/* 
<Typography
sx={{
fontSize:14
}}
>

Settings

</Typography> */}

{/* </MenuItem> */}

<Divider />

{/* Logout */}

<MenuItem

onClick={handleLogout}

sx={{

py:1.2,

color:"error.main",

}}

>

<ListItemIcon>

<LogoutOutlined

fontSize="small"

sx={{
color:"error.main"
}}

/>

</ListItemIcon>

<Typography
sx={{
fontSize:14
}}
>

Logout

</Typography>

</MenuItem>

</Menu>

</Box>

{/* Mobile Sidebar Menu */}

<Menu

anchorEl={menuAnchorEl}

open={Boolean(menuAnchorEl)}

onClose={closeMenu}

>

<MenuItem
onClick={()=>{
navigate(role === "admin"

? "/dashboard/admin"

: "/dashboard/user"

);
closeMenu();
}}
>

Dashboard

</MenuItem>

<MenuItem
onClick={()=>{
navigate("/kanban");
closeMenu();
}}
>

Kanban

</MenuItem>

{/* <MenuItem
onClick={()=>{
navigate("/users");
closeMenu();
}}
> */}

{/* Users

</MenuItem> */}

</Menu>

</Toolbar>

</AppBar>

);

}

