// import jsonGPT from "./jsonGPT.js";

// const queryLLM = async (req, res) => {
//   try {
//     const instructions = `Create a list of 10 multiple choice questions based on the provided text. 
//     All questions must be realted to one of the following software topics: Globalization, Requirements, Software Engineering Management,
//     Software Configuration Management, Estimation, Agile, Peer Reviews, Security, Design, Software Tools, System Test, Unit Tests,
//     Continuous Delivery, Process Architecture, or Process Improvement. If the provided text is not related to any of the topics, 
//     return an error message with a key of "topic-error" and a value of "true".

//     Each question should have 4 answer choices numbered 1 through 4. 
//     Provide this list as a json array named "questions" in the following format:
//     {
//       "questions": [
//         {
//           "question": "Question text here",
//           "options": [
//             "option 1",
//             "option 2",
//             "option 3",
//             "option 4"
//           ],
//           "answer": 1
//         },
//       ]
//     }
//     PROVIDED TEXT: `;
//     const prompt = instructions + req.body.prompt;
//     const answer = await jsonGPT(prompt);
//     res.json({ success: true, data: answer });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: true,
//       message: "Failed to process the request",
//     });
//   }
// };

// export default queryLLM;
