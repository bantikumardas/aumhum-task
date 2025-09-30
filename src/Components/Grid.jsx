import React from "react";
import ImageCard from "./ImageCard";
import "./Grid.css";

export default function Grid({ images, onImageClick }) {
  return (
    <main className="grid-container">
      {images.map((img, idx) => (
        <ImageCard key={img.id} image={img} onClick={() => onImageClick(idx)} />
      ))}
    </main>
  );
}
