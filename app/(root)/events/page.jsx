"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

function EventsPage() {
  const [user, loading, error] = useAuthState(auth);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    const eventsQuery = query(
      collection(db, "events"),
      where("userRef", "==", user.uid)
    );
    const eventsSnapshot = await getDocs(eventsQuery);
    const eventsList = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEvents(eventsList);
  };

  if (error) {
    return (
      <div className="text-center p-8 text-sec-2">Error: {error.message}</div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-text">Upcoming Events</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-bg p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Event List
          </h2>
          {events.length > 0 ? (
            <ul className="space-y-4">
              {events.map((event) => (
                <li key={event.id} className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-text">
                    {event.name}
                  </h3>
                  <p className="text-hint">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-text mt-2">{event.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-hint">No upcoming events.</p>
          )}
        </section>

        <section className="bg-bg p-6 rounded-lg shadow-md transition-shadow hover:shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-primary">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/add-event"
              className="bg-primary text-bg py-2 px-4 rounded text-center hover:bg-sec-2 transition-colors duration-300 ease-in-out"
            >
              Add Event
            </Link>
            <Link
              href="/dashboard"
              className="bg-sec-1 text-text py-2 px-4 rounded text-center hover:bg-sec-2 hover:text-bg transition-colors duration-300 ease-in-out"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EventsPage;
