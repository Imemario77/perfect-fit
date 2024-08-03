// import { NextResponse } from "next/server";
// import { v4 as uuidv4 } from "uuid";
// import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
// import { storage } from "@/firebase/config";

// // uploading the file to firebase storage
// export const POST = async (req, _) => {
//   const formData = await req.formData();

//   const file = formData.get("file");
//   if (!file) {
//     return NextResponse.json({ error: "No files received." }, { status: 400 });
//   }

//   try {
//     // giving the file a unique name
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const filename = uuidv4() + "_" + file.name.replaceAll(" ", "_");
//     console.log(filename);

//     const storageRef = ref(storage, `${formData.get("name")}/${filename}`);

//     const uploadTask = uploadBytesResumable(storageRef, buffer, {
//       contentType: file.type,
//     });

//     // Wait for the upload to complete
//     await uploadTask;

//     // Get the download URL
//     const downloadURL = await getDownloadURL(storageRef);

//     return NextResponse.json(
//       {
//         message: "Success",
//         downloadURL,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     // Determine the appropriate status code and error message
//     let status = 500; // Default to Internal Server Error
//     let message = "An internal server error occurred";
//     if (error.name === "AbortError") {
//       status = 408; // Request Timeout (if the error is due to a timeout)
//       message = "The request timed out";
//     } else if (error.response) {
//       status = error.response.status; // Use the status from the API error response
//       message =
//         error.response.data.message || "An error occurred while fetching data";
//     }

//     return NextResponse.json({ message }, { status });
//   }
// };

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase/config";
import axios from "axios";

export const POST = async (req, _) => {
  let file, filename, buffer, contentType;

  // Check if the request is multipart/form-data or JSON
  const contentTypeHeader = req.headers.get("content-type");

  if (contentTypeHeader && contentTypeHeader.includes("multipart/form-data")) {
    // Handle form-data upload
    const formData = await req.formData();
    file = formData.get("file");
    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }
    buffer = Buffer.from(await file.arrayBuffer());
    filename = uuidv4() + "_" + file.name.replaceAll(" ", "_");
    contentType = file.type;
  } else {
    // Handle JSON request with URL
    const { url, filename: providedFilename } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided." }, { status: 400 });
    }

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      buffer = Buffer.from(response.data);
      contentType = response.headers["content-type"];
      filename =
        uuidv4() + "_" + (providedFilename || "download").replaceAll(" ", "_");
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to fetch file from URL." },
        { status: 400 }
      );
    }
  }

  try {
    console.log(filename);

    const storageRef = ref(storage, `uploads/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, buffer, {
      contentType: contentType,
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
