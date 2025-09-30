import React from "react";
import "./ImageCard.css";

export default function ImageCard({ image, onClick }) {
  return (
    <div className="image-card" onClick={onClick}>
      <img src={image.thumb} alt={image.author} loading="lazy" />
      <div className="overlay">
        <span>{image.author}</span>
      </div>
    </div>
  );
}
