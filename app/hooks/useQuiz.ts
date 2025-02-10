import { useState } from "react";
import {
  quizAPI,
  QuizResponse,
  LLMResponse,
  QuizResult,
} from "../services/api";

export const useQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([]);

  const submitQuestion = async (
    question: string
  ): Promise<QuizResponse<LLMResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await quizAPI.submitQuestion(question);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to process request");
      }
      console.log("llm response", response);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Quiz submission error:", errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getHistory = async (): Promise<QuizResponse<QuizResult[]> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await quizAPI.getQuizHistory();
      setQuizHistory(response.data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async (
    question: string,
    answer: string,
    isCorrect: boolean
  ): Promise<QuizResponse<QuizResult> | null> => {
    setLoading(true);
    setError(null);
    try {
      const result: QuizResult = {
        question,
        answer,
        isCorrect,
        timestamp: new Date().toISOString(),
      };
      const response = await quizAPI.saveQuizResult(result);
      // Update local quiz history
      setQuizHistory((prev) => [...prev, result]);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    quizHistory,
    submitQuestion,
    getHistory,
    saveResult,
  };
};
