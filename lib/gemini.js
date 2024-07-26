import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see our Getting Started tutorial)
export const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY
);

export const embeddingFunction = async (description) => {
  // generate embeddings from the text
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  const result = await model.embedContent(description);
  return result.embedding;
};
