"use client";

import type React from "react";
import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import { FirebaseError } from "firebase/app";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const { signUp } = useFirebaseAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setRegisterError("");
    setRegisterSuccess(false);

    // Basic validation
    if (!email) {
      setEmailError("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      return;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    try {
      await signUp(email, password);
      setRegisterSuccess(true);
      // Clear form
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Handle Firebase-specific errors
        switch (error.code) {
          case "auth/email-already-in-use":
            setRegisterError(
              "This email is already in use. Please try a different one."
            );
            break;
          case "auth/invalid-email":
            setRegisterError("The email address is not valid.");
            break;
          case "auth/operation-not-allowed":
            setRegisterError("Error during sign up.");
            break;
          case "auth/weak-password":
            setRegisterError("The password is too weak.");
            break;
          default:
            setRegisterError("Failed to create an account. Please try again.");
        }
      } else {
        // Handle generic errors
        setRegisterError("An unexpected error occurred. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {registerSuccess && (
          <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
            Account created successfully!
          </Alert>
        )}
        {registerError && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {registerError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Link variant="body2" href="/reset-password">
              Forgot password?
            </Link>
            <Link variant="body2" href="/login">
              {"Already have an account? Login"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
