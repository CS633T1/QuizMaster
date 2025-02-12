"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "../../../hooks/useFirebaseAuth";
import { getPastQuiz } from "@/hooks/useFirebaseStore";
import QuizTable from "@/app/components/QuizTable";

export default function PastQuizzes() {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    const fetchData = async () => {
      user && setData(await getPastQuiz(user));
    };
    fetchData();
  }, [user, loading, router]);

  const handleGetPastQuizzes = async () => {
    user && (await getPastQuiz(user));
  };

  if (!user) {
    return null; // This will prevent any flash of content before redirect
  }

  return (
    <Container component="main">
      <Typography component="h1" variant="h5" sx={{ mt: 4, mb: 2 }}>
        Past Quizzes
      </Typography>

      <QuizTable data={data} />
    </Container>
  );
}
