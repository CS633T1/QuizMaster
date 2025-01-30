import next from "next";
import express from "express";
import queryLLM from "./api/queryLLM.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();
const port = 3000;

global.APIresponse = {};

server.use(express.json());
server.use("/", express.static("dist"));
server.post("/query", queryLLM);

// Simple endpoint to return "Hello, World!"
server.get("/api/hello", (req, res) => {
  res.send("Hello, World!");
});

// Start NextJS and server using the same port
app.prepare().then(() => {
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
