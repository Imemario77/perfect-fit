"use client";

import { auth } from "@/firebase/config";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Footer() {
  let [user, loading, error] = useAuthState(auth);

  let pathname = usePathname();

  if ((!user && pathname.includes("/login")) || pathname.includes("/signup")) {
    return null;
  }

  return (
    <footer className="bg-primary text-bg p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Perfect Fit, All rights reserved.</p>
      </div>
    </footer>
  );
}
