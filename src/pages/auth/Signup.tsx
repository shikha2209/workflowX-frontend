import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/Authlayout";

export default function Signup() {
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

        <TextField
          fullWidth
          label="Full Name"
          margin="normal"
        />

        <TextField
          fullWidth
          label="Email"
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt:3,
            py:1.5,
            borderRadius:3
          }}
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