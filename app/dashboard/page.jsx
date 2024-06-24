"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

import { auth } from "@/firebase/config";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!sessionStorage.getItem("toastShown")) {
        sessionStorage.setItem("toastShown", true);
        // Delay the toast slightly to ensure component is mounted
        setTimeout(() => {
          toast.success("Login successful", {
            style: {
              fontSize: "10px",
            },
          });
          setToastShown(true);
        }, 100);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      Dashboard
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
