"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: string;
  layout?: string;
}

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  width,
  height,
  layout,
  objectFit,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <div className={`relative`} style={{ width, height }}>
          <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        objectFit={objectFit}
        layout={layout}
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </>
  );
};
