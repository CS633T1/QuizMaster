import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const llmKey = process.env.OPEN_AI_KEY;

const jsonGPT = async (prompt) => {
  try {
    const openai = new OpenAI({ apiKey: llmKey });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo-0125",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result;
  } catch (error) {
    console.error(error);
    let json_error = { status: error.status, message: error.message };
    return json_error;
  }
};

export default jsonGPT;
