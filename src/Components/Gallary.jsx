import React, { useEffect, useState, useRef } from "react";
import { fetchPicsumList } from "../api/picsumApi";
import Grid from "./Grid";
import EnlargedView from "./EnlargedView";

function Gallary() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const lastRef = useRef(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    setLoading(true);
    fetchPicsumList(page, limit)
      .then((data) => {
        const mapped = data.map((img) => ({
          id: img.id,
          author: img.author,
          thumb: `https://picsum.photos/id/${img.id}/400/300`,
          large: `https://picsum.photos/id/${img.id}/1200/800`,
        }));

        setImages((images) => {
          images.push(...mapped);
          return [...images];
        });
      })
      .finally(() => setLoading(false));
  }, [page, limit]);

  useEffect(() => {
    window.addEventListener("scroll", (event) => {
      console.log(lastRef);
      if (
        //
        lastRef.current.offsetHeight - (window.innerHeight + window.scrollY) <
        50
      ) {
        setPage((p) => p + 1);
      }
    });
  }, []);

  // console.log(window.innerHeight + window.scrollY);
  // const text = lastRef === null ? "" : lastRef.current.offsetHeight;
  console.log(lastRef?.current?.offsetHeight, "height");
  return (
    <div className="gallery-container">
      <>
        <div ref={lastRef}>
          <Grid images={images} onImageClick={(i) => setSelectedIndex(i)} />
        </div>

        {/* Enlarged View */}
        {selectedIndex !== null && (
          <EnlargedView
            images={images}
            startIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </>
    </div>
  );
}

export default Gallary;
