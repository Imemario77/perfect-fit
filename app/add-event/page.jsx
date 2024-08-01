"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  query,
  getCountFromServer,
} from "firebase/firestore";
import Link from "next/link";

function AddEventPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "events"), {
        name: eventName,
        date: eventDate,
        description: eventDescription,
        userRef: user.uid,
        createdAt: new Date(),
      });
      router.push("/events");
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Failed to add event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-sec-2">Error: {error.message}</div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-text">Add New Event</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-bg p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Event Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="eventName" className="block text-text mb-1">
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="eventDate" className="block text-text mb-1">
                Date
              </label>
              <input
                type="date"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="eventDescription"
                className="block text-text mb-1"
              >
                Description
              </label>
              <textarea
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primary text-bg py-2 px-4 rounded text-center hover:bg-sec-2 transition-colors duration-300 ease-in-out ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Adding Event..." : "Add Event"}
            </button>
          </form>
        </section>

        <section className="bg-bg p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Link
              href="/events"
              className="bg-sec-1 text-text py-2 px-4 rounded text-center hover:bg-sec-2 hover:text-bg transition-colors duration-300 ease-in-out"
            >
              Back to Events
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-200 text-text py-2 px-4 rounded text-center hover:bg-gray-300 transition-colors duration-300 ease-in-out"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AddEventPage;
