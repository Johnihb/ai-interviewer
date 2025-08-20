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
   "question" , "question" , "question" , ...  
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
      const prompt = `You are an interviewer evaluating a candidate.The candidate is giving you a written answer from the computer not verbally so please evaluate the answer based on the candidate's skills and experience written by him/her . If the user answer are all correct don't conjustigate to give 10 out of 10

      Candidate details:  
      - Skills: ${candidate.skill}  
      - Experience: ${candidate.experience}  
      - Number of questions: ${candidate.count}  
      - Difficulty level: ${candidate.difficulty}  
      
      Task:  
      1. You asked the candidate this question: ${question}  
      2. The candidate answered: ${answer}  
      
      Now evaluate strictly based on the candidate's skills and experience.  
      - Identify and return all mistakes in the candidate's answer   
      - Identify and return the correct points the candidate missed
      - Give a score out of 10 evaluating the correctness of the answer  
      - Suggest which section the candidate lacks in and which section they excel in
      
      CRITICAL: Return ONLY raw JSON without any markdown formatting, code blocks, or backticks.
      Do NOT wrap the response in \`\`\`json or any other formatting.
      Return the response as pure JSON that can be directly parsed.
      
      Expected format (return exactly this structure):
      {
        "marks": 0,
        "mistakes": ["mistake1", "mistake2"],
        "suggestions": ["suggestion1", "suggestion2"]
      }
      
      Important Rules:  
      - Return ONLY the JSON object, no other text
      - No markdown formatting or code blocks
      - No backticks or special characters outside the JSON
      - Be concise and specific in mistakes and suggestions
      - Do not reference "[object Object]" in responses
      `        
      const result = await model.generateContent(prompt);
      // const response = result.response.text().map(q => q.trim().replace(/^['"]|['"]$/g, ""));
      console.log(result.response.text());
      const response = result.response.text()
      const json = cleanAndParseJSON(response);
      return json;
    } catch (error) {
        console.log(error);
    }
}

function cleanAndParseJSON(response) {
  try {
    // Remove markdown code blocks and backticks
    let cleanResponse = response
      .replace(/```json\s*/g, '')  // Remove ```json
      .replace(/```\s*/g, '')      // Remove closing ```
      .replace(/`/g, '')           // Remove any remaining backticks
      .trim();                     // Remove whitespace
    
    // Find the JSON object bounds
    const jsonStart = cleanResponse.indexOf('{');
    const jsonEnd = cleanResponse.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanResponse = cleanResponse.substring(jsonStart, jsonEnd + 1);
    }
    
    // Parse and return the JSON
    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    console.error('Original response:', response);
    
    // Return a default error response
    return {
      marks: 0,
      mistakes: ["Unable to process the answer"],
      suggestions: ["Please provide a clear and valid response"]
    };
  }
}