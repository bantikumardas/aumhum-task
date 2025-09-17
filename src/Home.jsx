import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold text-indigo-600 mb-10"
      >
        Welcome to My App
      </motion.h1>

      <motion.div
        className="flex gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <button
          className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-indigo-500 hover:bg-indigo-600 text-white transition"
          onClick={() => navigate("/gallery")}
        >
          Image Gallery(Task 1)
        </button>

        <button
          className="px-6 py-3 text-lg rounded-2xl shadow-lg bg-pink-500 hover:bg-pink-600 text-white transition"
          onClick={() => navigate("/form")}
        >
          Basic Form (Task 2)
        </button>
      </motion.div>
    </div>
  );
}
