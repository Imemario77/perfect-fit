"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

function Wardrobe() {
  const [clothes, setClothes] = useState([]);
  const [filter, setFilter] = useState("all");

  const categories = [
    "all",
    "tops",
    "bottoms",
    "dresses",
    "outerwear",
    "footwear",
    "accessories",
  ];

  const filteredClothes = clothes.filter(
    (item) => filter === "all" || item.category === filter
  );

  let [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      async function hasOnboarded() {
        try {
          const userDoc = await getDoc(doc(db, "userProfile", user.uid));
          if (!userDoc.exists() || !userDoc.data().onboardingCompleted) {
            router.push("/onboarding");
          } else {
            const galleryQuery = query(
              collection(db, "gallery"),
              where("userRef", "==", user.uid)
            );
            const gallerySnapshot = await getDocs(galleryQuery);

            const galleryDocs = gallerySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            console.log(galleryDocs);
            setClothes(galleryDocs);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      hasOnboarded();
    }
  }, [user, loading, router]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wardrobe</h1>

      <div className="mb-8 flex justify-between items-center">
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-primary text-bg py-2 px-4 rounded hover:bg-sec-2 transition-colors">
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredClothes.length === 0 && <span>No item in this section</span>}
        {filteredClothes.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src={item.imageUrl}
              alt={item.description}
              width={200}
              height={200}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-lg font-semibold mb-2">{item.type}</h3>
            <p className="text-gray-600 mb-2">Category: {item.category}</p>
            <p className="text-gray-600">Color: {item.color}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Wardrobe;
