import React, { useEffect, useRef, useState } from "react";

export default function EnlargedView({
  images,
  startIndex,
  onClose,
  setSelectedIndex,
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50, scale: 2 });
  const [zindex, setZindex] = useState(0);
  const imageRef = useRef(null);
  const activeThumbRef = useRef(null);

  // Update index when startIndex changes (sync)
  useEffect(() => setIndex(startIndex), [startIndex]);

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
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  // Update parent selected index (sync)
  useEffect(() => setSelectedIndex(index), [index]);

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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onMouseDown={(e) => {
        if (e.target.classList.contains("fixed")) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl relative w-full max-w-5xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-50 bg-white rounded-full shadow p-2 text-gray-600 hover:bg-gray-100"
        >
          ✕
        </button>

        {/* Image container */}
        <div
          className="flex justify-center items-center h-[70vh] bg-black relative cursor-zoom-in"
          onClick={handleZoomClick}
        >
          <img
            ref={imageRef}
            src={current.large}
            alt={current.author}
            className={`z-${zindex} max-h-full max-w-full transition-transform duration-200`}
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
              className="z-10 absolute left-2 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/40 hover:bg-black/60"
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
              className="z-10 absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/40 hover:bg-black/60"
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
        <div className="flex justify-center p-2">Author: {current.author}</div>

        {/* Filmstrip */}
        <div className="flex overflow-x-auto mt-6 gap-2 px-4 max-w-[90vw]">
          {images.map((img, idx) => (
            <img
              key={img.id}
              ref={idx === index ? activeThumbRef : null}
              src={img.thumb}
              alt={img.author}
              onClick={() => setIndex(idx)}
              className={`h-20 cursor-pointer rounded border-2 ${
                idx === index
                  ? "border-blue-500"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
