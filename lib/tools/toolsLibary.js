import { db } from "@/firebase/admin/config";
import { FieldValue } from "@google-cloud/firestore";
import { embeddingFunction } from "../gemini";

const searchVectorDatabase = async (description, userId, category) => {
  console.log(description, userId, category);
  const embedding = await embeddingFunction(description);
  const coll = db.collection("gallery");

  const preFilteredVectorQuery = coll
    .where("category", "==", category)
    .where("userRef", "==", userId)
    .findNearest("embedding", FieldValue.vector(embedding.values), {
      limit: 30,
      distanceMeasure: "COSINE",
    });

  const vectorQuerySnapshot = await preFilteredVectorQuery.get();

  const documents = await vectorQuerySnapshot._docs(); // Get the DocumentSnapshot objects

  const nearestDocuments = documents.map((doc) => ({
    description: doc.get("description"),
    imageUrl: doc.get("imageUrl"),
    type: doc.get("type"),
  }));

  return nearestDocuments;
};

const accessoryMatcher = async ({
  userId,
  accessoryCategory,
  accessoryDescription,
}) => {
  try {
    const res = await searchVectorDatabase(
      accessoryDescription,
      userId,
      "accessories"
    );

    return res;
  } catch (error) {
    return "Couldn't fetch item an error occured";
  }
};

const footwearMatcher = async ({
  userId,
  footwearCategory,
  footWearDescription,
}) => {
  try {
    const res = await searchVectorDatabase(
      footWearDescription,
      userId,
      "footwear"
    );

    return res;
  } catch (error) {
    return "Couldn't fetch item an error occured";
  }
};

const topsMatcher = async ({ userId, topCategory, topDescription }) => {
  try {
    const res = await searchVectorDatabase(topDescription, userId, "tops");

    return res;
  } catch (error) {
    return "Couldn't fetch item an error occured";
  }
};

const bottomsMatcher = async ({
  userId,
  bottomCategory,
  bottomDescription,
}) => {
  try {
    const res = await searchVectorDatabase(
      bottomDescription,
      userId,
      "bottoms"
    );

    return res;
  } catch (error) {
    return "Couldn't fetch item an error occured";
  }
};

const dressesMatcher = async ({
  userId,
  dressesCategory,
  dressesDescription,
}) => {
  try {
    const res = await searchVectorDatabase(
      dressesDescription,
      userId,
      "dresses"
    );

    return res;
  } catch (error) {
    return "Couldn't fetch item an error occured";
  }
};

const outerwearMatcher = async ({
  userId,
  outerwearCategory,
  outerwearDescription,
}) => {
  try {
    const res = await searchVectorDatabase(
      outerwearDescription,
      userId,
      "outerwear"
    );

    return res;
  } catch (error) {
    return "Couldn't fetch item an error occured";
  }
};

export const functions = {
  accessoryMatcher,
  footwearMatcher,
  topsMatcher,
  bottomsMatcher,
  dressesMatcher,
  outerwearMatcher,
};
