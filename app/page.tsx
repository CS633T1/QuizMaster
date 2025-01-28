"use client";

import React from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Container>
      <Typography variant="h3" align="center">
        QuizMaster
      </Typography>
      <Button variant="outlined" onClick={() => router.push("/signup")}>
        Signup
      </Button>
      <Button variant="outlined" onClick={() => router.push("/login")}>
        Login
      </Button>
      <Box>
        <TextField
          id="filled-multiline-static"
          label="Multiline"
          multiline
          rows={4}
          defaultValue="LLM Prompt"
          variant="filled"
        />
      </Box>
    </Container>
  );
}
