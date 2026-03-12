import { useState, useCallback, useEffect } from "react";

const DEFAULT_CATEGORIES = [
  "Beach Bucket Sets",
  "Sand Molds",
  "Water Play Toys",
  "Beach Tools",
  "Play Sets",
  "New Arrivals",
];

const STORAGE_KEY = "sp_custom_categories";

function getStored() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

export function useCategories() {
  const [custom, setCustom] = useState(getStored);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        try { setCustom(JSON.parse(e.newValue || "[]")); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const all = [...new Set([...DEFAULT_CATEGORIES, ...custom])];

  const addCategory = useCallback((cat) => {
    const stored = getStored();
    if (stored.includes(cat)) return;
    const next = [...stored, cat];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCustom(next);
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(next) }));
  }, []);

  return { categories: all, addCategory };
}