// Types for API requests and responses
export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
}

// Quiz result interface
export interface QuizResult {
  question: string;
  answer: string;
  isCorrect: boolean;
  timestamp?: string;
}

// User statistics interface
export interface UserStatistics {
  totalQuizzes: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageScore: number;
  quizHistory: QuizResult[];
}

// LLM response interface
export interface LLMResponse {
  questions?: {
    question: string;
    options: string[];
    answer: number;
  }[];
  "topic-error"?: string;
}

// Generic response wrapper
export interface QuizResponse<T = LLMResponse> {
  success: boolean;
  data: T;
  message?: string;
}
const dev = process.env.NODE_ENV !== "production";
// API Base URL
const API_BASE_URL = dev
  ? "http://localhost:3000"
  : process.env.NEXT_PUBLIC_API_URL;

// Helper function for API calls
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// Quiz API calls
export const quizAPI = {
  // Submit a question to LLM
  submitQuestion: async (
    question: string
  ): Promise<QuizResponse<LLMResponse>> => {
    return fetchAPI<QuizResponse<LLMResponse>>("/api/query", {
      method: "POST",
      body: JSON.stringify({ prompt: question }),
    });
  },

  // Get quiz history
  getQuizHistory: async (): Promise<QuizResponse<QuizResult[]>> => {
    return fetchAPI<QuizResponse<QuizResult[]>>("/api/quiz/history", {
      method: "GET",
    });
  },

  // Save quiz result
  saveQuizResult: async (
    result: QuizResult
  ): Promise<QuizResponse<QuizResult>> => {
    return fetchAPI<QuizResponse<QuizResult>>("/api/quiz/save", {
      method: "POST",
      body: JSON.stringify(result),
    });
  },
};

// User API calls
export const userAPI = {
  // Get user profile
  getProfile: async (): Promise<QuizResponse<UserResponse>> => {
    return fetchAPI<QuizResponse<UserResponse>>("/api/user/profile", {
      method: "GET",
    });
  },

  // Update user profile
  updateProfile: async (
    data: Partial<UserResponse>
  ): Promise<QuizResponse<UserResponse>> => {
    return fetchAPI<QuizResponse<UserResponse>>("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Get user statistics
  getStatistics: async (): Promise<QuizResponse<UserStatistics>> => {
    return fetchAPI<QuizResponse<UserStatistics>>("/api/user/statistics", {
      method: "GET",
    });
  },
};

// Authentication API calls (in addition to Firebase)
export const authAPI = {
  // Verify email
  verifyEmail: async (
    token: string
  ): Promise<QuizResponse<{ verified: boolean }>> => {
    return fetchAPI<QuizResponse<{ verified: boolean }>>(
      "/api/auth/verify-email",
      {
        method: "POST",
        body: JSON.stringify({ token }),
      }
    );
  },

  // Request password reset
  requestPasswordReset: async (
    email: string
  ): Promise<QuizResponse<{ sent: boolean }>> => {
    return fetchAPI<QuizResponse<{ sent: boolean }>>(
      "/api/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  },
};
