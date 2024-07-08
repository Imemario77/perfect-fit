import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase/config";

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

    const uploadTask = uploadBytesResumable(storageRef, buffer, {
      contentType: file.type,
    });

    // Wait for the upload to complete
    await uploadTask;

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json(
      {
        message: "Success",
        downloadURL,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
