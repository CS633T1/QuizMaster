// app/services/api.ts
export const quizAPI = {
  submitQuestion: async (
    question: string
  ): Promise<QuizResponse<LLMResponse>> => {
    return fetchAPI<QuizResponse<LLMResponse>>("/query", {
      method: "POST",
      body: JSON.stringify({ prompt: question }),
    });
  },
};

// Type definitions
export interface LLMResponse {
  questions: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

export interface QuizResponse<T = LLMResponse> {
  success: boolean;
  data: T;
  message?: string;
}

// API calls
export const quizAPI = {
  submitQuestion: async (question: string) => {
    // API call implementation
  },
};
