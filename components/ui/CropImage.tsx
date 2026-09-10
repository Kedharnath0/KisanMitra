"use client";

import React, { useState } from "react";
import { getCropInfo } from "@/lib/crop-images";

interface CropImageProps {
  crop: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CropImage({ crop, className = "", size = "md" }: CropImageProps) {
  const [hasError, setHasError] = useState(false);
  const info = getCropInfo(crop);

  const sizeClasses = {
    sm: "w-7 h-7 rounded-lg text-sm",
    md: "w-10 h-10 rounded-xl text-base",
    lg: "w-14 h-14 rounded-2xl text-xl",
  }[size];

  if (hasError) {
    return (
      <div
        className={`inline-flex items-center justify-center font-bold border shrink-0 ${sizeClasses} ${info.color} ${className}`}
        title={crop}
      >
        <span>{info.emoji}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden border border-km-neutral-200/80 bg-km-neutral-100 shrink-0 shadow-2xs ${sizeClasses} ${className}`}
    >
      <img
        src={info.image}
        alt={crop}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
