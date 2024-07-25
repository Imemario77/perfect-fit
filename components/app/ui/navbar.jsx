import Image from "next/image";
import Logo_img from "@/public/perfectfit_-logo-removebg-preview.png";
import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <div className="flex justify-between md:px-7 static bg-slate-300 items-center h-14 border-b border-black">
      <h2 className="tracking-[1.5px] font-[600] text-[30px] text-[#333] uppercase  ">
        Perfect Fit
      </h2>
    </div>
  );
}

export default Navbar;
