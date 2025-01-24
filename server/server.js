import express from "express";

const app = express();
global.APIresponse = {};

app.use(express.json());
app.use("/", express.static("dist"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
