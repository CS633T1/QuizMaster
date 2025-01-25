import express from "express";
import queryLLM from "./routes/queryLLM.js";

const app = express();
global.APIresponse = {};

app.use(express.json());
app.use("/", express.static("dist"));
app.post("/query", queryLLM);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
