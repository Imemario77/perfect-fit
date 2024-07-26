import Image from "next/image";
import Link from "next/link";
import Hero from "@/public/hero 1.png";
import Hero2 from "@/public/hero 2.png";

export default function Home() {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Welcome to Perfect Fit</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your personal stylist powered by artificial intelligence
        </p>
        <Link
          href="/get-outfit"
          className="bg-primary text-bg py-3 px-6 rounded-full text-lg font-semibold hover:bg-sec-2 transition-colors"
        >
          Get Started
        </Link>
      </section>

      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-4">Manage Your Wardrobe</h2>
          <p className="mb-4 text-gray-600">
            Digitize your closet with ease. Add, categorize, and organize your
            clothing items in one place.
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-600">
            <li>Quick and easy item entry</li>
            <li>Automatic categorization</li>
            <li>Track wear frequency</li>
          </ul>
          <Link
            href="/wardrobe"
            className="bg-sec-1 text-text py-2 px-4 rounded hover:bg-sec-2 hover:text-bg transition-colors"
          >
            Explore My Wardrobe
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <Image
            src={Hero}
            alt="Wardrobe Management"
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="flex items-center justify-center order-2 md:order-1">
          <Image
            src={Hero2}
            alt="Outfit Suggestion"
            width={400}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md order-1 md:order-2">
          <h2 className="text-3xl font-semibold mb-4">
            AI-Powered Outfit Suggestions
          </h2>
          <p className="mb-4 text-gray-600">
            Let our advanced AI analyze your wardrobe and suggest the perfect
            outfit for any occasion.
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-600">
            <li>Contextual suggestions based on weather and events</li>
            <li>Learn from your preferences over time</li>
            <li>Mix and match for endless combinations</li>
          </ul>
          <Link
            href="/get-outfit"
            className="bg-sec-1 text-text py-2 px-4 rounded hover:bg-sec-2 hover:text-bg transition-colors"
          >
            Get an Outfit
          </Link>
        </div>
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl font-semibold mb-4">Why Choose Perfect Fit?</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Save Time</h3>
            <p className="text-gray-600">
              Spend less time deciding what to wear and more time looking great.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Personalized Style</h3>
            <p className="text-gray-600">
              Get suggestions tailored to your unique style and preferences.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Outfit Calendar</h3>
            <p className="text-gray-600">
              Plan your outfits ahead and never repeat the same look too soon.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to revolutionize your wardrobe?
        </h2>
        <Link
          href="/get-started"
          className="bg-primary text-bg py-3 px-6 rounded-full text-lg font-semibold hover:bg-sec-2 transition-colors inline-block"
        >
          Get Started Now
        </Link>
      </section>
    </main>
  );
}
