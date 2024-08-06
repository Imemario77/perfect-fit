"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/config";
import { getMessaging } from "firebase/messaging/sw";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getToken, isSupported } from "firebase/messaging";
import axios from "axios";

function Dashboard() {
  let [user, loading, error] = useAuthState(auth);
  let [userData, setUserData] = useState(null);
  let [totalItems, setTotalItems] = useState("fetching.....");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      async function hasOnboarded() {
        const userDoc = await getDoc(doc(db, "userProfile", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());

          const galleryQuery = query(
            collection(db, "gallery"),
            where("userRef", "==", user.uid)
          );
          const gallerySnapshot = await getCountFromServer(galleryQuery);
          setTotalItems(gallerySnapshot.data().count);
        }
      }
      hasOnboarded();
    }
  }, [user, loading, router]);

  useEffect(() => {
    function requestPermission() {
      console.log("Requesting permission...");
      typeof Notification !== "undefined" &&
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted.");
          }
        });
    }
    const enableNotification = async () => {
      // Get registration token. Initially this makes a network call, once retrieved
      // subsequent calls to getToken will return from cache.

      if (await isSupported()) {
        if (userData) {
          const messaging =
            typeof window !== "undefined" ? getMessaging() : null;
          getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY })
            .then(async (currentToken) => {
              if (currentToken) {
                if (
                  userData.fmcToken &&
                  userData.fmcToken.includes(currentToken)
                ) {
                  console.log("token exist");
                } else {
                  if (Array.isArray(userData.fmcToken)) {
                    await setDoc(
                      doc(db, "userProfile", user.uid),
                      {
                        fmcToken: [...userData.fmcToken, currentToken],
                      },
                      { merge: true }
                    );
                  } else {
                    await setDoc(
                      doc(db, "userProfile", user.uid),
                      {
                        fmcToken: [currentToken],
                      },
                      { merge: true }
                    );
                  }

                  const subscribeToNotification = await axios.post(
                    "/api/v1/notification",
                    {
                      token: currentToken,
                    }
                  );

                  console.log(subscribeToNotification.data);
                }
              } else {
                // Show permission request UI
                console.log(
                  "No registration token available. Request permission to generate one."
                );
                // ...
              }
            })
            .catch((err) => {
              console.log("An error occurred while retrieving token. ", err);
              // ...
            });
        }
      }
    };
    requestPermission();
    enableNotification();
  }, [userData]);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Welcome back, {userData?.name}!
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Wardrobe Overview</h2>
          <p className="text-lg mb-2">
            Total Items: <span className="font-bold">{totalItems}</span>
          </p>
          <Link href="/wardrobe" className="text-primary hover:underline">
            Manage your wardrobe
          </Link>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/getOutfit"
              className="bg-primary text-bg py-2 px-4 rounded text-center hover:bg-sec-2 transition-colors"
            >
              Get Outfit
            </Link>
            <Link
              href="/addItem"
              className="bg-sec-1 text-text py-2 px-4 rounded text-center hover:bg-sec-2 hover:text-bg transition-colors"
            >
              Add Item
            </Link>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Recent Outfits</h2>
          <div className="grid grid-cols-3 gap-4">
            {userData?.recentOutfits?.map((outfit) => (
              <div key={outfit.id} className="text-center">
                <Image
                  src={outfit.image}
                  alt={`Outfit on ${outfit.date}`}
                  width={100}
                  height={100}
                  className="rounded-lg mx-auto"
                />
                <p className="mt-2 text-sm">{outfit.date}</p>
              </div>
            ))}
          </div>
          <Link
            href="/outfit-history"
            className="block mt-4 text-primary hover:underline"
          >
            View all outfits
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
