// components/OfflinePage.js
import React from "react";

export default function OfflinePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-radial from-primary to-bg">
      <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-sec-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-text mb-4">
          Oops! You're Offline
        </h1>
        <p className="text-lg text-hint mb-6">
          It looks like you've lost your internet connection. Don't worry, we'll
          be here when you're back online!
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
