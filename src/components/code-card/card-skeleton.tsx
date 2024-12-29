import React from "react";
import { Skeleton } from "../ui/skeleton";
import { useMediaQuery } from "react-responsive";

export const CardSkeleton = () => {
  // Define breakpoints for responsiveness
  const isSmallScreen = useMediaQuery({ maxWidth: 640 }); // Small screens
  const isMediumScreen = useMediaQuery({ minWidth: 641, maxWidth: 1024 }); // Medium screens
  const isLargeScreen = useMediaQuery({ minWidth: 1025 }); // Large screens

  // Determine the number of cards based on screen size
  const numberOfCards = isSmallScreen
    ? 8
    : isMediumScreen
    ? 12
    : isLargeScreen
    ? 12
    : 12; // Default to 10 if no match

  return (
    <section className="lg:py-10 py-4 overflow-x-clip">
      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
          {Array.from({ length: numberOfCards }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-56 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
