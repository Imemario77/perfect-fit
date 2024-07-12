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

export const POST = async (req, _) => {
  const { prompt } = await req.json();

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
      Your task is to act as Mario's personal stylist, selecting outfits from his virtual wardrobe that are appropriate for his events or daily life.

      Instructions:
      1. Analyze and Categorize: Thoroughly analyze the user's prompt. Identify keywords related to the occasion (e.g., "date," "formal," "casual"), desired style ("stylish," "comfortable"), or specific items (top, bottomwear, dresses, outerwear, footwear, accessories). 
      2. Determine Clothing Categories: Based on the occasion and keywords, determine the necessary clothing categories for the outfit.  Prioritize essential items first (e.g., top and bottomwear before accessories, etc).
      3. Call tools that you feel are needed to get the clothin items:
      * Pass relevant arguments:
      * "userId": Always "Mario"
      * "category" should be one of these  (top, bottom, dresses, outerwear, footwear, accessories)
      * "Description" properties: Include keywords and descriptions from the prompt to refine the item selection. Be descriptive, and creative! (e.g., "nice stylish jeans for a date night", "a clean pair of suit trouser with a lot of vibrance")
      4. Evaluate and Select: Review the returned options from each function call. Select the items that best fit the overall occasion, desired style, and complement each other. 
      6. The current weather is Sunny
      5. Provide Output: Create a JSON object with image URLs for the selected clothing items. Follow this format:

        json
        {
            "top": "example url",
            "accessory": {
                "watch": "example url",
                "glasses": "example url"
            },
            "footwear": "example url"
        }
    
        example 

        user: i am going to the gym

        ai: call the topsMatcher, bottomsMatcher, footwearMatcher, accesoryMatcher, outerwearMatcher
        ai now responds to the user base on what it got from the functions 
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
      console.log(call.args);
      const apiResponse = await functions[call.name](call.args);
      aiResponseList.push({
        functionResponse: {
          name: call.name,
          response: apiResponse,
        },
      });
    }
    const result2 = await chat.sendMessage(JSON.stringify(aiResponseList));

    // Log the text response.
    let finalRes = result2.response.text().replace("```json", "");
    finalRes = finalRes.replace("```", "");
    return NextResponse.json({ message: JSON.parse(finalRes) });
  } else {
    return NextResponse.json({ message: result.response.text() });
  }
};
