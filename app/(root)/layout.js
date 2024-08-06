"use client";

import ConnectionStatus from "@/components/ConnectionStatus";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import OfflinePage from "@/components/OfflinePage";
import { auth, db } from "@/firebase/config";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import react, { useState, useEffect } from "react";

export default function RootLayout({ children }) {
  const isOnline = useOnlineStatus();
  const router = useRouter();
  let [user, loading, error] = useAuthState(auth);

  if (!isOnline) {
    return <OfflinePage />;
  }

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
    <main className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      {!loading && children}
      <Footer />
      <ConnectionStatus />
    </main>
  );
}
