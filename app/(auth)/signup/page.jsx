"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

import { lato_7 } from "@/fonts/font";
import Logo_img from "@/public/perfectfit -logo.jpg";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { authWithGoogle } from "@/lib/googleAuth";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const signUp = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return toast.error("The password must be greater that 6 characters", {
        style: {
          fontSize: "10px",
        },
      });
    }
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
          console.log(user);
          return toast.success("login sucessful", {
            style: {
              fontSize: "10px",
            },
          });
        })
        .catch((err) => {
          return toast.error(err.message, {
            style: {
              fontSize: "10px",
            },
          });
        });
    } catch (error) {
      console.log(error);
      return toast.error(error.message, {
        style: {
          fontSize: "10px",
        },
      });
    }
  };

  const signUpWithGoogle = async () => {
    try {
      await authWithGoogle(auth);
    } catch (error) {
      return toast.error(error.message, {
        style: {
          fontSize: "10px",
        },
      });
    }
  };

  return (
    <div className={lato_7.className}>
      <div className="w-full h-full bg-[#F7F7F7] overflow-hidden  flex md:flex-row flex-col">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%", rotateZ: 360 }}
          className="h-[100vh] flex-1 flex justify-center items-center md:order-1"
        >
          <Image
            src={Logo_img}
            className="md:w-full md:h-full self-start"
            alt="App logo"
          />
        </motion.div>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "0%", rotateZ: 360 }}
          className="h-[100vh] flex-1 w-full flex justify-center items-center px-5 flex-col"
        >
          <form className="md:w-[70%] w-full h-fit flex flex-col gap-4 md:p-9">
            <h3 className="self-center pb-3 md:text-[50px] text-[25px] text-hint">
              SIGN UP
            </h3>
            <input
              className="px-2 py-3 text-sm border-hint border-2 focus:outline-none focus:border-primary invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-500 peer"
              placeholder="Email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="invisible peer-invalid:visible text-pink-600 text-[10px]">
              Please provide a valid email address.
            </p>
            <input
              className="px-2 py-3 text-sm border-hint border-2  focus:outline-none focus:border-primary"
              placeholder="Password"
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={signUp}
              className="px-2 py-3 text-xl bg-primary text-bg hover:bg-[#2878BD]"
            >
              SUBMIT
            </button>
          </form>
          <Link href="/login" className="my-2 text-[15px] text-primary">
            Already have an account
          </Link>
          <span className="my-2 text-[15px] text-primary">Or</span>
          <FcGoogle
            className="mt-2 mb-10"
            title="SignUp with google"
            size={30}
            onClick={signUpWithGoogle}
          />
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;
