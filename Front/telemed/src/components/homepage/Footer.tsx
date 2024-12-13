"use client";
import React from "react";
/* import { usePathname } from "next/navigation"; */

const Footer = () => {
  /*   const path = usePathname(); */
  /* const isHomePage = path === "/"; */
  return (
    <>
      {/*  {isHomePage && ( */}
      <footer className="w-full bg-[#7c4bd8]">
        <div className="container mx-auto h-24 flex items-center justify-center">
          <p className="text-sm text-white">
            Copyright © 2024 Telemed | All Rights Reserved{" "}
          </p>
        </div>
      </footer>
      {/*      )} */}
    </>
  );
};

export default Footer;
