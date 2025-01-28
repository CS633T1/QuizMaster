import jsonGPT from "./jsonGPT.js";

const queryLLM = async (req, res) => {
  const prompt = req.body.prompt;
  const answer = await jsonGPT(prompt);
  res.send(answer);
};

export default queryLLM;
