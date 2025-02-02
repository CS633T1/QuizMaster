"use client";

import React from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [text, setText] = React.useState("LLM Context");
  const [output, setOutput] = React.useState("");

  const handleSubmit = async () => {
    const response = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });
    const data = await response.json();
    setOutput(JSON.stringify(data.data, null, 2));
  };

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
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="filled"
          className="white-text"
          fullWidth
        />
      </Box>
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
      <Box>
        <TextField
          id="output-text"
          label="LLM Output"
          multiline
          rows={20}
          value={output}
          variant="filled"
          className="white-text"
          fullWidth
        />
      </Box>
    </Container>
  );
}
