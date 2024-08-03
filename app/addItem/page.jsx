"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const GooglePhotosGallery = ({ mediaItems, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {mediaItems.map((item) => (
        <div
          key={item.id}
          className="cursor-pointer"
          onClick={() => onSelect(item)}
        >
          <img
            src={item.baseUrl}
            alt={item.filename}
            className="w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
};

function AddItem() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [result, setResult] = useState(null);
  const [userData, setUserData] = useState(null);
  const [pageToken, setPageToken] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);

  let [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code && user) {
      handleAuthorizationCode(code);
    }
  }, [user]);

  const handleAuthorizationCode = async (code) => {
    try {
      // Exchange the code for tokens
      const response = await axios.post("/api/v1/connect/refresh_token", {
        code,
      });

      console.log(response);
      if (response.status === 200) {
        console.log(user);
        // Update the user's profile in Firestore
        const userRef = doc(db, "userProfile", user.uid);
        await setDoc(
          userRef,
          {
            googlePhotosToken: response.data.token,
          },
          { merge: true }
        );

        toast.success("Successfully connected to Google Photos", {
          style: { fontSize: "10px" },
        });
        const userDoc = await getDoc(doc(db, "userProfile", user.uid));
        setUserData(userDoc.data());
      } else {
        throw new Error("Failed to exchange code for tokens");
      }
    } catch (error) {
      console.error("Error handling authorization code:", error);
      toast.error("Failed to connect to Google Photos", {
        style: { fontSize: "10px" },
      });
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      async function checkUserStatus() {
        try {
          const userDoc = await getDoc(doc(db, "userProfile", user.uid));
          if (!userDoc.exists() || !userDoc.data().onboardingCompleted) {
            router.push("/onboarding");
          } else {
            setUserData(userDoc.data());
            // Check if the gallery is empty
            const galleryQuery = query(
              collection(db, "gallery"),
              where("userRef", "==", user.uid),
              limit(1)
            );
            const gallerySnapshot = await getDocs(galleryQuery);

            if (gallerySnapshot.empty) {
              // Gallery is empty, initialize the tour
              initializeTour();
            }
          }
        } catch (error) {
          console.error("Error checking user status:", error);
        }
      }
      checkUserStatus();
    }
  }, [user, loading, router]);

  const initializeTour = () => {
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
        {
          element: "#connect-button",
          popover: {
            title: "Connect To Google",
            description:
              "Click here to connect your account to google photo libary",
          },
        },
      ],
    });

    driverObj.drive();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleGooglePhotoSelect = async (item) => {
    setIsUploading(true);
    try {
      console.log(item);
      // Upload the file to your server
      const uploadResponse = await axios.post(
        "/api/v1/upload",
        {
          providedFilename: item.filename,
          url: item.baseUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Process the uploaded image with Gemini
      const uploadToGemini = await axios.post("/api/v1/gemini", {
        img: uploadResponse.data.downloadURL,
        userRef: user.uid,
      });

      // Create embeddings
      await axios.post("/api/v1/gemini/embed", {
        galleryId: uploadToGemini.data.id,
        description: uploadToGemini.data.description,
      });

      setResult(uploadToGemini.data);
      toast.success("The item has been uploaded successfully", {
        style: { fontSize: "10px" },
      });
    } catch (error) {
      console.error("Error uploading image from Google Photos:", error);
      toast.error("Failed to upload item from Google Photos", {
        style: { fontSize: "10px" },
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!image)
      return toast.error("An image is need", {
        style: {
          fontSize: "10px",
        },
      });

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", "uploads");

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

  const getAccessTokenForGoogle = async (googlePhotosToken) => {
    setIsConnecting(true);
    let token;
    try {
      const res = await axios.post("/api/v1/connect/access_token", {
        googlePhotosToken,
      });
      await setAccessToken(res.data.token);
      token = res.data.token;
    } catch (error) {
      console.log(error);
      return toast.error("Could not get google photos", {
        style: {
          fontSize: "10px",
        },
      });
    }

    await fetchPhotos(token, pageToken);

    setIsConnecting(false);
  };

  const connectToGooglePhotos = async () => {
    setIsConnecting(true);
    try {
      const res = await axios.get("/api/v1/connect");
      window.location = res.data.url;
    } catch (error) {
      console.log(error);
      toast.error("There was an error connecting to google", {
        style: {
          fontSize: "10px",
        },
      });
    }
    setIsConnecting(false);
  };

  const fetchPhotos = async (token, pageToken) => {
    try {
      const response = await axios({
        method: "get",
        url: "https://photoslibrary.googleapis.com/v1/mediaItems",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          pageSize: 10,
          pageToken,
        },
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      setMediaItems(data.mediaItems);
      setPageToken(data.nextPageToken);
    } catch (error) {
      console.error("Error fetching photos:", error);
      toast.error("Failed to fetch photos from Google Photos", {
        style: { fontSize: "10px" },
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent default behavior and bubbling
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageChange({ target: { files: [file] } }); // Reuse the image change handler
    } else {
      toast.error("Please drop an image file (PNG, JPG, or GIF).");
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-sec-2">Error: {error.message}</div>
    );
  }

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
            For ease of use and best results, we recommend using your device's
            camera (especially a smartphone camera)
          </li>
        </ul>
      </div>
      <div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg mb-8 border border-blue-100"
        id="upload-section"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Upload Your Image
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-center w-full">
            <label
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-blue-50 transition duration-300 ease-in-out"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-10 h-10 mb-3 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {preview && (
            <div className="mt-4 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleUpload}
              disabled={!image || isUploading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              id="upload-button"
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Process Image"
              )}
            </button>

            {userData?.googlePhotosToken ? (
              <button
                onClick={() =>
                  getAccessTokenForGoogle(userData?.googlePhotosToken)
                }
                disabled={isConnecting}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                id="connect-button"
              >
                {isConnecting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Setting up google
                  </span>
                ) : (
                  "Use Google Photos"
                )}
              </button>
            ) : (
              <button
                onClick={connectToGooglePhotos}
                disabled={isConnecting}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                id="connect-button"
              >
                Connect Google Photos
              </button>
            )}
          </div>
        </div>
      </div>

      {accessToken && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Select from Google Photos
          </h2>
          <GooglePhotosGallery
            mediaItems={mediaItems}
            onSelect={handleGooglePhotoSelect}
          />
          {pageToken && (
            <button
              onClick={async () => {
                setIsConnecting(true);
                await fetchPhotos(accessToken, pageToken);
                setIsConnecting(false);
              }}
              disabled={isConnecting}
              className="px-6 py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              id="connect-button"
            >
              {isConnecting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading
                </span>
              ) : (
                "Load"
              )}
            </button>
          )}
        </div>
      )}

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
