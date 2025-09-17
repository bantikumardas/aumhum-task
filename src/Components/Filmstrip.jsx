import React, { useEffect, useRef } from "react";

export default function Filmstrip({ images, currentIndex, onSelect }) {
  const stripRef = useRef(null);

  useEffect(() => {
    const el = stripRef.current?.querySelector(".selected");
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [currentIndex]);

  return (
    <div
      ref={stripRef}
      className="flex gap-2 overflow-x-auto p-2 border-t border-gray-200"
    >
      {images.map((img, idx) => (
        <img
          key={img.id}
          src={`https://picsum.photos/id/${img.id}/160/100`}
          alt={img.author}
          onClick={() => onSelect(idx)}
          className={`h-20 w-32 object-cover rounded-md cursor-pointer border-2 ${
            idx === currentIndex
              ? "border-blue-500 scale-105"
              : "border-transparent opacity-75 hover:opacity-100"
          } transition`}
        />
      ))}
    </div>
  );
}
