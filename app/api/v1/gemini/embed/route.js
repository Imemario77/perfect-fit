import { app } from "@/firebase/config";
import { embeddingFunction, genAI } from "@/lib/gemini";
import { FieldValue, Firestore } from "@google-cloud/firestore";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    const { galleryId, description } = await req.json();

    const embedding = await embeddingFunction(description);

    const db = new Firestore({
      projectId: "perfect-fit-fc745",
      keyFilename: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
    });

    const docRef = await db
      .collection("gallery")
      .doc(galleryId)
      .set(
        {
          embedding: FieldValue.vector(embedding.values),
        },
        { merge: true }
      );

    return NextResponse.json({
      result: docRef.id,
      status: 200,
    });
  } catch (error) {
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
