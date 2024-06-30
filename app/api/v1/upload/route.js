import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/config";

export const GET = () => {
  return NextResponse.json({ hello: "mario" });
};

// uploading the file to firebase storage
export const POST = async (req, res) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  try {
    // giving the file a unique name
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = uuidv4() + "_" + file.name.replaceAll(" ", "_");
    console.log(filename);

    const storageRef = ref(storage, `uploads/${filename}`);
    // setting the type of the file
    let data = {
      contentType: file.type,
    };
    const { metadata } = await uploadBytes(storageRef, buffer, data);
    const { fullPath } = metadata;
    if (!fullPath) {
      return res.status(403).json({
        error: "There was some error while uploading the file.",
      });
    }
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
