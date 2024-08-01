"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

const OutfitItem = ({ label, value }) => {
  if (!value) return null;

  if (typeof value === "string") {
    if (value.startsWith("http")) {
      return (
        <div className="mb-2">
          <p className="text-xs font-medium text-text capitalize mb-1">
            {label}
          </p>
          <div className="relative w-24 h-24">
            <Image
              src={value}
              alt={label}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="mb-2">
        <p className="text-xs font-medium text-text capitalize">
          {label}: <span className="font-normal">{value}</span>
        </p>
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="mb-2">
        <p className="text-xs font-medium text-text capitalize mb-1">{label}</p>
        <div className="pl-2">
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
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
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
        console.log(outfitList);

        setOutfits(outfitList);
      };

      fetchOutfit();
    }
  }, [user, loading, router]);

  return (
    <div className="container mx-auto px-4 py-8 bg-bg">
      <h1 className="text-2xl font-bold mb-6 text-text">Outfit History</h1>
      <div className="space-y-4">
        {outfits.map((outfit, index) => (
          <div key={outfit.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-2">
                <span className="text-xs text-white font-medium">
                  {index + 1}
                </span>
              </div>
              <span className="text-xs text-hint">
                {outfit.createdAt && outfit.createdAt.seconds
                  ? format(new Date(outfit.createdAt.seconds * 1000), "PPP")
                  : "Date unknown"}
              </span> 
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
    </div>
  );
}
