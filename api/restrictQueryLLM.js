import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.OPEN_AI_KEY;

if (!apiKey) {
  throw new Error("OpenAI API key is not set in environment variables");
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: apiKey,
});

const restrictQueryLLM = async (prompt) => {
  try {
    console.log("Starting OpenAI API call with prompt:", prompt);

    const instructions = `You are a quiz generator. 
        First check if the provided text is related to any of the following software topics: Globalization, Requirements, Software Engineering Management,
        Software Configuration Management, Estimation, Agile, Peer Reviews, Security, Design, Software Tools, System Test, Unit Tests,
        Continuous Delivery, Process Architecture, or Process Improvement. If it is not related to any of these topics, return an error message with a key of "topic-error" and a value of "true".
        
        If the text is related to a software topic, create a list of 10 multiple choice questions based on the provided text.
        All questions must be related to one of the software topics mentioned above. 
        Return ONLY a JSON object in the following format, without any additional text or markdown:
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
            }
          ]
        }
        
        Rules:
        1. The answer field should be a number from 1 to 4, representing the correct option's position
        2. Return ONLY the JSON object, no other text
        3. Do not use markdown formatting
        4. Ensure the JSON is valid
        
        PROVIDED TEXT: ${prompt}`;

    console.log("Sending instructions to OpenAI...");

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a quiz generator that outputs only json.",
        },
        { role: "user", content: instructions },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    // Generate content
    console.log("Received result from OpenAI");

    const response = completion.choices[0].message.content;
    console.log("Raw response text:", response);
    // Parse the JSON response
    try {
      const parsedJson = JSON.parse(response);
      console.log("Successfully parsed JSON:", parsedJson);
      return {
        success: true,
        data: parsedJson,
      };
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return {
        success: false,
        error: true,
        message: "Failed to parse response from AI service",
        details: parseError.message,
      };
    }
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return {
      success: false,
      error: true,
      message: "An error occurred while processing your request",
      details: error.message,
    };
  }
};

console.log("API Key present:", !!process.env.OPEN_AI_KEY);
export default restrictQueryLLM;
