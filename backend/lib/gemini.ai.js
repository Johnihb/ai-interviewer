import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 1,
    maxOutputTokens: 1000,
    topP: 0.8, // focused choice
    topK: 40, // limited variation (must be a single integer, not a range)
  }
});


// Alternative: Function that returns questions as an array
export async function getQuestionsArray(skills, experience, count) {
  try {

    const prompt = `Generate exactly ${count} interview questions for a candidate with the following details  
- Skills: ${skills}  
- Experience: ${experience}  

Rules:  
1. Return the questions only in this format:  
   "question 1" , "question 2" , "question 3" , ...  
2. Do not use any symbol or special character in the questions except numbers and alphabets  
3. Each question must be relevant to the candidate skills and experience  
4. Make sure the number of questions generated is exactly equal to ${count}  
5. You are encouraged to include numbers in the questions for clarity  


`;

    const result = await model.generateContent(prompt);
    const response = result.response.text()
    // Parse the response into an array
    console.log(response);
    
    return  response
    
  } catch (error) {
    console.error("Error generating questions array:", error);
    throw error;
  }
}
/*
// Example usage of the array function
async function testArrayFunction() {
  console.log("\n" + "=" .repeat(50));
  console.log("🔧 Testing Array Function");
  console.log("=" .repeat(50));
  
  const result = await getQuestionsArray(
    "Python, Django, PostgreSQL", 
    "2 years Backend Developer", 
    3
  );
  
  console.log("Raw Response:");
  console.log(result.raw);
  console.log("\nParsed Array:");
  
  console.log(`\nTotal Questions Generated: ${result.count}`);
}

// Run the generators
await testArrayFunction();
*/

export const checkAnswer = async (question , answer , candidate) => {
    try {
      const prompt = ` You are an interviewer evaluating a candidate.  

Candidate details:  
- Skills: ${candidate.skill}  
- Experience: ${candidate.experience}  
- Number of questions: ${candidate.count}  
- Difficulty level: ${candidate.difficulty}  

Task:  
1. You asked the candidate this question: ${question}  
2. The candidate answered: ${answer}  

Now evaluate strictly based on the candidate's skills and experience.  
- Identify and return all mistakes in the candidate's answer in this format:  
  [ mistake1, mistake2, mistake3]   
- Identify and return the correct points the candidate missed in this format:  
  [ correct answer1, correct answer2, correct answer3 ]  
- Give a mask score out of 10 evaluating the correctness of the answer.  
- Suggest which section the candidate lacks in and which section they excel in. Also, suggest what part they need to focus more on. Return suggestions in this format:  
  [] suggestion1, suggestion2, suggestion3 ]  

Important Rules:  
- Do not return any symbols or special characters other than braces and commas.  
- The final response must always be in this exact array format:  
  [mask , [mistakes...] , [correct answers...] , [suggestions...]]  
- Be concise and to the point. No extra jargons .Explain mistakes and correct answers in detail.
- Dont use "The candidate provided '[object Object]' as an answer" .


      `        
      const result = await model.generateContent(prompt);
      // const response = result.response.text().map(q => q.trim().replace(/^['"]|['"]$/g, ""));
      console.log(result.response.text());
      return result.response.text();
    } catch (error) {
        console.log(error);
    }
}
