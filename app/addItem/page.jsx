"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";

function AddItem() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  let [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Initialize driver.js tour
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: "#upload-section",
          popover: {
            title: "Upload Image",
            description:
              "Click here to upload a clear, well-lit photo of your clothing item.",
          },
        },
        {
          element: "#instructions",
          popover: {
            title: "Read Instructions",
            description:
              "Make sure to follow these guidelines for best results.",
          },
        },
        {
          element: "#upload-button",
          popover: {
            title: "Process Image",
            description:
              "After uploading, click here to let our AI analyze your item.",
          },
        },
      ],
    });

    // Start the tour automatically for first-time users
    // In a real app, you'd check if the user has seen the tour before
    driverObj.drive();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null)
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const uploadResponse = await axios.post("/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(uploadResponse.data);

      const uploadToGenimi = await axios.post("/api/v1/gemini", {
        img: uploadResponse.data.downloadURL,
        userRef: user.uid,
      });

      console.log(uploadToGenimi.data);

      const createEmbedings = await axios.post("/api/v1/gemini/embed", {
        galleryId: uploadToGenimi.data.id,
        description: uploadToGenimi.data.description,
      });

      console.log(createEmbedings.data);

      setResult(uploadToGenimi.data);
      toast.success("The item has been uploaded sucessfully", {
        style: {
          fontSize: "10px",
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Item was not uploaded an error occured", {
        style: {
          fontSize: "10px",
        },
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Item</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8" id="instructions">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Upload a clear, high-resolution image of the clothing item</li>
          <li>
            Ensure the item is well-lit and against a contrasting background
          </li>
          <li>Capture the entire item in the frame</li>
          <li>Avoid including multiple items in one image</li>
          <li>
            For Accuracy please use your device camera (better still a mobile
            phone)
          </li>
        </ul>
      </div>

      <div
        className="bg-white p-6 rounded-lg shadow-md mb-8"
        id="upload-section"
      >
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />
        {preview && (
          <img src={preview} alt="Preview" className="max-w-xs mb-4" />
        )}
        <button
          onClick={handleUpload}
          disabled={!image || isUploading}
          className="bg-primary text-bg py-2 px-4 rounded hover:bg-sec-2 transition-colors disabled:bg-gray-400"
          id="upload-button"
        >
          {isUploading ? "Processing..." : "Process Image"}
        </button>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <p>
            <b>Category:</b> {result.category}
          </p>
          <p>
            <b>description:</b> {result.description}
          </p>
          <p>
            <b>Color:</b> {result.color}
          </p>
          <p>
            <b>Pattern:</b> {result.pattern}
          </p>
        </div>
      )}
      <ToastContainer />
    </main>
  );
}

export default AddItem;
