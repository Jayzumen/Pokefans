"use client";

import React, { useState } from "react";
import Link from "next/link";
import { dexLinks } from "@/assets/constants";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="absolute top-0 z-10 flex h-24 w-full items-center justify-between bg-transparent px-4 text-center text-white shadow-md shadow-black md:px-10">
      <Link href={"/"} className="text-3xl font-extrabold underline">
        Pokéfans
      </Link>

      <ul className="hidden md:mr-16 md:justify-center md:gap-6 lg:flex">
        <li className="text-lg font-bold transition hover:underline">
          <Link href="/teams">Teams</Link>
        </li>

        <li className="text-lg font-bold transition">
          <button
            type="button"
            aria-label="open/close dropdown menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative z-10 hover:underline"
          >
            Dex-Menu
          </button>
          {dropdownOpen && (
            <ul className="absolute mt-2 hidden bg-transparent shadow-md shadow-black md:block">
              {dexLinks.map((link) => (
                <li key={link.id} className="bg-slate-800">
                  <Link
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    href={link.path}
                    className="text-md block p-2 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>

      <button
        type="button"
        aria-label="open/close navbar"
        onClick={() => setNav(!nav)}
        className="z-10 cursor-pointer pr-4 lg:hidden"
      >
        {!nav && <GiHamburgerMenu className="h-8 w-8" />}
      </button>

      {nav && (
        <div className="relative">
          <button
            type="button"
            aria-label="open/close navbar"
            onClick={() => setNav(!nav)}
            className="absolute top-0 right-0 z-50 cursor-pointer pr-4"
          >
            {nav && <FaTimes className="h-8 w-8" />}
          </button>
          <ul
            className="fixed top-0 left-0 z-10 flex h-full w-full flex-col items-center overflow-hidden
           bg-slate-900 pt-20 sm:pt-44"
          >
            <li className="my-4 mx-6 cursor-pointer text-4xl capitalize transition hover:underline">
              <Link onClick={() => setNav(!nav)} href="/" className="m-0 p-0">
                Home
              </Link>
            </li>
            <li className="my-4 mx-6 cursor-pointer text-4xl capitalize transition hover:underline">
              <Link
                onClick={() => setNav(!nav)}
                href="/teams"
                className="m-0 p-0"
              >
                Teams
              </Link>
            </li>

            <li className="mt-2 text-4xl transition">
              <button
                type="button"
                aria-label="open/close dropdown menu"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative z-10 hover:underline"
              >
                Dex-Menu
              </button>
              {nav && dropdownOpen && (
                <ul className="absolute bg-slate-800 text-2xl shadow-md shadow-black">
                  {dexLinks.map((link) => (
                    <li key={link.id} className="">
                      <Link
                        onClick={() => {
                          setDropdownOpen(!dropdownOpen);
                          setNav(!nav);
                        }}
                        href={link.path}
                        className="block p-2 hover:underline"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
