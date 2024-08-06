// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import axios from "axios";
// import {
//   addDoc,
//   collection,
//   getDocs,
//   query,
//   where,
//   writeBatch,
// } from "firebase/firestore";
// import { db } from "@/firebase/config";
// import { toast, ToastContainer } from "react-toastify";

// export default function OutfitGenerator({ user }) {
//   const [weather, setWeather] = useState("");
//   const [isDisbled, setIsDisabled] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const LoadingIndicator = () => (
//     <div className="flex items-center space-x-2 animate-pulse">
//       <div className="w-2 h-2 bg-primary rounded-full"></div>
//       <div className="w-2 h-2 bg-primary rounded-full"></div>
//       <div className="w-2 h-2 bg-primary rounded-full"></div>
//     </div>
//   );

//   useEffect(() => {
//     const fetchWeatherData = async () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             const { latitude, longitude } = position.coords;
//             try {
//               const res = await axios.get(
//                 `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OPEN_WAETHER}&units=metric`
//                 // Metric for Celsius
//               );
//               setWeather(res?.data?.weather[0]?.description);
//             } catch (error) {
//               console.error("Error fetching weather:", error);
//               setWeather("Error: Could not fetch weather data.");
//             }
//           },
//           (error) => {
//             console.error("Error getting location:", error);
//             setWeather("Error: Could not get location.");
//           }
//         );
//       } else {
//         setWeather("Error: Geolocation is not supported by this browser.");
//       }
//     };

//     fetchWeatherData();
//   }, []);

//   const [messages, setMessages] = useState([
//     { parts: [{ text: "Hello" }], role: "user" },
//     {
//       parts: [
//         {
//           text: "Hi! I'm your AI Wardrobe Assistant. Where are you going today?",
//         },
//       ],
//       role: "model",
//     },
//   ]);
//   const [userInput, setUserInput] = useState("");

//   const handleSendMessage = async () => {
//     const input = userInput;
//     setUserInput("");
//     setIsLoading(true);
//     if (!input.trim()) return;

//     setMessages((prev) => [
//       ...prev,
//       { parts: [{ text: input }], role: "user" },
//     ]);

//     try {
//       console.log(messages);
//       const predictOutfit = await axios.post("/api/v1/predict", {
//         prompt: input,
//         userId: user.userId,
//         weather,
//         messages: messages.map(({ parts, role }) => ({
//           parts: [
//             {
//               text: parts[0].text.includes(":")
//                 ? parts[0].text.split(":")[1]
//                 : parts[0].text,
//             },
//           ],
//           role,
//         })),
//         skinTone: user.skinTone,
//         gender: user.gender,
//       });

