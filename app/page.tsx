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
  Paper
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useQuiz } from "./hooks/useQuiz";
import { LLMResponse } from "./services/api";

export default function Home() {
  const router = useRouter();
  const { loading, error, submitQuestion } = useQuiz();
  const [inputText, setInputText] = useState("");
  const [quizData, setQuizData] = useState<LLMResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    
    try {
      console.log('Submitting text:', inputText);
      setQuizData(null);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(null);
      
      const result = await submitQuestion(inputText);
      console.log('Received result:', result);
      
      if (result?.success && result.data?.questions) {
        console.log('Setting quiz data:', result.data);
        setQuizData(result.data);
      } else {
        throw new Error(result?.message || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
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
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" gutterBottom>
        QuizMaster
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
        <Button variant="contained" onClick={() => router.push("/register")}>
          Sign Up
        </Button>
        <Button variant="outlined" onClick={() => router.push("/login")}>
          Login
        </Button>
      </Box>

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
                  value={selectedAnswers[qIndex] ?? ''}
                  onChange={(e) => handleAnswerSelect(qIndex, parseInt(e.target.value))}
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
                            ? 'success.main'
                            : selectedAnswers[qIndex] === oIndex 
                              ? 'error.main' 
                              : 'text.primary'
                          : 'text.primary'
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              {showResults && (
                <Box sx={{ mt: 2 }}>
                  <Typography color={selectedAnswers[qIndex] === question.answer - 1 ? "success.main" : "error.main"}>
                    {selectedAnswers[qIndex] === question.answer - 1 
                      ? "✓ Correct!" 
                      : `✗ Incorrect. The correct answer is: ${question.options[question.answer - 1]}`}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleCheckAnswers}
              disabled={Object.keys(selectedAnswers).length !== quizData.questions.length}
            >
              Check Answers
            </Button>
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
