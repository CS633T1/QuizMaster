import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const llmKey = process.env.OPEN_AI_KEY;

const jsonGPT = async (prompt) => {
  try {
    const openai = new OpenAI({ apiKey: llmKey });
    const instructions = `Create a list of 10 multiple choice questions based on the following text. 
    Each question should have 4 answer choices numbered 1 through 4. 
    Provide this list as a json array named "questions" in the following format:
    {
      "questions": [
        {
          "question": "Question text here",
          "options": [
            "option 1",
            "option 2",
            "option 3",
            "option 4"
          ],
          "answer": 1
        },
      ]
    }
    TEXT: `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: instructions + prompt },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result;
  } catch (error) {
    console.error(error);
    const json_error = { status: error.status, message: error.message };
    return json_error;
  }
};

export default jsonGPT;