//       if (typeof predictOutfit.data.message === "string") {
//         setMessages((prev) => [
//           ...prev,
//           {
//             parts: [{ text: predictOutfit.data.message }],
//             role: "model",
//           },
//         ]);
//       } else {
//         setMessages((prev) => [
//           ...prev,
//           {
//             parts: [
//               {
//                 text:
//                   "Based on where you're going, I suggest this outfit " +
//                   predictOutfit.data.text +
//                   ": " +
//                   JSON.stringify(predictOutfit.data.message),
//               },
//             ],
//             role: "model",
//             outfit: predictOutfit.data.message,
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error predicting outfit:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           parts: [
//             {
//               text: "Sorry, I couldn't generate an outfit at this time. Please try again.",
//             },
//           ],
//           role: "model",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAcceptItem = async (outfit) => {
//     // console.log(user);
//     if (!user) return;
//     setIsDisabled(true);
//     try {
//       await addDoc(collection(db, "outfitHistory"), {
//         ...outfit,
//         userRef: user.userId,
//         createdAt: new Date(),
//       });

//       let itemList = [];

//       for (const [itemType, itemName] of Object.entries(outfit)) {
//         // await updateItemWearCount(itemType, itemName);
//         if (typeof itemName == "object") {
//           for (const [innerItemType, innerItemName] of Object.entries(
//             itemName
//           )) {
//             itemList.push(innerItemName);
//           }
//         } else {
//           itemList.push(itemName);
//         }
//       }

//       console.log(itemList);

//       const clothRef = query(
//         collection(db, "gallery"),
//         where("imageUrl", "in", itemList)
//       );

//       const querySnapshot = await getDocs(clothRef);

//       // Create a batch
//       const batch = writeBatch(db);

//       // Update each document in the batch
//       querySnapshot.forEach((doc) => {
//         batch.set(
//           doc.ref,
//           {
//             lastWornDate: new Date(),
//           },
//           {
//             merge: true,
//           }
//         );
//       });

//       // Commit the batch
//       await batch.commit();

//       toast.success("Suggestion has been saved to history", {
//         style: {
//           fontSize: "10px",
//         },
//       });
//     } catch (error) {
//       console.error("Error adding event: ", error);
//       alert("Failed to add event. Please try again.");
//     } finally {
//       setIsDisabled(false);
//     }
//   };

//   const renderOutfitItem = (key, item) => {
//     if (typeof item === "string") {
//       // If item is a string, it's either an image URL or a text suggestion
//       if (item.startsWith("http")) {
//         return (
//           <div key={key} className="text-center">
//             <Image
//               src={item}
//               alt={key}
//               width={100}
//               height={100}
//               className="mx-auto rounded"
//             />
//             <p className="mt-1 text-sm">{key}</p>
//           </div>
//         );
//       } else {
//         return (
//           <div key={key} className="text-center">
//             <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center mx-auto">
//               <span className="text-3xl">?</span>
//             </div>
//             <p className="mt-1 text-sm">{item}</p>
//           </div>
//         );
//       }
//     } else if (typeof item === "object") {
//       // If item is an object, render its contents
//       return Object.entries(item).map(([subKey, subItem]) =>
//         renderOutfitItem(`${subKey}`, subItem)
//       );
//     }
//   };

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Perfect Fit Assistant</h2>
//       <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-100 rounded">
//         {messages.map((message, index) => (
//           <div
//             key={index}
//             className={`mb-4 ${message.role === "user" ? "text-right" : ""}`}
//           >
//             {index !== 0 && (
//               <span
//                 className={`inline-block p-2 rounded-lg ${
//                   message.role === "user"
//                     ? "bg-primary text-bg"
//                     : "bg-sec-1 text-text"
//                 }`}
//               >
//                 {message.parts[0].text.split(":")[0]}
//               </span>
//             )}
//             {message.outfit && (
//               <>
//                 <div className="mt-2 grid grid-cols-2 gap-2">
//                   {Object.entries(message.outfit).map(([key, item]) =>
//                     renderOutfitItem(`${key}`, item)
//                   )}
//                 </div>
//                 <button
//                   onClick={async () => {
//                     await handleAcceptItem(message.outfit);
//                   }}
//                   disabled={isDisbled}
//                   className="bg-green-500 py-2 px-4  text-white ml-4 mt-3 rounded-2xl disabled:bg-gray-500 disabled:cursor-not-allowed"
//                 >
//                   Use Outfit
//                 </button>
//               </>
//             )}
//           </div>
//         ))}
//         {isLoading && (
//           <div className="text-left">
//             <div className="mt-2">
//               <LoadingIndicator />
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="flex md:flex-row flex-col">
//         <input
//           type="text"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder="Type your destination or activity..."
//           className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
//           onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//         />
//         <button
//           onClick={handleSendMessage}
//           className="bg-primary text-bg font-bold py-2 px-4 rounded-r hover:bg-sec-2 transition-colors"
//         >
//           Send
//         </button>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { toast, ToastContainer } from "react-toastify";
import { FaPaperPlane, FaCheck } from "react-icons/fa";

export default function OutfitGenerator({ user }) {
  const [weather, setWeather] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const LoadingIndicator = () => (
    <div className="flex items-center space-x-2 animate-pulse">
      <div className="w-2 h-2 bg-primary rounded-full"></div>
      <div className="w-2 h-2 bg-primary rounded-full animation-delay-200"></div>
      <div className="w-2 h-2 bg-primary rounded-full animation-delay-400"></div>
    </div>
  );

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OPEN_WAETHER}&units=metric`
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

  const handleSendMessage = async () => {
    const input = userInput.trim();
    if (!input) return;

    setUserInput("");
    setIsLoading(true);

    setMessages((prev) => [
      ...prev,
      { parts: [{ text: input }], role: "user" },
    ]);

    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptItem = async (outfit) => {
    if (!user) return;
    setIsDisabled(true);
    try {
      await addDoc(collection(db, "outfitHistory"), {
        ...outfit,
        userRef: user.userId,
        createdAt: new Date(),
      });

      let itemList = [];

      for (const [itemType, itemName] of Object.entries(outfit)) {
        if (typeof itemName == "object") {
          for (const [innerItemType, innerItemName] of Object.entries(
            itemName
          )) {
            itemList.push(innerItemName);
          }
        } else {
          itemList.push(itemName);
        }
      }

      const clothRef = query(
        collection(db, "gallery"),
        where("imageUrl", "in", itemList)
      );

      const querySnapshot = await getDocs(clothRef);
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.set(
          doc.ref,
          {
            lastWornDate: new Date(),
          },
          {
            merge: true,
          }
        );
      });

      await batch.commit();

      toast.success("Outfit saved to history", {
        style: {
          fontSize: "14px",
        },
      });
    } catch (error) {
      console.error("Error adding event: ", error);
      toast.error("Failed to save outfit. Please try again.", {
        style: {
          fontSize: "14px",
        },
      });
    } finally {
      setIsDisabled(false);
    }
  };

  const renderOutfitItem = (key, item) => {
    if (typeof item === "string") {
      if (item.startsWith("http")) {
        return (
          <div key={key} className="text-center">
            <Image
              src={item}
              alt={key}
              width={100}
              height={100}
              className="mx-auto rounded-lg shadow-md"
            />
            <p className="mt-2 text-sm font-medium">{key}</p>
          </div>
        );
      } else {
        return (
          <div key={key} className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mx-auto shadow-inner">
              <span className="text-3xl text-gray-500">?</span>
            </div>
            <p className="mt-2 text-sm font-medium">{item}</p>
          </div>
        );
      }
    } else if (typeof item === "object") {
      return Object.entries(item).map(([subKey, subItem]) =>
        renderOutfitItem(`${subKey}`, subItem)
      );
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-primary">
        Perfect Fit Assistant
      </h2>
      <div className="h-96 overflow-y-auto mb-6 p-4 bg-gray-100 rounded-lg shadow-inner">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === "user" ? "text-right" : ""}`}
          >
            {index !== 0 && (
              <span
                className={`inline-block p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-sec-1 text-text"
                }`}
              >
                {message.parts[0].text.split(":")[0]}
              </span>
            )}
            {message.outfit && (
              <div className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(message.outfit).map(([key, item]) =>
                    renderOutfitItem(`${key}`, item)
                  )}
                </div>
                <button
                  onClick={() => handleAcceptItem(message.outfit)}
                  disabled={isDisabled}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mt-4 transition duration-300 ease-in-out flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isDisabled ? (
                    <LoadingIndicator />
                  ) : (
                    <>
                      <FaCheck className="mr-2" /> Use Outfit
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="mt-2">
              <LoadingIndicator />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your destination or activity..."
          className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 ease-in-out"
          onKeyPress={(e) =>
            e.key === "Enter" && !isLoading && handleSendMessage()
          }
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !userInput.trim()}
          className="bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-sec-2 transition duration-300 ease-in-out flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              <FaPaperPlane className="mr-2" /> Send
            </>
          )}
        </button>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
