import { GoogleAIFileManager } from "@google/generative-ai/server";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { db } from "@/firebase/admin/config";

export const POST = async (req, res) => {
  try {
    const { img, userRef } = await req.json();
    // get the file from the storage and save it to your server for a short while
    const fileUrl = img;
    const fileName = "User Profile.png";
    const localFilePath = path.resolve(__dirname, fileName);
    // Download the file from the URL
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();

    // Save the file locally
    fs.writeFileSync(localFilePath, buffer);

    // Initialize GoogleAIFileManager with your API_KEY.
    const fileManager = new GoogleAIFileManager(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );

    // Upload the file and specify a display name.
    const uploadResult = await fileManager.uploadFile(localFilePath, {
      mimeType: "image/png",
      displayName: "Clothing Item",
    });

    // View the response.
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
    );

    const model = genAI.getGenerativeModel({
      // The Gemini 1.5 models are versatile and work with multimodal prompts
      model: "gemini-1.5-flash",
    });

    // Generate content using text and the URI reference for the uploaded file.
    let result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      {
        text: `
    Prompt for Image Analyzer

    Objective: Analyze an image to detect and describe the skin tone of a person.

    Instructions:

    1. Detect Skin:
    Analyze the image to determine if skin is present and clearly visible.
    If no skin is detected, output a JSON response indicating this.

    2. Analyze Skin Tone:
    If skin is detected, classify the predominant skin tone into categories: fair, light, medium, olive, tan, deep, or dark.
    Determine the undertones, classifying them as warm, cool, or neutral.
    
    3. Output Requirements:
    Return a JSON object containing only this item:
       . skinDetected: A boolean value indicating whether skin was detected in the image.
       . skinToneDescription: A string describing the detected skin tone and undertone (or a message if no skin is detected).

    Example Output:
    If skin is detected:

    {
    "skinDetected": true,
    "skinToneDescription": "information about the type of skin"
    }

    If no skin is detected:
    {
    "skinDetected": false,
    "skinToneDescription": "No skin detected in the image"
    }
`,
      },
    ]);

    fs.unlinkSync(localFilePath);
    fileManager.deleteFile(uploadResult.file.name);
    console.log(result.response.text());
    result = JSON.parse(result.response.text());

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "an error occured",
      status: 500,
    });
  }
};
