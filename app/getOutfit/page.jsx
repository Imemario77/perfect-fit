"use client";

import { useEffect, useState } from "react";
import OutfitGenerator from "@/components/OutfitGenerator";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

function GetOutFit() {
  let [user, loading, error] = useAuthState(auth);
  let [userData, setUserData] = useState();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      async function hasOnboarded() {
        const userDoc = await getDoc(doc(db, "userProfile", user.uid));
        if (!userDoc.exists() || !userDoc.data().onboardingCompleted) {
          router.push("/onboarding");
        } else {
          setUserData(userDoc.data());
        }
      }
      hasOnboarded();
    }
  }, [user, loading, router]);

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
      <OutfitGenerator user={userData} />
    </main>
  );
}

export default GetOutFit;
