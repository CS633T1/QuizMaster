import jsonGPT from "./jsonGPT.js";

const queryLLM = async (req, res) => {
  try {
    const instructions = `Create a list of 10 multiple choice questions based on the provided text. 
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
    PROVIDED TEXT: `;
    const prompt = instructions + req.body.prompt;
    const answer = await jsonGPT(prompt);
    res.json({ success: true, data: answer });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Failed to process the request",
    });
  }
};

export default queryLLM;
