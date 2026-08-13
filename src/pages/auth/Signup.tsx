import {useState} from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import {signupUser} from "../../services/authApi"; 
import {
useNavigate
}
from "react-router-dom";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/Authlayout";

export default function Signup() {
  const navigate=
useNavigate();
const [userName,setUserName] =
useState("");

const [email,setEmail] =
useState("");

const [password,setPassword] =
useState("");



const [role,setRole] =
useState<
"admin"|"user"
>("user");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

const handleSignup =
async()=>{

if(
!emailRegex.test(email)
){

alert(
"Enter valid email address"
);

return;

}

if(
!passwordRegex.test(password)
){

alert(

"Password must contain minimum 8 characters, uppercase, lowercase, number and special character"

);

return;

}

try{

await signupUser({

name:userName,

email,

password,

role

});

navigate(
"/login"
);

}
catch(error){

console.log(
error
);

}

};


  return (
    <AuthLayout>
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Create Account
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mb: 4,
          }}
        >
          Create your account
        </Typography>

        {/* <TextField
          fullWidth
          label="Full Name"
          margin="normal"
        /> */}
<TextField
fullWidth
label="Name"
margin="normal"
value={userName}
onChange={(e)=>
setUserName(
e.target.value
)
}
/>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e)=>
            setEmail(
              e.target.value
            )
          }
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
          helperText="Min 8 chars, uppercase, lowercase, number & special character" error={ password.length > 0 && !passwordRegex.test(password) }
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e)=>
            setPassword(
              e.target.value
            )
          }
        />
<TextField
  select
  fullWidth
  label="Role"
  margin="normal"
  value={role}
  onChange={(e)=>
    setRole(
      e.target.value as
      "admin"|
      "user"
    )
  }
>

  <MenuItem
  value="admin"
  >
    Admin
  </MenuItem>

  <MenuItem
  value="user"
  >
    User
  </MenuItem>

</TextField>
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt:3,
            py:1.5,
            borderRadius:3
          }}
          onClick={
            handleSignup
          }
        >
          Sign Up
        </Button>

        <Typography
          sx={{
            textAlign:"center",
            mt:3
          }}
        >
          Already have an account?

          <Link to="/login">
            Login
          </Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}