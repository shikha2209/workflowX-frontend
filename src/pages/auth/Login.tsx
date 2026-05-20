import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  Google,
} from "@mui/icons-material";

import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b,#111827)",
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
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(15px)",
        }}
      >
        {/* Left Side */}

        <Box
          sx={{
            flex: 1,
            color: "white",
            p: 8,
            display: {
              xs: "none",
              md: "flex",
            },
            flexDirection: "column",
            justifyContent: "space-between",
            background:
              "linear-gradient(135deg,#4f46e5,#7c3aed)",
          }}
        >
          <Box>
           <Typography
  variant="h3"
  sx={{
    fontWeight: 700,
    mb: 2,
  }}
>
  TaskFlow
</Typography>

            <Typography
              sx={{
                opacity: .8,
                fontSize: 18,
                maxWidth: 450,
              }}
            >
              Collaborate with your team,
              manage projects and build faster.
            </Typography>
          </Box>

<Box
  sx={{
    display: "flex",
    gap: 2,
  }}
>            {[
              {
                title: "Projects",
                value: "24"
              },
              {
                title: "Tasks",
                value: "128"
              },
              {
                title: "Members",
                value: "12"
              },
            ].map((item) => (
              <Card
                key={item.title}
                sx={{
                  flex:1,
                  p:3,
                  borderRadius:4,
                  bgcolor:"rgba(255,255,255,.1)",
                  color:"white"
                }}
              >
               <Typography
  sx={{
    fontSize: 14,
  }}
>
  {item.title}
</Typography>

                <Typography
  variant="h4"
  sx={{
    fontWeight: 700,
  }}
>
  {item.value}
</Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Right Side */}

        <Box
          sx={{
            flex: 1,
            bgcolor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
         <Box
  sx={{
    maxWidth: 420,
    width: "100%",
  }}
>
           <Typography
  variant="h4"
  sx={{
    fontWeight: 700,
    mb: 1,
  }}
>
  Welcome Back 👋
</Typography>

            <Typography
  variant="body2"
  sx={{
    color: "text.secondary",
    mb: 4,
  }}
>
  Sign in to continue
</Typography>

            <TextField
              fullWidth
              label="Email"
              margin="normal"
            />

           <TextField
  fullWidth
  label="Password"
  margin="normal"
  type={showPassword ? "text" : "password"}
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <VisibilityOff />
            ) : (
              <Visibility />
            )}
          </IconButton>
        </InputAdornment>
      ),
    },
  }}
/>
          <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 1,
  }}
>
              <FormControlLabel
                control={<Checkbox />}
                label="Remember me"
              />

              <Typography
                color="primary"
                sx={{
                  cursor:"pointer"
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt:3,
                borderRadius:3,
                py:1.5
              }}
            >
              Sign In
            </Button>

            <Button
              fullWidth
              startIcon={<Google />}
              variant="outlined"
              size="large"
              sx={{
                mt:2,
                borderRadius:3,
                py:1.5
              }}
            >
              Continue with Google
            </Button>

           <Typography
  variant="body2"
  sx={{
    textAlign: "center",
    mt: 4,
  }}
>
  Don't have an account?{ " " }
   <Link
    to="/signup"
    style={{
      color: "#7c3aed",
      textDecoration: "none",
      fontWeight: 600,
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