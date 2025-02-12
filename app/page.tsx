"use client";

import React, { useState } from "react";
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
import { QuizData, saveQuiz } from "@/hooks/useFirebaseStore";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function Home() {
  const router = useRouter();
  const { user } = useFirebaseAuth(); //if there is a user, then you are logged in
  const { loading, error, submitQuestion } = useQuiz();
  const [inputText, setInputText] = useState("");
  const [quizData, setQuizData] = useState<LLMResponse | null>({
    questions: [
      {
        question: "Which party did Taneti Vanitha belong to initially?",
        options: [
          "Telugu Desam Party",
          "YSR Congress Party",
          "BJP",
          "Congress",
        ],
        answer: 1,
      },
      {
        question:
          "In which district was Taneti Vanitha a Member of Andhra Pradesh Legislative Assembly?",
        options: ["Vishakhapatnam", "West Godavari", "Kurnool", "Krishna"],
        answer: 2,
      },
      {
        question:
          "What post did Taneti Vanitha hold in the Government of Andhra Pradesh in 2022?",
        options: [
          "Minister of Agriculture",
          "Minister of Home Affairs",
          "Minister of Education",
          "Minister of Transport",
        ],
        answer: 2,
      },
      {
        question:
          "How many votes did she win by in the 2019 Indian general election?",
        options: ["15000", "20000", "25000", "30000"],
        answer: 3,
      },
      {
        question: "Which ministry was Vanitha appointed to in April 2022?",
        options: [
          "Women and Child Welfare",
          "Home and Disaster Management",
          "Health and Family Welfare",
          "Agriculture and Rural Development",
        ],
        answer: 2,
      },
      {
        question:
          "Who did Taneti Vanitha lose her seat to in the General Elections 2024?",
        options: [
          "Kethineni Srinivas",
          "Muppidi Venkateswara Rao",
          "Devineni Avinash",
          "Racha Venkatarao",
        ],
        answer: 2,
      },
      {
        question: "Which party did Taneti Vanitha defect to in November 2012?",
        options: ["YSR Congress Party", "BJP", "Congress", "TRS"],
        answer: 1,
      },
      {
        question:
          "What was the margin of votes by which she lost in General Elections 2024?",
        options: ["10000", "20000", "25000", "30000"],
        answer: 3,
      },
      {
        question: "Which district did Taneti Vanitha contest from in 2019?",
        options: ["Vishakhapatnam", "West Godavari", "Kurnool", "Krishna"],
        answer: 2,
      },
      {
        question:
          "In which year did Vanitha become Minister for Home and Disaster Management?",
        options: ["2020", "2021", "2022", "2023"],
        answer: 3,
      },
    ],
  });
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState<String>("");
  const [saveQuizModalOpen, setSaveQuizModalOpen] = useState<boolean>(false);

  //For SnackBar
  const [isSnackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    try {
      console.log("Submitting text:", inputText);
      setQuizData(null);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(null);

      const result = await submitQuestion(inputText);
      console.log("Received result:", result);

      if (result?.success && result.data?.questions) {
        console.log("Setting quiz data:", result.data);
        setQuizData(result.data);
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

    const totalQuestions = quizData.questions.length;
    const correctAnswers = quizData.questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.answer - 1 ? 1 : 0);
    }, 0);

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
      userScore: score, //latest score is saved
    };

    let res = await saveQuiz(data);
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

  const SaveQuizModal = (
    <Dialog open={saveQuizModalOpen}>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Enter Quiz Title
        </Typography>
        <TextField onChange={(e) => setQuizTitle(e?.target?.value)} />
        <Button variant="contained" onClick={handleSaveQuiz}>
          Save Quiz
        </Button>
      </DialogContent>
    </Dialog>
  );

  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" gutterBottom>
        Generate Quiz with LLM
      </Typography>

      {SaveQuizModal}

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
