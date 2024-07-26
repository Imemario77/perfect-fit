import { NextResponse } from "next/server";
import {
  accessoryMatcherFunctionDeclaration,
  bottomsMatcherFunctionDeclaration,
  dressesMatcherFunctionDeclaration,
  footwearMatcherFunctionDeclaration,
  outerwearMatcherFunctionDeclaration,
  topsMatcherFunctionDeclaration,
} from "../../../../lib/tools/toolsPrompt";
import { genAI } from "@/lib/gemini";
import { functions } from "@/lib/tools/toolsLibary";
import axios from "axios";

export const POST = async (req, _) => {
  const { prompt, userId, weather } = await req.json();

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      temperature: 0.4,
      systemInstruction: `
Your task is to act as the user's personal stylist, selecting outfits from their virtual wardrobe that are appropriate for their events or daily life.

gender: male

Instructions:
1. Analyze and Categorize: Thoroughly analyze the user's prompt. Identify keywords related to the occasion (e.g., "date," "formal," "casual"), desired style ("stylish," "comfortable"), or specific items (dresses, tops, bottomwear, outerwear, footwear, accessories).

2. Determine Clothing Categories: Based on the occasion and keywords, determine the necessary clothing categories for the outfit. Prioritize essential items first (e.g., dresses, tops, and bottomwear before accessories, outerwear etc).

3. Call Tools: You MUST call the appropriate tools to fetch clothing items before providing any output. Use these tools:
   - accessoryMatcher
   - bottomsMatcher
   - dressesMatcher
   - footwearMatcher
   - outerwearMatcher
   - topsMatcher

   For each tool call, use these parameters:
   - "userId": Always ${userId}
   - "Description": Include keywords and descriptions from the prompt to refine the item selection. Be descriptive and creative! (e.g., "nice stylish jeans for a date night", "a clean pair of suit trousers with a lot of vibrance")

4. Evaluate and Select: Review the returned options from each function call. Select the items that best fit the overall occasion, desired style, and complement each other.

5. Consider Weather: The current weather is: ${weather}. Factor this into your selections.

6. Provide Output: After calling the necessary tools and evaluating the results, create a JSON object with image URLs for the selected clothing items. Follow this format:

   {
       "top": "example url",
       "bottom": "example url",
       "accessory": {
           "watch": "example url",
           "glasses": "example url"
       },
       "footwear": "example url"
   }

7. If no suitable items are found:
   a. For items found but not suitable, include them in the JSON with a note explaining why.
   b. For categories where no items were found, suggest appropriate items in the JSON.
   c. Always return a JSON object, even if all fields contain suggestions rather than actual wardrobe items.

Example when no suitable items are found:
{
    "top": "No suitable top found. I suggest a crisp white dress shirt for a formal occasion.",
    "bottom": "No suitable bottom found. Consider dark navy dress trousers to pair with the suggested shirt.",
    "accessory": {
        "tie": "A silk tie in a deep red would complement the suggested outfit nicely.",
        "watch": "A sleek, minimalist watch would add a touch of sophistication."
    },
    "footwear": "No suitable footwear found. Black leather oxford shoes would be ideal for this formal look."
}

Remember, you MUST call the appropriate tools before providing any output or suggestions.
`,
      tools: {
        functionDeclarations: [
          accessoryMatcherFunctionDeclaration,
          bottomsMatcherFunctionDeclaration,
          dressesMatcherFunctionDeclaration,
          footwearMatcherFunctionDeclaration,
          outerwearMatcherFunctionDeclaration,
          topsMatcherFunctionDeclaration,
        ],
      },
    });
    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);

    // For simplicity, this uses the first function call found.
    const call = result.response.functionCalls();
    if (call) {
      const aiResponseList = [];

      for (let index = 0; index < call.length; index++) {
        const call = result.response.functionCalls()[index];
        const apiResponse = await functions[call.name](call.args);
        aiResponseList.push({
          functionResponse: {
            name: call.name,
            response: apiResponse,
          },
        });
      }

      console.log(aiResponseList);

      const matchingPrompt = `
  Based on the user's request: "${prompt}"
  And considering the current weather: ${weather}
  
  You MUST have called the necessary tools to fetch clothing items. 
  Here are the results from those tool calls: ${JSON.stringify(aiResponseList)}
  
  Now, create a JSON object with your final outfit recommendations, including image URLs for items found in the wardrobe and suggestions for any missing items. Ensure your response starts with \`\`\`json and ends with \`\`\`.
`;

      const result2 = await chat.sendMessage(matchingPrompt);

      console.log(matchingPrompt);
      console.log(result2.response.text());
      if (result2.response.text().startsWith("```json")) {
        let finalRes = result2.response.text().replace("```json", "");
        finalRes = finalRes.replace("```", "");
        return NextResponse.json({ message: JSON.parse(finalRes) });
      } else {
        return NextResponse.json({ message: result2.response.text() });
      }
    } else {
      return NextResponse.json({ message: result.response.text() });
    }
  } catch (error) {
    console.error("Error in API route:", error);

    // Determine the appropriate status code and error message
    let status = 500; // Default to Internal Server Error
    let message = "An internal server error occurred";
    if (error.name === "AbortError") {
      status = 408; // Request Timeout (if the error is due to a timeout)
      message = "The request timed out";
    } else if (error.response) {
      status = error.response.status; // Use the status from the API error response
      message =
        error.response.data.message || "An error occurred while fetching data";
    }

    return NextResponse.json({ message }, { status });
  }
};
