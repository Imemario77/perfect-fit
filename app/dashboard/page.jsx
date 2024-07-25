"use client";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

import { auth } from "@/firebase/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

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
        }, 100);
        async function getDocInfo() {
          try {
            const docSnap = await getDoc(doc(db, "userProfile", user.uid));

            if (!docSnap.exists()) {
              await setDoc(doc(db, "userProfile", user.uid), {
                userId: user.uid,
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
        getDocInfo();
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
    <div className="flex p-6">
      <h2 className="text-[24px]">
        Welcome to Perfect Fit, where style meets tech!
      </h2>
      <div>
        <Image />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Dashboard;
