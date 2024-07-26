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
      Your task is to act as user personal stylist, selecting outfits from their virtual wardrobe that are appropriate for their events or daily life.

      gender: male

      Instructions:
      1. Analyze and Categorize: Thoroughly analyze the user's prompt. Identify keywords related to the occasion (e.g., "date," "formal," "casual"), desired style ("stylish," "comfortable"), or specific items (dresses, tops, bottomwear, outerwear, footwear, accessories). 
      2. Determine Clothing Categories: Based on the occasion and keywords, determine the necessary clothing categories for the outfit.  Prioritize essential items first (e.g dresses, tops, and bottomwear before accessories, outerwear etc).
      3. Call tools that you feel are needed to get the clothin items:
      * Pass relevant arguments:
      * "userId": Always ${userId}
      * "Description": This feild is important properties: Include keywords and descriptions from the prompt to refine the item selection. Be descriptive, and creative! (e.g., "nice stylish jeans for a date night", "a clean pair of suit trouser with a lot of vibrance")
      4. Evaluate and Select: Review the returned options from each function call. Select the items that best fit the overall occasion, desired style, and complement each other. 
      5. The current weather is currently: ${weather}
      6. Provide Output: Create a JSON object with image URLs for the selected clothing items. Follow this format:
      please put evrything into consideration be fore telling the user anything like the weather the person's gender etc
      if it's a gown make sure it goes with the shoes, if a jean make sure it goes with the top and shoes , base on the weather you can add outercloth, it would be noce to allways add accesory 

        json
        {
            "top": "example url",
            "bottom": "example url"
            "accessory": {
                "watch": "example url",
                "glasses": "example url"
            },
            "footwear": "example url"
        }

        another json example 
         {
            "dresses": "example url",
            "outerwear": "example url"
            "accessory": {
                "watch": "example url",
                "glasses": "example url"
            },
            "footwear": "example url"
          }
      
      7. If after the full search you couldn't get any clothing item for a specfic field send a json a bit similar to this format { fieldName: "then just suggest something that would match the rest of the clothing item be like you can wear this i think it would match, also tell them why which is cause they don't have any thing in there virtual wardrobe, incssse of acessory do the same thing"} don't send exactly this personalise it base on the user's question
    
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
        const apiResponse = await functions[call.name](call.args);
        aiResponseList.push({
          functionResponse: {
            name: call.name,
            response: apiResponse,
          },
        });
      }

      console.log(aiResponseList);

      const result2 = await chat.sendMessage(JSON.stringify(aiResponseList));

      console.log(result2.response.text());
      // Log the text response.
      let finalRes = result2.response.text().replace("```json", "");
      finalRes = finalRes.replace("```", "");
      return NextResponse.json({ message: JSON.parse(finalRes) });
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
