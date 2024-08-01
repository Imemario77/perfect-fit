"use client";

// pages/profile.js
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase/config";

function Profile() {
  let [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  let [userData, setUserData] = useState(null);
  let [totalItems, setTotalItems] = useState("fetching.....");

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

  const handleLogout = (e) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        toast.error("An error occured when trying to logout", {
          style: {
            fontSize: "10px",
          },
        });
        console.log(error);
      });
    // Here you would typically send the updated user data to your backend
    console.log("Updated user data:", user);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-6">
          <Image
            src={
              userData?.imageUrl ||
              "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt={userData?.name}
            width={100}
            height={100}
            className="rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-semibold">{userData?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        <section>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData?.name}
              disabled={true}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="age"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={userData?.age}
              disabled={true}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hover:bg-white hover:text-sec-2 py-2 px-4 rounded ml-3 bg-sec-2 text-bg transition-colors"
          >
            Log out
          </button>
        </section>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Wardrobe Statistics</h2>{" "}
        <p className="text-lg mb-2">
          Total Items: <span className="font-bold">{totalItems}</span>
        </p>
      </div>
    </main>
  );
}

export default Profile;
