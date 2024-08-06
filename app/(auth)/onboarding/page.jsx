"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { auth, db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaUpload } from "react-icons/fa";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "userProfile", user.uid));
          if (userDoc.exists() && userDoc.data().onboardingCompleted) {
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
    setIsSubmitting(true);
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

        delete formData.profileImage;
        imageUrl = res.data.downloadURL;
      }

      const uploadToGenimi = await axios.post("/api/v1/gemini/profile", {
        img: imageUrl,
        userRef: user.uid,
      });

      if (uploadToGenimi.data.skinDetected) {
        await setDoc(doc(db, "userProfile", user.uid), {
          ...formData,
          imageUrl,
          userId: user.uid,
          onboardingCompleted: true,
          skinTone: uploadToGenimi.data.skinToneDescription,
        });
        router.push("/dashboard");
      } else {
        throw new Error(
          "No skin detected in the image. Please upload another."
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        style: {
          fontSize: "14px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (appLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gradient-to-b from-blue-100 to-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">
        Perfect Fit 🤝 Your Partner in Personalized Style
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="profileImage"
          >
            Upload a facial image
          </label>
          <div className="flex items-center justify-center mb-4">
            {formData.profileImage ? (
              <Image
                src={formData.profileImage}
                alt="Profile"
                width={150}
                height={150}
                className="rounded-[50%] object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-dashed border-primary">
                <FaUpload className="text-primary text-3xl" />
              </div>
            )}
          </div>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label
            htmlFor="profileImage"
            className="cursor-pointer bg-primary text-white py-2 px-4 rounded-full hover:bg-sec-2 transition-colors inline-block w-full text-center"
          >
            Choose Image
          </label>
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

        <div className="mb-6">
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
          className={`w-full font-bold py-3 px-4 rounded-full transition-colors ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-sec-2"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Start Your Style Journey"}
        </button>
      </form>
      <ToastContainer />
    </main>
  );
}

export default Onboarding;
