import jsonGPT from "./jsonGPT.js";

const queryLLM = async (req, res) => {
  try {
      const prompt = req.body.prompt;
      const answer = await jsonGPT(prompt);
      res.json({ success: true, data: answer });
  } catch (error) {
      res.status(500).json({
          error: true,
          message: "Failed to process the request"
      });
  }
};

export default queryLLM;
