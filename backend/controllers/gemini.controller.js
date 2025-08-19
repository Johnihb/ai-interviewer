import {checkAnswer, getQuestionsArray} from "../lib/gemini.ai.js";

export const getGemini = async (req, res) => {
    console.log("the gemini request has arrive here")
    console.log(req.body)
    try {
        const {skills , experience , count , difficulty} = req.body;
        const question =await getQuestionsArray(skills , experience , count , difficulty);
     res.status(200).json({
        success: true,
        message: "Questions generated successfully",
        question,
     })   
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in generating questions",
            error: error.message,
        })
    }
};

export const postGemini = async (req, res) => {
   
    try {
        const {question , answer , candidate} = req.body;
        const result = await checkAnswer(question , answer , candidate);
        
        res.status(200).json({
            success: true,
            message: "Answer checked successfully",
            result,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in checking answer",
            error: error.message,
        })
    }
    
};
