"use client";

import technologies from "@/lib/technologies";
import Link from "next/link";
import React from "react";
import { ImageWithSkeleton } from "../imagewithskeleton";
import { useTheme } from "next-themes";

interface CodeCardProps {
  post: {
    _id: string;
    title: string;
    description: string;
    technologies: string[];
    screenshots: string[];
    username: string;
  }; // This will be the data for a single code post
}

export const CodeCard = ({ post }: CodeCardProps) => {
  const { theme, resolvedTheme } = useTheme();

  return (
    <>
      <Link href={`/code/${post._id}`} className="overflow-hidden">
        <div className="relative w-full h-56 rounded-lg overflow-hidden shadow-md">
          <ImageWithSkeleton
            src={`${post.screenshots[0]}`}
            alt="Placeholder"
            width={800}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>

        {/* <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-50"></div> */}
        <div className="p-3">
          <h3 className="text-lg font-bold w-[80%] truncate">{post.title}</h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm w-1/2 truncate">{post.username}</p>
            <div className="flex items-center gap-1 justify-end">
              {post.technologies.map((techName, index) => {
                // Find the technology object from the `technologies` array
                const tech = technologies.find(
                  (t) => t.name.toLowerCase() === techName.toLowerCase()
                );
                return tech ? (
                  <tech.icon
                    key={index} // Use index as key here since we are rendering icons
                    style={{
                      color:
                        (theme === "dark" || resolvedTheme === "dark") &&
                        tech.color === "#000000"
                          ? "white"
                          : tech.color,
                    }}
                    size={20}
                  />
                ) : null; // If no match, do not render anything
              })}

              {/* Show "..." only if there are more than 3 technologies */}
              {post.technologies.length > 3 && (
                <span className="text-lg">...</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};
