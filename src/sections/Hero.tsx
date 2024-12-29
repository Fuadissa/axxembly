"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const navigate = useRouter();

  return (
    <section className="lg:py-10 py-4 overflow-x-clip">
      <div className="container relative">
        <div className="flex justify-center">
          <div className=" py-1 px-3 bg-gradient-to-r from-blue-600 to-purple-500 rounded-full text-white font-semibold text-sm md:text-base">
            ✨ Find, Share, and Reuse Code - Axxembly
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-medium text-center mt-6 lg:text-7xl lg:px-6">
          Discover, Share, and Reuse Code Effortlessly.
        </h1>
        <p className="text-center text-base dark:text-white/50 text-black/50 mt-8 max-w-2xl mx-auto">
          Axxembly is your go-to platform to find website&apos;s, components and
          app&apos;s code. Share and discover ready-to-use code for portfolios,
          e-commerce, buttons, and much more.
          <br />
          Have code? Help the community by sharing it now!
        </p>

        <div className="flex justify-center items-center mx-auto rounded-full p-2 max-w-lg mt-8">
          <Button
            type="submit"
            variant="secondary"
            className="rounded-full p-8 bg-black text-white dark:bg-white dark:text-black text-xl hover:bg-transparent hover:border-2 hover:border-black/50 hover:text-black dark:hover:bg-transparent dark:hover:border-white dark:hover:text-white"
            size="lg"
            onClick={() => navigate.push("/post-code")}
          >
            Post Now
          </Button>
        </div>
      </div>
    </section>
  );
}
