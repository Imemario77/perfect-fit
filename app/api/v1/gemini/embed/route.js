import { db } from "@/firebase/admin/config";
import { app, firebaseConfig } from "@/firebase/config";
import { embeddingFunction, genAI } from "@/lib/gemini";
import { FieldValue } from "@google-cloud/firestore";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    const { galleryId, description } = await req.json();

    const embedding = await embeddingFunction(description);

    console.log(embedding.values);
    const docRef = await db.collection("galleryEmbedding").add({
      embedding: embedding.values,
      galleryId,
    });

    return NextResponse.json({
      result: docRef.id,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "ann error occured", status: 500 });
  }
};
