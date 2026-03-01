import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import serverResponse from "../lib/action/api_Response.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import removeMd from "remove-markdown";
import fs  from "fs";



const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  topP: 1,
  temperature: 0,
  maxOutputTokens: 2048,
});

const systemPrompt = new SystemMessage(`
You are an expert HR professional and career coach with 10+ years of experience reviewing CVs.
When given a CV, you must evaluate it and return your response in this exact format:

OVERALL SCORE: [X/10]

SECTION SCORES:
- Formatting & Design: [X/10]
- Work Experience: [X/10]
- Skills: [X/10]
- Education: [X/10]
- Summary/Objective: [X/10]

STRENGTHS:
- [point 1]
- [point 2]
- [point 3]

WEAKNESSES:
- [point 1]
- [point 2]
- [point 3]

SUGGESTIONS FOR IMPROVEMENT:
- [suggestion 1]
- [suggestion 2]
- [suggestion 3]

Be honest, specific, and constructive. Do not be vague.
`);

export const pdfParse = async (req, res) => {
  try {
    if (!req?.file?.path) {
      return res.status(400).json(serverResponse(400, 500, "No file uploaded"));
    }

    let pdf = await fs.promises.readFile(req.file.path, { encoding: "base64" });

    const humanPrompt = new HumanMessage([
      { type: "text", text: "Please rate this CV " },
      {
        type: "media",
        mimeType: "application/pdf",
        data: pdf,
      },
    ]);

    let llmResponse = await model.invoke([systemPrompt, humanPrompt]);

    const tunedResponse = removeMd(llmResponse.content);

    res.status(200).json(serverResponse(200, 252, tunedResponse));
  } catch (error) {
    console.error("Error processing CV:", error);
    res.status(500).json(serverResponse(500, 253, "Error processing CV"));
  } finally {
  if (req?.file?.path) {
      fs.promises.unlink(req.file.path).catch((err) => {
        console.error("Error deleting uploaded file:", err);
      });
    }
  }
};

// ! removemd use in frontend
