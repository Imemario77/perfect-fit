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
import { useEffect } from "react";

export default function RootLayout({ children }) {
  const isOnline = useOnlineStatus();
  const router = useRouter();
  let [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (isOnline) {
      if (!loading) {
        if (!user) {
          router.push("/login");
        } else {
          async function hasOnboarded() {
            const userDoc = await getDoc(doc(db, "userProfile", user.uid));
            if (!userDoc.exists() || !userDoc.data().onboardingCompleted) {
              router.push("/onboarding");
            }
          }
          hasOnboarded();
        }
      }
    }
  }, [user, loading, router, isOnline]);

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <main className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        children
      )}
      <Footer />
      <ConnectionStatus />
    </main>
  );
}
