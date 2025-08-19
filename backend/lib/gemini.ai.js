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

    const prompt = `Generate exactly ${count} interview questions for a candidate with these skills: ${skills} and experience: ${experience}.

Return the questions in this exact format:
"question 1" , "question 2" , "question 3" ,......
when you return the questions it is not recommended to use any symbol or special character in the questions. 


Make sure to generate exactly ${count} questions.
Make sure the questions are relevant to the candidate's skills and experience level.
You are encourage to use number in the questions.
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
      const prompt = ` Suppose you are a interviewer and you were interviewing a candidate with these skills : ${candidate.skill} and experience : ${candidate.experience} and with the number of questions : ${candidate.count} and difficulty : ${candidate.difficulty}. 
      -You asked the candidate this question : ${question} and the candidate answered : ${answer}. 
      -Now you have to check if the answer is correct or not according to the skills and experience of the candidate. 
      -Return the mistakes of the candidate in this format : 
      -"mistake 1" , "mistake 2" , "mistake 3" ,......  
      -Return the correct answer of the candidate that he missed in this format : 
      -"correct answer 1" , "correct answer 2" , "correct answer 3" ,......    
      -And return the mask of the candidate out of 10 
      -Atlast suggest him in which section he lacks and which section he excels and needs to focus more on which section/part
      -You are prohibited to return any symbol or special character in the answer
      -all together return in this format i.e in the format of array and the mistake , correct and suggestion inside curly braces like
      -[mask ,{ mistakes1, mistake2 , mistake3 ,...} , {correct answer 1 , correct answer 2 , correct answer 3 ,...} , {suggestion 1 , suggestion 2 , suggestion 3 ,...}] 
      `        
      const result = await model.generateContent(prompt);
      // const response = result.response.text().map(q => q.trim().replace(/^['"]|['"]$/g, ""));
      console.log(result.response.text());
      return result.response.text();
    } catch (error) {
        console.log(error);
    }
}
