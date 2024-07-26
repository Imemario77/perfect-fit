"use client";

import { useEffect } from "react";
import OutfitGenerator from "@/components/OutfitGenerator";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

function GetOutFit() {
  let [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      async function hasOnboarded() {
        const userDoc = await getDoc(doc(db, "userProfile", user.uid));
        if (!userDoc.exists() || !userDoc.data().onboardingCompleted) {
          router.push("/onboarding");
        }
      }
      hasOnboarded();
    }
  }, [user, loading, router]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <OutfitGenerator user={user} />
    </main>
  );
}

export default GetOutFit;
