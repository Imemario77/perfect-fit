import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    const { img } = await req.json();
    // get the file from the storage and save it to your server for a short while
    const fileUrl = img;
    const fileName = "Clothing Item.png";
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

    // Initialize GoogleGenerativeAI with your API_KEY.
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      // The Gemini 1.5 models are versatile and work with multimodal prompts
      model: "gemini-1.5-flash",
    });

    // Generate content using text and the URI reference for the uploaded file.
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      {
        text: `
      You are an AI assistant designed to help with getting detailed information from a pieces of clothing. Your task is to analyze a given image and output a structured JSON data format containing the following fields: description, category, color, pattern, occasion, and any other relevant information.

      Please ensure the JSON output adheres to the following structure:
        {
        "description": "A well detailed and structured description of the clothing item, it should contain all the information about the cloth like pattern etc.",
        "category": "The category of the clothing item should be one of these and nothing else and must be the correct one (dress shirts, casual shirts, t-shirts, polo shirts, henleys, tank tops, kurtas, thobes, dishdashas, dashikis, guayaberas, barongs, kimonos, sweaters, cardigans, pullovers, hoodies, jerseys, jeans, chinos, dress pants, slacks, cargo pants, joggers, sweatpants, shalwars, lungis, sarongs, kilts, shorts, swim trunks, jackets, blazers, sport coats, bomber jackets, leather jackets, denim jackets, rain jackets, fleece jackets, coats, overcoats, trench coats, peacoats, parkas, down jackets, vests, suit vests, sweater vests, puffer vests, dress shoes, sneakers, high-tops, boots, work boots, Chelsea boots, hiking boots, sandals, hats, fedoras, baseball caps, beanies, turbans, keffiyehs, skullcaps, kippahs, belts, ties, bowties, scarves, gloves, sunglasses, watches, jewelry, rings, necklaces, bracelets, socks, blouses, crop tops, tunics, skirts, trousers, leggings, culottes, cocktail dresses, maxi dresses, sundresses, casual dresses, formal gowns, heels, flats, purses, clutches).",
        "color": "The color of the clothing item.",
        "pattern": "The pattern of the clothing item (e.g., Solid, Striped, Checked).",
        "occasion": "The occasion for which the clothing item is suitable (e.g., Casual, Formal, Party).",
        "type":"The type of cloth (Shirt, Pants, Skirt, Dress, Jacket, etc)"
        "additional_info": "Any other relevant information about the clothing item."
        }
`,
      },
    ]);

    // delete the files to clean storage
    fs.unlinkSync(localFilePath);
    fileManager.deleteFile(uploadResult.file.name);
    return NextResponse.json({
      result,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "ann error occured", status: 500 });
  }
};
