"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

type LeaderAvatarProps = {
  src: string;
  alt: string;
  initials: string;
  className?: string;
};

export function LeaderAvatar({ src, alt, initials, className = "" }: LeaderAvatarProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-700 ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`h-12 w-12 rounded-full border border-slate-200 object-cover ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
