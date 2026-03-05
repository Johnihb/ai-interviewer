import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import serverResponse from "../../lib/action/api_Response.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import removeMd from "remove-markdown";
import fs from "fs";
import { createWorker } from "tesseract.js";
import InterviewSession from "../../models/interviewSession.model.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  topP: 1,
  temperature: 0.7,
});

const systemPrompt = new SystemMessage(`
You are an expert HR professional and career coach with 10+ years of experience reviewing CVs.
After evaluating the CV, you give the painful but brutal truth about the candidate's CV, highlighting both strengths and weaknesses, and providing actionable suggestions for improvement. 
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

export const evaluateCV = async (req, res) => {
  try {
    if (!req?.file?.path) {
      return res.status(400).json(serverResponse(400, 500, "No file uploaded"));
    }

    if (req.body.role.length > 20)
      return res.status(400).json(serverResponse(400, 501));

    let pdf = await fs.promises.readFile(req.file.path, { encoding: "base64" });

    const humanPrompt = new HumanMessage([
      {
        type: "text",
        text: `Please rate this CV for a ${req.body.role} role: `,
      },
      {
        type: "media",
        mimeType: "application/pdf",
        data: pdf,
      },
    ]);

    let llmResponse = await model.invoke([systemPrompt, humanPrompt]);

    const tunedResponse = removeMd(llmResponse.content);

    const updatedSession = await InterviewSession.findOneAndUpdate(
      { userId: req.user._id, status: "pending", cvStatus: "pending" },
      { cvStatus: "reviewed", cvResult: tunedResponse },
    );

    if (!updatedSession) {
      return res.status(404).json(serverResponse(404, 1));
    }

    res.status(200).json(serverResponse(200, 252, tunedResponse));
  } catch (error) {
    console.error("Error processing CV:", error);
    res.status(500).json(serverResponse(500, 500));
  } finally {
    if (req?.file?.path) {
      fs.promises.unlink(req.file.path).catch((err) => {
        console.error("Error deleting uploaded file:", err);
      });
    }
  }
};

export const generateQuestions = async (req, res) => {
  try {
    if (!req.file?.path && !req?.body) {
      return res
        .status(400)
        .json(serverResponse(400, 400, "No file or data uploaded"));
    }

    const doesQuestionExist = await InterviewSession.findOne({
      userId: req.user._id,
      status: "pending",
    });

    if (doesQuestionExist) {
      return res
        .status(400)
        .json(
          serverResponse(
            400,
            400,
            "A pending interview question already exists for this user",
          ),
        );
    }

    let imageData = null;
    let reqData = null;

    if (req.file?.path) {
      const worker = await createWorker("eng");
      const ret = await worker.recognize(req.file.path);
      imageData = ret.data.text?.trim();
      await worker.terminate();

      if (!imageData) {
        return res
          .status(400)
          .json(serverResponse(400, 400, "Could not extract text from image"));
      }
    } else if (req?.body) {
      reqData = req?.body;
      if (!reqData) {
        return res.status(400).json(serverResponse(400, 401));
      }
    }

    const numberOfQuestions = 10;

    const role = req.body.role || "Software Engineer";

    const questionSystemPrompt = new SystemMessage(`
  You are an expert technical interviewer and career coach.

Generate exactly ${numberOfQuestions} interview questions for a candidate applying for the ${role} role .


TOPICS:
  If the canditate role is related to computer science, then the topics are:    
    - Logical
    - Technical
    - D.S.A.
    - System Design
    - Object Oriented Programming
    - Best Practices 
    - Code Quality
    - Testing
    - Performance
    - Security
    - Scalability

  If the candidate role is related to business or management, then the topics are:
    - Communication
    - Leadership
    - Culture Fit

  If the candidate role is related to sales or marketing, then the topics are:
    - Sales
    - Marketing

  If the candidate role is related to customer service or support, then the topics are:
    - Customer Service
    - Support

  Therefore Above are just some of the example role and the topics that can be asked.If the role is not listed in the above then the topics can be anything that is related to the role , you don't need to show any mercy to the candidate while generating the questions. 

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
 "role": Candidate's applied job role,    
  "questions": [
    { "id": 1, "type": "logical", "question": "..." },
    { "id": 2, "type": "technical",  "question": "..." }
  ]
}
`);

    const llmResponse = await model.invoke([
      questionSystemPrompt,
      new HumanMessage("Can you please.Generate the questions now."),
    ]);
    const parsedData = llmResponse.content.replace(/```json|```/gi, "").trim();
    const parsed = JSON.parse(parsedData);

    const questionSession = await InterviewSession.create({
      userId: req.user._id,
      role,
      questions: parsed.questions,
    });
    return res.status(200).json(
      serverResponse(200, 254, {
        sessionId: questionSession._id,
        questions: questionSession.questions,
        role: questionSession.role,
      }),
    );
  } catch (error) {
    console.error("Error creating question session:", error);
    return res.status(500).json(serverResponse(500, 500));
  } finally {
    if (req?.file?.path && fs.existsSync(req.file.path)) {
      fs.promises.unlink(req.file.path).catch((err) => {
        console.error("Error deleting uploaded file:", err);
      });
    }
  }
};

export const evaluateAnswer = async (req, res) => {
  try {
    const { data } = req.body;
    const userId = req.user._id;

    if (!data) {
      return res
        .status(400)
        .json(serverResponse(400, 400, "No answer data provided"));
    }

    const interviewQuestion = await InterviewSession.findOne({
      userId,
      status: "pending",
      qaStatus: "pending",
    });
    if (!interviewQuestion) {
      return res
        .status(404)
        .json(serverResponse(404, 404, "No pending interview session found"));
    }

    const qa = (interviewQuestion.questions || [])
      .map((question) => {
        const answerObj = data.find((answer) => answer.id === question.id);
        const answerText = answerObj?.answer ?? "[No answer provided]";
        return `Q${question.id} [${question.type}]: ${question.question}\nAnswer: ${answerText}`;
      })
      .join("\n\n---\n\n");

    const EvaluationSystemPrompt = new SystemMessage(`
