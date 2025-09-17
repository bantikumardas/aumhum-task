import React from "react";

export default function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="flex h-32 items-center justify-center">
        <div className="relative">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-400"></div>
        </div>
      </div>
    </div>
  );
}
