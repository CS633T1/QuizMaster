"use client";

import React, { useEffect } from "react";
import { Container, Typography, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "../../../hooks/useFirebaseAuth";

export default function UserDashboard() {
  const { user, loading, logOut } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5" sx={{ mt: 4, mb: 2 }}>
        User Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        You are logged in as: {user.email}
      </Typography>
      <Button variant="contained" onClick={handleLogout}>
        Log Out
      </Button>
    </Container>
  );
}
