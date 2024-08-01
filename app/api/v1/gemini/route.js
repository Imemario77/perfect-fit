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
      You are an AI assistant designed to help with getting detailed information from a pieces of clothing. Your task is to analyze a given image and output a structured JSON data format containing the following fields: description, category, color, pattern, and any other relevant information should be added to the description, make sure to add the gender the item is for either (male, female , male and female).

      Please ensure the JSON output adheres to the following structure: you reply must always be in json format no matter what
        {
        "description": "A well detailed and structured description of the clothing item, it should contain all the information about the cloth like pattern, gender that it's suited for etc.",
        "category": "The category of the clothing item should be one of these and nothing else (tops, bottoms, dresses, outerwear, footwear, accessories).",
        "color": "The color of the clothing item.",
        "pattern": "The pattern of the clothing item (e.g., Solid, Striped, Checked).",
        "type":"The type of cloth should be one of these and nothing else (dress shirts, casual shirts, t-shirts, polo shirts, henleys, tank tops, kurtas, thobes, dishdashas, dashikis, guayaberas, barongs, kimonos, sweaters, cardigans, pullovers, hoodies, jerseys, jeans, chinos, dress pants, slacks, cargo pants, joggers, sweatpants, shalwars, lungis, sarongs, kilts, shorts, swim trunks, jackets, blazers, sport coats, bomber jackets, leather jackets, denim jackets, rain jackets, fleece jackets, coats, overcoats, trench coats, peacoats, parkas, down jackets, vests, suit vests, sweater vests, puffer vests, dress shoes, sneakers, high-tops, boots, work boots, Chelsea boots, hiking boots, sandals, hats, fedoras, baseball caps, beanies, turbans, keffiyehs, skullcaps, kippahs, belts, ties, bowties, scarves, gloves, sunglasses, watches, jewelry, rings, necklaces, bracelets, socks, blouses, crop tops, tunics, skirts, trousers, leggings, culottes, cocktail dresses, maxi dresses, sundresses, casual dresses, formal gowns, heels, flats, purses, clutches)"
        }

        

        your reply must be json no matter what happens okay 

        example output 
        {
          "category": "outerwear",
          "color": "navy blue",
          "description": "A navy blue blazer with a single-breasted closure and two button detailing. It has a notch lapel collar, long sleeves with button cuffs, and two front pockets. it best for a males ",
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/perfect-fit-fc745.appspot.com/o/uploads%2Ffd1c5716-4d1c-4418-b0fc-28f6124436de_suit_blue.jpg?alt=media&token=cfa3d23f-e362-43c3-ade5-af6f7578ab5b",
          "pattern": "Solid",
          "type": "blazers",
          "userRef": "L5CZlYJbTIbQigBWqwgNq"
        }
        
        Notice of high importance: always add the gender the item is sutied for in the description
`,
      },
    ]);

    fs.unlinkSync(localFilePath);
    fileManager.deleteFile(uploadResult.file.name);
    const jsonStartIndex = result.response.text().indexOf("{");
    const jsonEndIndex = result.response.text().lastIndexOf("}");

    result = JSON.parse(
      result.response.text().substring(jsonStartIndex, jsonEndIndex + 1)
    );

    console.log(result);

    const docRef = await db.collection("gallery").add({
      category: result.category,
      color: result.color,
      description: result.description,
      imageUrl: img,
      pattern: result.pattern,
      type: result.type,
      userRef,
    });

    return NextResponse.json(
      {
        category: result.category,
        color: result.color,
        description: result.description,
        imageUrl: img,
        pattern: result.pattern,
        type: result.type,
        id: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "ann error occured",
      status: 500,
    });
  }
};
