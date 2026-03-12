import React from "react";
import { useCategories } from "../shared/useCategories";

export default function CategoryFilter({ selected, onSelect }) {
  const { categories: dynamicCats } = useCategories();
  const categories = ["All", ...dynamicCats];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selected === cat
              ? "bg-slate-800 text-white shadow-md"
              : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}