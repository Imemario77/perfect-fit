"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

export default function OutfitGenerator({ user }) {
  let [weather, setWeather] = useState("");

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=2dbe70f0c515e00281029ae3a276f5b2&units=metric`
                // Metric for Celsius
              );
              setWeather(res?.data?.weather[0]?.description);
              console.log(res);
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
    {
      text: "Hi! I'm your AI Wardrobe Assistant. Where are you going today?",
      sender: "ai",
    },
  ]);
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { text: userInput, sender: "user" }]);

    try {
      const predictOutfit = await axios.post("/api/v1/predict", {
        prompt: userInput,
        userId: user.uid,
        weather,
      });

      console.log(predictOutfit);

      if (typeof predictOutfit.data.message === "string") {
        setMessages((prev) => [
          ...prev,
          {
            text: predictOutfit.data.message,
            sender: "ai",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: "Based on where you're going, I suggest this outfit:",
            sender: "ai",
            outfit: predictOutfit.data.message,
          },
        ]);
      }
    } catch (error) {
      console.error("Error predicting outfit:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't generate an outfit at this time. Please try again.",
          sender: "ai",
        },
      ]);
    }

    setUserInput("");
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
        renderOutfitItem(`${key}-${subKey}`, subItem)
      );
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Wardrobe Assistant</h2>
      <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-100 rounded">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.sender === "user" ? "text-right" : ""}`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-primary text-bg"
                  : "bg-sec-1 text-text"
              }`}
            >
              {message.text}
            </span>
            {message.outfit && (
              <div className="mt-2  grid grid-cols-2 gap-2:">
                {Object.entries(message.outfit).map(([key, item]) =>
                  renderOutfitItem(key, item)
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex">
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
    </div>
  );
}
