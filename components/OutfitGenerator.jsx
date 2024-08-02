"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toast, ToastContainer } from "react-toastify";
import { Truck } from "lucide-react";

export default function OutfitGenerator({ user }) {
  const [weather, setWeather] = useState("");
  const [disbled, setDisabled] = useState(false);
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OPEN_WAETHER}&units=metric`
                // Metric for Celsius
              );
              setWeather(res?.data?.weather[0]?.description);
            } catch (error) {
              console.error("Error fetching weather:", error);
              setWeather("Error: Could not fetch weather data.");
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            setWeather("Error: Could not get location.");
          }
        );
      } else {
        setWeather("Error: Geolocation is not supported by this browser.");
      }
    };

    fetchWeatherData();
  }, []);

  const [messages, setMessages] = useState([
    { parts: [{ text: "Hello" }], role: "user" },
    {
      parts: [
        {
          text: "Hi! I'm your AI Wardrobe Assistant. Where are you going today?",
        },
      ],
      role: "model",
    },
  ]);
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = async () => {
    const input = userInput;
    setUserInput("");

    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { parts: [{ text: input }], role: "user" },
    ]);

    try {
      console.log(messages)
      const predictOutfit = await axios.post("/api/v1/predict", {
        prompt: input,
        userId: user.userId,
        weather,
        messages: messages.map(({ parts, role }) => ({
          parts: [
            {
              text: parts[0].text.includes(":")
                ? parts[0].text.split(":")[1]
                : parts[0].text,
            },
          ],
          role,
        })),
        skinTone: user.skinTone,
        gender: user.gender,
      });

      if (typeof predictOutfit.data.message === "string") {
        setMessages((prev) => [
          ...prev,
          {
            parts: [{ text: predictOutfit.data.message }],
            role: "model",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            parts: [
              {
                text:
                  "Based on where you're going, I suggest this outfit " +
                  predictOutfit.data.text +
                  ": " +
                  JSON.stringify(predictOutfit.data.message),
              },
            ],
            role: "model",
            outfit: predictOutfit.data.message,
          },
        ]);
      }
    } catch (error) {
      console.error("Error predicting outfit:", error);
      setMessages((prev) => [
        ...prev,
        {
          parts: [
            {
              text: "Sorry, I couldn't generate an outfit at this time. Please try again.",
            },
          ],
          role: "model",
        },
      ]);
    }
  };

  const handleAcceptItem = async (outfit) => {
    console.log(user);
    if (!user) return;
    try {
      await addDoc(collection(db, "outfitHistory"), {
        ...outfit,
        userRef: user.userId,
        createdAt: new Date(),
      });
      toast.success("SUggestion has been saved to history", {
        style: {
          fontSize: "10px",
        },
      });
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Failed to add event. Please try again.");
    }
  };

  const renderOutfitItem = (key, item) => {
    if (typeof item === "string") {
      // If item is a string, it's either an image URL or a text suggestion
      if (item.startsWith("http")) {
        return (
          <div key={key} className="text-center">
            <Image
              src={item}
              alt={key}
              width={100}
              height={100}
              className="mx-auto rounded"
            />
            <p className="mt-1 text-sm">{key}</p>
          </div>
        );
      } else {
        return (
          <div key={key} className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center mx-auto">
              <span className="text-3xl">?</span>
            </div>
            <p className="mt-1 text-sm">{item}</p>
          </div>
        );
      }
    } else if (typeof item === "object") {
      // If item is an object, render its contents
      return Object.entries(item).map(([subKey, subItem]) =>
        renderOutfitItem(`${subKey}`, subItem)
      );
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Perfect Fit Assistant</h2>
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-100 rounded">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === "user" ? "text-right" : ""}`}
          >
            {index !== 0 && (
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-bg"
                    : "bg-sec-1 text-text"
                }`}
              >
                {message.parts[0].text.split(":")[0]}
              </span>
            )}
            {message.outfit && (
              <>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.entries(message.outfit).map(([key, item]) =>
                    renderOutfitItem(`${key}`, item)
                  )}
                </div>
                <button
                  onClick={(e) => {
                    setDisabled(true);
                    e.preventDefault();
                    handleAcceptItem(message.outfit);
                    setDisabled(false);
                  }}
                  disbled={disbled}
                  className="bg-green-500 py-2 px-4  text-white ml-4 mt-3 rounded-2xl disabled:bg-gray-500"
                >
                  Use Outfit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex md:flex-row flex-col">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your destination or activity..."
          className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-primary text-bg font-bold py-2 px-4 rounded-r hover:bg-sec-2 transition-colors"
        >
          Send
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
