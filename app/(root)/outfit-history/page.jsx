"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaTshirt } from "react-icons/fa";

const OutfitItem = ({ label, value }) => {
  if (!value) return null;

  if (typeof value === "string") {
    if (value.startsWith("http")) {
      return (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 capitalize mb-2">
            {label}
          </p>
          <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105">
            <Image
              src={value}
              alt={label}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600 capitalize">
          {label}: <span className="font-normal text-gray-800">{value}</span>
        </p>
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600 capitalize mb-2">
          {label}
        </p>
        <div className="pl-4 border-l-2 border-primary">
          {Object.entries(value).map(([key, val]) => (
            <OutfitItem key={key} label={key} value={val} />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default function OutfitHistory() {
  const [outfits, setOutfits] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchOutfit = async () => {
        const outfitQuery = query(
          collection(db, "outfitHistory"),
          where("userRef", "==", user.uid)
        );
        const outfitSnapshot = await getDocs(outfitQuery);
        const outfitList = outfitSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOutfits(outfitList);
      };

      fetchOutfit();
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          <FaTshirt className="inline-block mr-2 text-primary" />
          Your Outfit History
        </h1>
        {outfits.length < 1 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-600">
              You have no previous outfit history
            </p>
            <button
              onClick={() => router.push("/outfit-generator")}
              className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-sec-2 transition duration-300"
            >
              Generate Your First Outfit
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {outfits.map((outfit, index) => (
              <div
                key={outfit.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg text-white font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Outfit {index + 1}
                    </h2>
                    <span className="text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {outfit.createdAt && outfit.createdAt.seconds
                        ? format(
                            new Date(outfit.createdAt.seconds * 1000),
                            "PPP"
                          )
                        : "Date unknown"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Object.entries(outfit).map(([key, value]) => {
                    if (
                      key !== "id" &&
                      key !== "createdAt" &&
                      key !== "userRef" &&
                      key !== "date"
                    ) {
                      return <OutfitItem key={key} label={key} value={value} />;
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
