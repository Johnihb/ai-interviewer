import {getQuestionsArray} from "../lib/gemini.ai.js";

export const getGemini = async (req, res) => {
    try {
    const {skills , experience , count} = req.query;
    const question =await getQuestionsArray(skills , experience , count);
     res.status(200).json({
        success: true,
        message: "Questions generated successfully",
        question,
     })   
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in generating questions",
            error: error.message,
        })
    }
};

export const postGemini = (req, res) => {
    res.send("Hello from Gemini Controller");
};
