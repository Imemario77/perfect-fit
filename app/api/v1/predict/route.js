import { NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import {
  accessoryMatcherFunctionDeclaration,
  bottomsMatcherFunctionDeclaration,
  dressesMatcherFunctionDeclaration,
  footwearMatcherFunctionDeclaration,
  outerwearMatcherFunctionDeclaration,
  topsMatcherFunctionDeclaration,
  systemInstruction,
} from "@/lib/tools/toolsPrompt";
import { functions } from "@/lib/tools/toolsLibary";

export const POST = async (req, _) => {
  try {
    const { prompt, userId, weather, messages, skinTone, gender } =
      await req.json();

    // Input validation
    if (!prompt || !userId || !weather || !gender) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

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

    const chat = model.startChat({ history: messages });
    const result = await chat.sendMessage(prompt);

    const functionCalls = result.response.functionCalls();
    if (!functionCalls || functionCalls.length === 0) {
      return NextResponse.json({ message: result.response.text() });
    }

    const aiResponseList = await Promise.all(
      functionCalls.map(async (call) => {
        const apiResponse = await functions[call.name](call.args);
        return { functionResponse: { name: call.name, response: apiResponse } };
      })
    );

    const matchingPrompt = `
      Based on the user's request: "${prompt}"
      And considering the current weather: ${weather}
      Remenber that the today's date is ${new Date()}
      
      Here are the results from the tool calls: ${JSON.stringify(
        aiResponseList
      )}
      
      Create a JSON object with your final outfit recommendations, including valid image URLs for items found in the wardrobe and suggestions for any that weren't suitable or not in the wardrobe. Ensure your response starts with \`\`\`json and ends with \`\`\`.
    `;

    const result2 = await chat.sendMessage(matchingPrompt);
    const jsonMatch = result2.response.text().match(/```json\n([\s\S]*?)\n```/);

    if (jsonMatch) {
      const jsonString = jsonMatch[1];
      const parsedJson = JSON.parse(jsonString);
      const textWithoutJson = result2.response
        .text()
        .replace(/```json[\s\S]*?```/, "")
        .trim();

      return NextResponse.json({
        message: parsedJson,
        text: textWithoutJson,
      });
    } else {
      return NextResponse.json({ message: result2.response.text() });
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
};
