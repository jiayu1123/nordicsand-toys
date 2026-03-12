import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGallery({ mainImage, galleryImages = [] }) {
  const allImages = [mainImage, ...galleryImages].filter(Boolean);
  const [selected, setSelected] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 flex items-center justify-center">
        <span className="text-7xl">🏖️</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-sky-50 to-cyan-50">
        <AnimatePresence mode="wait">
          <motion.img
            key={selected}
            src={allImages[selected]}
            alt="Product"
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                selected === i
                  ? "border-sky-400 shadow-md"
                  : "border-transparent hover:border-slate-200"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}