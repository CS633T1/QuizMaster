"use client";

import type React from "react";
import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
} from "@mui/material";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import { FirebaseError } from "firebase/app";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const { resetPassword } = useFirebaseAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetError("");
    setResetSuccess(false);

    if (!email) {
      setResetError("Email is required");
      return;
    }

    try {
      await resetPassword(email);
      setResetSuccess(true);
      setEmail("");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            setResetError("No user found with this email address.");
            break;
          case "auth/invalid-email":
            setResetError("The email address is not valid.");
            break;
          default:
            setResetError(
              "Failed to send password reset email. Please try again."
            );
        }
      } else {
        setResetError("An unexpected error occurred. Please try again.");
      }
      console.error("Password reset error:", error);
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
          Reset Password
        </Typography>
        {resetSuccess && (
          <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
            Password reset email sent. Check your inbox.
          </Alert>
        )}
        {resetError && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {resetError}
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Link
          </Button>
          <Link href="/login" variant="body2">
            Back to Login
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
