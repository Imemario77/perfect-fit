import { app, firebaseConfig } from "@/firebase/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    const { description, additional_info } = await req.json();

    // Access your API key as an environment variable (see our Getting Started tutorial)
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );

    // generate embeddings from the text
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const result = await model.embedContent(
      description + " " + additional_info
    );
    const embedding = result.embedding;

    return NextResponse.json({
      embedding,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "ann error occured", status: 500 });
  }
};
