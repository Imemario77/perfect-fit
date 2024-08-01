import { NextResponse } from "next/server";
import {
  accessoryMatcherFunctionDeclaration,
  bottomsMatcherFunctionDeclaration,
  dressesMatcherFunctionDeclaration,
  footwearMatcherFunctionDeclaration,
  outerwearMatcherFunctionDeclaration,
  topsMatcherFunctionDeclaration,
  systemInstruction,
} from "../../../../lib/tools/toolsPrompt";
import { genAI } from "@/lib/gemini";
import { functions } from "@/lib/tools/toolsLibary";

export const POST = async (req, _) => {
  const { prompt, userId, weather, messages, skinTone, gender } =
    await req.json();

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      temperature: 0.4,
      systemInstruction: systemInstruction(gender, skinTone, weather, userId),
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
    console.log(messages);
    const chat = model.startChat({ history: messages });
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

  Make sure to analyze the results well before choosing an item don't choose another type of item for another item
  
  Now, create a JSON object with your final outfit recommendations, including image URLs for items found in the wardrobe and suggestions for any missing items. Ensure your response starts with \`\`\`json and ends with \`\`\` also make sure thtathe image url you are giving match with the type of item you suggest for example don't give a shoes imahge for an handbag etc.
`;

      const result2 = await chat.sendMessage(matchingPrompt);

      const jsonStartIndex = result2.response.text().indexOf("{");
      const jsonEndIndex = result2.response.text().lastIndexOf("}");

      if (
        jsonStartIndex !== -1 &&
        jsonEndIndex !== -1 &&
        jsonEndIndex > jsonStartIndex
      ) {
        const jsonSubstring = result2.response
          .text()
          .substring(jsonStartIndex, jsonEndIndex + 1);

        console.log(JSON.parse(jsonSubstring));
        return NextResponse.json({
          message: JSON.parse(jsonSubstring),
          text: result2.response
            .text()
            .replace(
              result2.response
                .text()
                .substring(jsonStartIndex - 7, jsonEndIndex + 7),
              ""
            )
            .trim(),
        });
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
