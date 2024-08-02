import { GoogleAIFileManager } from "@google/generative-ai/server";
import fetch from "node-fetch";
import { NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { db } from "@/firebase/admin/config";
import path from "path";
import os from "os";
import fs from "fs";

export const POST = async (req, res) => {
  try {
    const { img, userRef } = await req.json();
    const fileUrl = img;

    // Initialize GoogleAIFileManager with your API_KEY
    const fileManager = new GoogleAIFileManager(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );

    // Download and upload the file directly without saving locally
    const response = await fetch(fileUrl);

    const arrayBuffer = await response.arrayBuffer();

    // Create a temporary file path
    const tempFilePath = path.join(os.tmpdir(), "temp_image.png"); // Use a temporary directory

    console.log(tempFilePath);

    // Write the image data to the temporary file
    await fs.writeFileSync(tempFilePath, Buffer.from(arrayBuffer));

    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: "image/png",
      displayName: "Clothing Item",
    });

    console.log(
      `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
    );

    // Clean up the temporary file
    await fs.unlinkSync(tempFilePath);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the given clothing image and provide a structured JSON output with the following fields:
    - description: Detailed description including style, features, and suitable gender.
    - category: One of [tops, bottoms, dresses, outerwear, footwear, accessories].
    - color: Main color(s) of the item.
    - pattern: e.g., Solid, Striped, Checked, etc.
    - type: Specific type of clothing (e.g., blazer, jeans, sneakers).
    - gender: [male, female, unisex]

    Ensure the output is in valid JSON format.
    `;

    let result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      { text: prompt },
    ]);

    // Clean up
    await fileManager.deleteFile(uploadResult.file.name);

    // Parse the JSON response
    let parsedResult;
    const jsonStartIndex = result.response.text().indexOf("{");
    const jsonEndIndex = result.response.text().lastIndexOf("}");

    if (
      jsonStartIndex !== -1 &&
      jsonEndIndex !== -1 &&
      jsonEndIndex > jsonStartIndex
    ) {
      const jsonSubstring = result.response
        .text()
        .substring(jsonStartIndex, jsonEndIndex + 1);
      try {
        parsedResult = JSON.parse(jsonSubstring);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        return NextResponse.json({
          message: "Invalid AI response format",
          status: 500,
        });
      }
    } else {
      console.error("No valid JSON found in the response");
      return NextResponse.json({
        message: "Invalid AI response format",
        status: 500,
      });
    }

    // Add to database
    const docRef = await db.collection("gallery").add({
      ...parsedResult,
      imageUrl: img,
      userRef,
    });

    return NextResponse.json(
      {
        ...parsedResult,
        imageUrl: img,
        id: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "An error occurred",
      status: 500,
    });
  }
};
