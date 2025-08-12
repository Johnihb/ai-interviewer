import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// Alternative: Function that returns questions as an array
export async function getQuestionsArray(skills, experience, count) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 1000,
        topP: 0.8, // focused choice
        topK: 40, // limited variation (must be a single integer, not a range)
      }
    });

    const prompt = `Generate exactly ${count} interview questions for a candidate with these skills: ${skills} and experience: ${experience}.

Return the questions in this exact format:
["question 1" , "question 2" , "question 3" ,......]
...

Make sure to generate exactly ${count} questions.
Make sure the questions are relevant to the candidate's skills and experience level.
You are encourage to use number in the questions.
You are not encourage to use any symbol or special character in the questions.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response into an array
    console.log(response);
    
    return {
      raw: response,
      array: response,
      count: response.length
    };
    
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
