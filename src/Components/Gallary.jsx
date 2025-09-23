import React, { useEffect, useState } from "react";
import { fetchPicsumList } from "../api/picsumApi";
import Grid from "./Grid";
import EnlargedView from "./EnlargedView";
import { motion } from "framer-motion";
import Spinner from "./Spinner";

function Gallary() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

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
        setImages(mapped);
      })
      .finally(() => setLoading(false));
  }, [page, limit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="relative text-center py-6">
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to Banti’s Gallery
        </motion.h1>
      </header>

      {/* Main Section */}
      {loading ? (
        <Spinner></Spinner>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Grid images={images} onImageClick={(i) => setSelectedIndex(i)} />
          </motion.div>

          {/* Pagination Controls */}
          <motion.div
            className="flex justify-center items-center gap-4 my-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-lg disabled:bg-gray-300 transition"
            >
              Previous
            </button>

            {/* Dropdown for selecting limit */}
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // reset to page 1 when limit changes
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-400 text-gray-700"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>

            <span className="text-gray-700 font-medium">Page {page}</span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={images.length < limit}
              className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white shadow-lg disabled:bg-gray-300 transition"
            >
              Next
            </button>
          </motion.div>

          {/* Enlarged View */}
          {selectedIndex !== null && (
            <EnlargedView
              images={images}
              startIndex={selectedIndex}
              onClose={() => setSelectedIndex(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Gallary;
