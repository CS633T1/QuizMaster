export const useQuiz = () => {
  const [loading, setLoading] = false;
  const [error, setError] = useState<string | null>(null);

  const submitQuestion = async (question: string) => {
    setLoading(true);
    try {
      const response = await quizAPI.submitQuestion(question);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submitQuestion };
};
