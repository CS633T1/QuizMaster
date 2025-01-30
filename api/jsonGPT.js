import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const llmKey = process.env.OPEN_AI_KEY;


const jsonGPT = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(instructions);
  const response = await result.response;
  return JSON.parse(response.text());
};

// Purpose: Generate quiz questions from input text
// Request Body:
  json
  {
    "prompt": "Text to generate questions from"
  }
  
// Response:
  json
  {
    "success": true,
    "data": {
      "questions": [
        {
          "question": "Question text",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "answer": 1
        }
      ]
    }
  }
  
export default jsonGPT;
