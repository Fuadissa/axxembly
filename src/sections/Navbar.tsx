"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { ModeToggle } from "@/components/ui/ModeToggle";

const navLinks = [
  { label: "Github", href: "https://github.com/Fuadissa" },
  { label: "X (Twitter)", href: "https://x.com/Ox_crypto_F" },
  { label: "LinkedIn", href: "" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="py-4 lg:py-8 fixed w-full top-0 z-50">
        <div className="container max-w-5xl">
          <div className="border border-black/50 dark:border-white/15 rounded-[27px] md:rounded-full backdrop-blur dark:bg-neutral-950/70 bg-transparent ">
            <div className="grid grid-cols-2 md:grid-cols-3 px-4 items-center p-2">
              <div>
                <span
                  className="text-4xl pl-3 text-stroke-black dark:text-stroke-white"
                  style={{
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Axxembly
                </span>
              </div>

              <div className="md:flex justify-center items-center hidden">
                <nav className="flex gap-6 font-medium">
                  {navLinks.map((link) => (
                    <a href={link.href} key={link.label} target="_blank">
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex justify-end gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-menu md:hidden"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <line
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"
                    className={twMerge(
                      "origin-left transition",
                      isOpen && "rotate-45 -translate-y-1"
                    )}
                  ></line>
                  <line
                    x1="3"
                    y1="12"
                    x2="21"
                    y2="12"
                    className={twMerge("transition", isOpen && "opacity-0")}
                  ></line>
                  <line
                    x1="3"
                    y1="18"
                    x2="21"
                    y2="18"
                    className={twMerge(
                      "origin-left transition",
                      isOpen && "-rotate-45 translate-y-1"
                    )}
                  ></line>
                </svg>
                <ModeToggle className="hidden md:inline-flex" />
              </div>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col items-center gap-4 py-4">
                    {navLinks.map((navLink) => (
                      <a href={navLink.href} key={navLink.label} className="">
                        {navLink.label}
                      </a>
                    ))}
                    <ModeToggle />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <div className="pb-[86px] md:pb-[98px] lg:pb-[130px]"></div>
    </>
  );
}
