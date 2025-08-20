import {checkAnswer, getQuestionsArray} from "../lib/gemini.ai.js";

export const getGemini = async (req, res) => {
    console.log("the gemini request has arrive here")
    console.log(req.body)
    try {
        const {skills , experience , count , difficulty} = req.body;
        // const question =await getQuestionsArray(skills , experience , count , difficulty);
        const question = ["Explain the difference between class components and functional components in React" , 
"How does the virtual dom improve performance in React" , 
"Write 3 steps involved in setting up a Node server" , 
"How would you design a SQL query to fetch the top 5 highest paid employees" , 
"Describe 2 challenges you faced in 2 years of working with React and how you solved them"]

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
        // const result = await checkAnswer(question , answer , candidate);
       const result = [ 
        6,  
        [ 
          "Did not explain how closures capture variables from lexical scope",  
          "Incorrectly said closures are only used for event handlers",  
          "Failed to mention memory management advantages of closures"   
        ],  
        [ 
          "Closures allow functions to access variables from their outer scope even after the outer function has returned",  
          "Closures are commonly used for data privacy and encapsulation",  
          "Closures help in creating function factories and callback patterns"  
        ],  
        [ 
          "Candidate lacks in deep JavaScript concepts especially closures",  
          "Candidate is good at giving real world usage but lacks technical explanation",  
          "Candidate should focus more on internal working of JavaScript functions and scope handling"  
        ]  
      ]
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
