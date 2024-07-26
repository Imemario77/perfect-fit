"use client";

import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

function Dashboard() {
  let [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  user = {
    name: "Alex Johnson",
    totalItems: 87,
    recentOutfits: [
      {
        id: 1,
        date: "2024-07-24",
        image:
          "https://cdn2.unrealengine.com/01-fnbr-30-00-3480x2160-3840x2160-1135c6e482bb.jpg",
      },
      {
        id: 2,
        date: "2024-07-23",
        image:
          "data:image/jpeg;base64,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",
      },
      { id: 3, date: "2024-07-22", image: "/images/outfit3.jpg" },
    ],
    upcomingEvents: [
      { id: 1, name: "Business Meeting", date: "2024-07-26" },
      { id: 2, name: "Friend's Wedding", date: "2024-07-30" },
    ],
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user.name}!</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Wardrobe Overview</h2>
          <p className="text-lg mb-2">
            Total Items: <span className="font-bold">{user.totalItems}</span>
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
            {user.recentOutfits.map((outfit) => (
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

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
          <ul className="space-y-2">
            {user.upcomingEvents.map((event) => (
              <li key={event.id} className="flex justify-between items-center">
                <span>{event.name}</span>
                <span className="text-gray-600">{event.date}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/events"
            className="block mt-4 text-primary hover:underline"
          >
            Manage events
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
