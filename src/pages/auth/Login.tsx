import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Typography,

} from "@mui/material";
import {loginUser} from "../../services/authApi";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import WorkflowIllustration
from "../../assets/workflow-illustration.svg";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CircularProgress
from "@mui/material/CircularProgress";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [loading,setLoading] =
useState(false);
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleLogin =
async()=>{

try{

  setLoading(true);

const response =

await loginUser({

email,
password

});

console.log(
response.data
);

const {
token,
user
}
=
response.data;


localStorage.setItem(
"token",
token
);

localStorage.setItem(
"user",
JSON.stringify(
user
));

console.log(
"user role:",
user.role
);


if(
user.role==="admin"
){

navigate(
"/dashboard/admin"
);

}
else{

navigate(
"/dashboard/user"
);

}

}
catch(error: unknown){

if( typeof error === "object" && error !== null && "response" in error ){ const err = error as { response?:{ data?:{ message?:string } } }; alert( err.response?.data?.message || "Login failed" ); } else{ alert( "Login failed" ); } console.log(error);
}
finally{

setLoading(false);

}
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg,#0f172a,#1e293b,#111827)",
        p: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          borderRadius: 6,
          overflow: "hidden",
          display: "flex",
          minHeight: "90vh",
          background: "rgba(255,255,255,.05)",
          backdropFilter: "blur(15px)",
        }}
      >
        {/* ── Left panel ── */}
        <Box
          sx={{
            flex: 1,
            color: "white",
            p: 8,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            position:"relative",
            overflow:"hidden",
            background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              WorkflowX
            </Typography>
            <Typography sx={{ opacity: 0.8, fontSize: 18 }}>
              Collaborate with your team, manage projects and build faster.
            </Typography>
          </Box>

 {/* Floating Digital Workforce Icons */}
<Box
sx={{
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
mt:6,
}}
>
  <Box
component="img"
src={WorkflowIllustration}
alt="workflow"
sx={{
width:{
xs:"220px",
md:"360px",
},
maxWidth:"100%",
objectFit:"contain",
}}
/>
</Box>
<GroupOutlinedIcon
sx={{
position:"absolute",
bottom:80,
left:60,
fontSize:180,
color:"white",
opacity:0.08,
}}
/>

<TaskAltOutlinedIcon
sx={{
position:"absolute",
bottom:220,
right:100,
fontSize:100,
color:"white",
opacity:0.1,
}}
/>

<InsightsOutlinedIcon
sx={{
position:"absolute",
bottom:100,
right:220,
fontSize:140,
color:"white",
opacity:0.08,
}}
/>

{/* Decorative Circles */}

<Box
sx={{
position:"absolute",
width:220,
height:220,
borderRadius:"50%",
background:"rgba(255,255,255,0.08)",
bottom:-60,
left:-60,
}}
/>

<Box
sx={{
position:"absolute",
width:120,
height:120,
borderRadius:"50%",
background:"rgba(255,255,255,0.06)",
top:80,
right:80,
}}
/>
        </Box> 

        {/* ── Right panel ── */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "background.paper",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <Box sx={{ maxWidth: 420, width: "100%" }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome Back 👋
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 4 }}>
              Sign in to continue
            </Typography>

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />


            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{ mt: 3, borderRadius: 3, py: 1.5 }}
            >
              {loading ? (

<CircularProgress
size={22}
color="inherit"
/>

) : (
             " Sign In"
)}
            </Button>

            <Typography sx={{ textAlign: "center", mt: 4 }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#7c3aed",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}