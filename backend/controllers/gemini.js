import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import serverResponse from "../lib/action/api_Response.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import removeMd from "remove-markdown";
import fs  from "fs";
import { createWorker } from "tesseract.js";
import InterviewSession from "../models/interviewSession.model.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  topP: 1,
  temperature: 0,
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




export const vaccancyParse = async(req,res)=>{
  try {
    if(!req.file?.path && !req.body?.data){
      return res.status(400).json(serverResponse(400,400,"No file or data uploaded"));
    }


    let imageData = null;
    let reqData = null;

    if(req.file?.path){

      const worker = await createWorker("eng");
      const ret = await worker.recognize(req.file.path);
      imageData = ret.data.text?.trim();
      await worker.terminate();

      if(!imageData){
        return res.status(400).json(serverResponse(400,400,"Could not extract text from image"));
      }


    }else if(req.body?.data){
      reqData = req.body.data?.trim();
      if(!reqData){
        return res.status(400).json(serverResponse(400,400,"No data provided in body"));
      }
    }


    const numberOfQuestions = 3 ;

    const questionSystemPrompt = new SystemMessage(`
  You are an expert technical interviewer and career coach.

Generate exactly ${numberOfQuestions} interview questions for a candidate applying for the job role .

RULES:
- Personalize every question using the candidate data provided.
- Distribute types evenly: Logical, Technical .
- Difficulty progression:
    • First 20% → Warm-up
    • Middle 60% → Core competencies
    • Last 20%  → Advanced / leadership / culture-fit
- ONE question per item. No multi-part questions.
- Do NOT include answers, hints, or evaluation criteria.

JOB/ROLE DATA:
${imageData || reqData}

OUTPUT FORMAT (strict JSON, no markdown, no extra text):
{
  "questions": [
    { "id": 1, "type": "Behavioral", "question": "..." },
    { "id": 2, "type": "Technical",  "question": "..." }
  ]
}
`)

    const llmResponse = await model.invoke([questionSystemPrompt , new HumanMessage("Can you please.Generate the questions now.")]);
    const parsedData= llmResponse.content.replace(/```json|```/gi,"").trim();
    const questionSession = await InterviewSession.create({
      userId: req.user._id,
      role: req.body.role || "Software Engineer",
      questions: JSON.parse(parsedData).questions,
    });
    res.status(200).json(serverResponse(200, 254, { sessionId: questionSession._id, questions: questionSession.questions }));
  } catch (error) {
    console.error("Error creating question session:", error);
    res.status(500).json(serverResponse(500, 500, `Error creating question session ${error}`));
  }finally{
    if (req?.file?.path) {
      fs.promises.unlink(req.file.path).catch((err) => {
        console.error("Error deleting uploaded file:", err);
      });
  }
  }
}

// ! removemd use in frontend
