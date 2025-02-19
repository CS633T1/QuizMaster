"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Paper,
  Dialog,
  DialogContent,
  Snackbar,
  SnackbarProps,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useQuiz } from "./hooks/useQuiz";
import { LLMResponse } from "./services/api";
import { QuizData, getQuizData, saveQuiz } from "@/hooks/useFirebaseStore";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { SaveQuizModal } from "./components/SaveQuizModal";

export default function Home() {
  const router = useRouter();
  const { user } = useFirebaseAuth(); //if there is a user, then you are logged in
  const { loading, error, submitQuestion } = useQuiz();
  const [inputText, setInputText] = useState("");
  const [quizData, setQuizData] = useState<LLMResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState<String>("");
  const [saveQuizModalOpen, setSaveQuizModalOpen] = useState<boolean>(false);
  const [showTopicError, setShowTopicError] = useState<boolean>(false);

  //For SnackBar
  const [isSnackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");
  //For Retrieving quiz
  const [quizId, setQuizId] = useState<string>("");

  useEffect(() => {
    const fetchQuizData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const quizId_local = queryParams?.get("quizId") as string;
      setQuizId(quizId_local);
      if (quizId_local) {
        const quizData = await getQuizData(quizId_local);
        setQuizData(quizData as LLMResponse);
      }
    };

    fetchQuizData();
  }, [location]);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    try {
      console.log("Submitting text:", inputText);
      setQuizData(null);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(null);
      setShowTopicError(false);

      const result = await submitQuestion(inputText);
      console.log("Received result:", result);

      if (result?.success && result.data?.questions) {
        console.log("Setting quiz data:", result.data);
        setQuizData(result.data);
      } else if (result?.success && result.data?.["topic-error"] === "true") {
        console.log("Topic error");
        setShowTopicError(true);
      } else {
        throw new Error(result?.message || "Failed to generate quiz");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleCheckAnswers = () => {
    if (!quizData) return;

    const totalQuestions = quizData?.questions?.length || 1;
    const correctAnswers =
      quizData?.questions?.reduce((acc, question, index) => {
        return acc + (selectedAnswers[index] === question.answer - 1 ? 1 : 0);
      }, 0) || 0;

    setScore((correctAnswers / totalQuestions) * 100);
    setShowResults(true);
    console.log("Save Quiz");
  };

  const handleSaveQuiz = async () => {
    if (!quizData) return;

    console.log("HandleSaveQuiz", score);
    const data: QuizData = {
      quizTitle: quizTitle,
      userId: (user && user?.email) || "",
      questions: quizData?.questions,
      score: score, //latest score iqs saved
    };

    // If we have quizId in the url query param, then we call update, ELSE we should call normal save
    let res = await saveQuiz(data, quizId as string);
    console.log("res", res);
    // Save Quiz Succeeds
    if (res?.["id"]) {
      setSaveQuizModalOpen(false);
      setSnackBarMsg(`Successfully saved as ID: ${res?.id}`);
      setSnackBarOpen(true);
      user && router.push("/user/past-quizzes");
    } else {
      setSnackBarMsg("Something went wrong with saving");
      setSnackBarOpen(true);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" gutterBottom sx={{ pt: 2 }}>
        Generate Quiz with LLM
      </Typography>

      <SaveQuizModal
        isOpen={saveQuizModalOpen}
        handleSetText={setQuizTitle}
        handleOnSubmit={handleSaveQuiz}
      />

      <Snackbar
        open={isSnackBarOpen}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        message={snackBarMsg}
      />

      <Box sx={{ mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          label="Paste your text here to generate quiz questions"
          variant="outlined"
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !inputText.trim()}
        >
          {loading ? <CircularProgress size={24} /> : "Generate Quiz"}
        </Button>

        {showTopicError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Topic Error: Context must be related to one of the following
            software topics: Globalization, Requirements, Software Engineering
            Management, Software Configuration Management, Estimation, Agile,
            Peer Reviews, Security, Design, Software Tools, System Test, Unit
            Tests, Continuous Delivery, Process Architecture, or Process
            Improvement.
          </Alert>
        )}
      </Box>
      {quizData && quizData.questions && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Quiz Questions
          </Typography>

          {quizData.questions.map((question, qIndex) => (
            <Paper key={qIndex} sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {qIndex + 1}. {question.question}
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedAnswers[qIndex] ?? ""}
                  onChange={(e) =>
                    handleAnswerSelect(qIndex, parseInt(e.target.value))
                  }
                >
                  {question.options.map((option, oIndex) => (
                    <FormControlLabel
                      key={oIndex}
                      value={oIndex}
                      control={<Radio />}
                      label={option}
                      sx={{
                        color: showResults
                          ? oIndex === question.answer - 1
                            ? "success.main"
                            : selectedAnswers[qIndex] === oIndex
                            ? "error.main"
                            : "text.primary"
                          : "text.primary",
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {showResults && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    color={
                      selectedAnswers[qIndex] === question.answer - 1
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {selectedAnswers[qIndex] === question.answer - 1
                      ? "✓ Correct!"
                      : `✗ Incorrect. The correct answer is: ${
                          question.options[question.answer - 1]
                        }`}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))}

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleCheckAnswers}
              disabled={
                Object.keys(selectedAnswers).length !==
                quizData.questions.length
              }
            >
              Check Answers
            </Button>

            {user && (
              <Button
                variant="contained"
                onClick={() => setSaveQuizModalOpen(true)}
                disabled={score == null}
              >
                Save Quiz
              </Button>
            )}
            {score !== null && (
              <Typography variant="h6" sx={{ ml: 2 }}>
                Score: {score.toFixed(1)}%
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}