You are a strict but fair senior interviewer evaluating answers for a ${interviewQuestion?.role || "Software Engineer"} role.

SCORING GUIDE:
- 9–10 → Exceptional
- 7–8  → Good, minor gaps
- 5–6  → Average, lacks depth
- 3–4  → Weak
- 1–2  → Poor or irrelevant

OUTPUT FORMAT (strict JSON, no markdown):
{
  "results": [
    {
      "questionId": 1,
      "score": 7,
      "what_was_good": "...",
      "what_was_missing": "...",
      "tip": "One short actionable tip."
    }
  ],
  "overall": {
    "score": 6.5,
    "summary": "2-3 sentence summary.",
    "top_strength": "...",
    "top_weakness": "...",
    "recommendation": "Hire | Maybe | No Hire"
  }
}
    `);

    const llmResponse = await model.invoke([
      EvaluationSystemPrompt,
      new HumanMessage(`Evaluate these answers:\n\n${qa}`),
    ]);
    const rawContent = llmResponse.content;
    const cleanedResponse = rawContent.replace(/```json\s*|```/gi, "").trim();
    let evaluation;
    try {
      evaluation = JSON.parse(cleanedResponse);
    } catch (err) {
      console.error("Error parsing evaluation response:", err);
      return res
        .status(500)
        .json(serverResponse(500, 500, "Invalid response from AI"));
    }

    await InterviewSession.findOneAndUpdate(
      {
        userId,
        status: "pending",
        qaStatus: "pending",
      },
      {
        qaStatus: "evaluated",
        qaResult: cleanedResponse,
      },
    );
    res.status(200).json(serverResponse(200, 255, evaluation));
  } catch (error) {
    console.error("Error evaluating answer:", error);
    res.status(500).json(serverResponse(500, 500));
  }
};
