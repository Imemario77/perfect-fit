"use client"

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-bg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Perfect Fit
        </Link>

        {/* Hamburger menu for mobile */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop menu */}
        <ul className="hidden lg:flex space-x-4">
          <li>
            <Link href="/" className="hover:text-sec-1">
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:text-sec-1">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/wardrobe" className="hover:text-sec-1">
              My Wardrobe
            </Link>
          </li>
          <li>
            <Link href="/getOutfit" className="hover:text-sec-1">
              Get Outfit
            </Link>
          </li>
          <li>
            <Link href="/addItem" className="hover:text-sec-1">
              Add Item
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden mt-4 mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <ul className="flex flex-col space-y-2">
          <li>
            <Link href="/" className="block hover:text-sec-1">
              Home
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="block hover:text-sec-1">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/wardrobe" className="block hover:text-sec-1">
              My Wardrobe
            </Link>
          </li>
          <li>
            <Link href="/getOutfit" className="block hover:text-sec-1">
              Get Outfit
            </Link>
          </li>
          <li>
            <Link href="/addItem" className="block hover:text-sec-1">
              Add Item
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
