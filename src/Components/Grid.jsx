import React from "react";
import ImageCard from "./ImageCard";

export default function Grid({ images, onImageClick }) {
  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img, idx) => (
        <ImageCard key={img.id} image={img} onClick={() => onImageClick(idx)} />
      ))}
    </main>
  );
}
