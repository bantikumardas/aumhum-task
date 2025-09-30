import React, { useEffect, useRef, useState } from "react";
import "./EnlargedView.css";

export default function EnlargedView({ images, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50, scale: 2 });
  const [zindex, setZindex] = useState(0);
  const imageRef = useRef(null);
  const activeThumbRef = useRef(null);

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : i));
  const next = () => setIndex((i) => (i < images.length - 1 ? i + 1 : i));

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    // Cleanup function runs when component unmounts
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const handleZoomClick = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    if (!zoom.active) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoom({ active: true, x, y, scale: 2.2 });
    } else {
      setZoom({ ...zoom, active: false });
    }
    setZindex(zindex == 0 ? 50 : 0);
  };

  const current = images[index];

  // Preload next and previous images
  useEffect(() => {
    if (!images || images.length === 0) return;
    if (images[index + 1]) new Image().src = images[index + 1].large;
    if (images[index - 1]) new Image().src = images[index - 1].large;
  }, [index, images]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [index]);

  return (
    <div
      className="enlarged-overlay"
      onMouseDown={(e) => {
        if (e.target.classList.contains("enlarged-overlay")) onClose();
      }}
    >
      <div className="enlarged-modal">
        {/* Close button */}
        <button onClick={onClose} className="close-btn">
          ✕
        </button>

        {/* Image container */}
        <div className="image-container" onClick={handleZoomClick}>
          <img
            ref={imageRef}
            src={current.large}
            alt={current.author}
            className="enlarged-image"
            style={
              zoom.active
                ? {
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    transform: `scale(${zoom.scale})`,
                    cursor: "zoom-out",
                  }
                : { transform: "scale(1)" }
            }
          />

          {/* Previous Overlay Button */}
          {index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="nav-btn left-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-12 h-12 z-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 4.5l-7.5 7.5 7.5 7.5"
                />
              </svg>
            </button>
          )}

          {/* Next Overlay Button */}
          {index < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="nav-btn right-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-12 h-12 z-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Author info and navigation */}
        <div className="author">Author: {current.author}</div>

        {/* Filmstrip */}
        <div className="thumbnail-strip">
          {images.map((img, idx) => (
            <img
              key={img.id}
              ref={idx === index ? activeThumbRef : null}
              src={img.thumb}
              alt={img.author}
              onClick={() => setIndex(idx)}
              className={`thumbnail ${idx === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
