"use client";

import { useEffect } from "react";
import OutfitGenerator from "@/components/OutfitGenerator";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

function GetOutFit() {
  let [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <OutfitGenerator user={user} />
    </main>
  );
}

export default GetOutFit;
