"use client";

import Link from "next/link";
import React from "react";
import { FaCamera } from "react-icons/fa6";
import { BiCloset } from "react-icons/bi";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

function Sidebar() {
  return (
    <div className="flex md:flex-col gap-4 md:h-full bg-slate-300 md:w-40 md:relative fixed h-[100px] bottom-0 w-full justify-evenly md:justify-start">
      <Tippy
        content="Upload your cloth to your virtual wardrobe"
        placement="left"
      >
        <Link
          href="/"
          className="mt-4 flex gap-3 items-center hover:bg-slate-500 p-2 flex-col md:flex-row text-center"
        >
          <FaCamera className="text-[40px] md:text-lg" />
          <span>Upload item</span>
        </Link>
      </Tippy>

      <Tippy content="Take a look at your virtual wardrobe" placement="left">
        <Link
          href="/"
          className="mt-4 flex gap-3 items-center hover:bg-slate-500 p-2 flex-col md:flex-row text-center"
        >
          <BiCloset className="text-[100px] md:text-lg" />
          <span>My Wardrobe</span>
        </Link>
      </Tippy>

      <Tippy
        content="Let your wardrobe ai pick something for you to wear"
        placement="left"
      >
        <Link
          href="/"
          className="mt-4 flex gap-3 items-center hover:bg-slate-500 p-2 flex-col md:flex-row text-center"
        >
          <FaWandMagicSparkles className="text-[80px] md:text-lg" />
          <span>AI Suggest</span>
        </Link>
      </Tippy>
      <Tippy content="Set up your account" placement="left">
        <Link
          href="/"
          className="mt-4 flex gap-3 items-center hover:bg-slate-500 p-2 flex-col md:flex-row text-center"
        >
          <FaGear className="md:text-lg" />
          <span>Setting</span>
        </Link>
      </Tippy>
    </div>
  );
}

export default Sidebar;
