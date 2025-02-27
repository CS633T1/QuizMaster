import restrictQueryLLM from "./restrictQueryLLM.js";

const queryLLM = async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const prompt = req.body.prompt;

    if (!prompt) {
      console.error("No prompt provided");
      return res.status(400).json({
        error: true,
        message: "No prompt provided",
      });
    }

    console.log("Calling restrictQueryLLM with prompt:", prompt);
    const answer = await restrictQueryLLM(prompt);
    console.log("Received answer from restrictQueryLLM:", answer);

    if (!answer.success) {
      return res.status(500).json(answer);
    }

    return res.json({
      success: true,
      data: answer.data,
    });
  } catch (error) {
    console.error("Query Error:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Failed to process the request",
      details: error.message,
    });
  }
};

export default queryLLM;
