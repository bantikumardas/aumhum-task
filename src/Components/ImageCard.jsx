import React from "react";

export default function ImageCard({ image, onClick }) {
  return (
    <div
      className="relative rounded-lg overflow-hidden shadow-md cursor-pointer group"
      onClick={onClick}
    >
      <img
        src={image.thumb}
        alt={image.author}
        className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center">
        <span className="text-white text-sm font-medium p-2">
          {image.author}
        </span>
      </div>
    </div>
  );
}
