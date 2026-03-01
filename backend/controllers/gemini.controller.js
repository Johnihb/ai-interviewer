import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import serverResponse from "../lib/action/api_Response.js";
import {checkAnswer, getQuestionsArray} from "../lib/gemini.ai.js";
import {ChatPromptTemplate} from "@langchain/core/prompts"

export const getGemini = async (req, res) => {
    try {
        const {skills , experience , count , difficulty} = req.body;
        const question =await getQuestionsArray(skills , experience , count , difficulty);
        // const question = ["Explain the difference between class components and functional components in React" , 
        // "How does the virtual dom improve performance in React" , 
        // "Write 3 steps involved in setting up a Node server" , 
        // "How would you design a SQL query to fetch the top 5 highest paid employees" , 
        // "Describe 2 challenges you faced in 2 years of working with React and how you solved them"]

     res.status(200).json(serverResponse(200 , 251 , question))   
    } catch (error) {
        console.log(error)
        res.status(500).json(serverResponse(500 , 1))
    }
};

export const postGemini = async (req, res) => {
   
    try {
        const {question , answer , candidate} = req.body;
        
        const result = await checkAnswer(question , answer , candidate);
       /*   
        const result = {
            "marks": 0,
            "mistakes": [
              "The candidate did not provide a valid answer. '[object Object]' indicates a failure to properly represent the HTML structure.",
              "The candidate failed to identify the basic structure of an HTML document.",
              "The candidate failed to list the three main required tags: `<html>`, `<head>`, and `<body>`."       
            ],
            "suggestions": [
              "The candidate lacks basic understanding of HTML structure.",
              "The candidate does not excel in any area related to HTML.",
              "The candidate needs to focus on learning the fundamental HTML tags and their roles in creating a webpage. Start with tutorials and examples of basic HTML documents."
            ]
          }
        */
        
        res.status(200).json(serverResponse(200 , 252 , result))
    } catch (error) {
        console.log(error)
        res.status(500).json(serverResponse(500 , 1))
    }
    
};


export const tried=async (req,res)=>{
  const model = new ChatGoogleGenerativeAI({
    model:'gemini-2.5-flash',
    apiKey:process.env.GEMINI_API_KEY,
    topK: 40, // limited variation (must be a single integer, not a range)
    topP:0.8, // focused choice
    temperature:0.7
  })


  const template= ChatPromptTemplate.fromChat([
    [
      'system',
      'You are a interviewer who is going to interview me on a topic of react . you gonna generate me 5 question and i am going to give the answer of those question'
    ],
    [
      'user',
      'hello sir/madam i am ready for the interview you can start the interview .'
    ]
  ])


 const chain = template.pipe(model).pipe(new StreamOutputParser())

  const response = await chain.invoke()

}
