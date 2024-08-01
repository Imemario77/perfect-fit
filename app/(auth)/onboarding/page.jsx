"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { auth, db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

function Onboarding() {
  const [appLoading, setAppLoading] = useState(true);
  const router = useRouter();
  const [user, loading, __] = useAuthState(auth);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    age: "",
    profileImage: null,
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "userProfile", user.uid));
          if (userDoc.exists() && userDoc.data().onboardingCompleted) {
            // User has already completed onboarding, redirect to profile page
            router.push("/profile");
          } else {
            setFormData((prevData) => ({
              ...prevData,
              name: user.displayName || "",
            }));
            setAppLoading(false);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setAppLoading(false);
        }
      } else if (!loading) {
        // User is not logged in, redirect to login page
        router.push("/login");
      }
    };

    if (!loading) {
      checkOnboarding();
    }
  }, [user, loading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageFormData = new FormData();
    imageFormData.append("file", image);
    imageFormData.append("name", "profile");
    try {
      let imageUrl;
      if (image instanceof File) {
        const res = await axios.post("/api/v1/upload", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(res);
        delete formData.profileImage;
        imageUrl = res.data.downloadURL;
      }

      const uploadToGenimi = await axios.post("/api/v1/gemini/profile", {
        img: imageUrl,
        userRef: user.uid,
      });

      console.log(uploadToGenimi.data)

      if (uploadToGenimi.data.skinDetected) {
        await setDoc(doc(db, "userProfile", user.uid), {
          ...formData,
          imageUrl,
          userId: user.uid,
          onboardingCompleted: true,
          skinTone: uploadToGenimi.data.skinToneDescription,
        });
      } else {
        throw new Error("No skin detected in the image upload another");
      }

      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      return toast.error(error.message, {
        style: {
          fontSize: "10px",
        },
      });
    }
  };

  if (appLoading) {
    return <div>loading...</div>;
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Welcome to Your Personal Stylist
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="profileImage"
          >
            Upload a facial image
          </label>
          <div className="flex items-center justify-center">
            {formData.profileImage ? (
              <Image
                src={formData.profileImage}
                alt="Profile"
                width={150}
                height={150}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </div>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="gender"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="age"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:bg-sec-2 transition-colors"
        >
          Start Your Style Journey
        </button>
      </form>
      <ToastContainer />
    </main>
  );
}

export default Onboarding;
