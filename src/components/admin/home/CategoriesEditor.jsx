import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import Field from "./Field";

export default function CategoriesEditor({ form, setForm }) {
  const s = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const cats = form.categories || [];

  const updateCat = (i, key, val) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)),
    }));

  const addCat = () =>
    setForm((f) => ({ ...f, categories: [...f.categories, { name: "", emoji: "🎯", link: "/Products" }] }));

  const removeCat = (i) =>
    setForm((f) => ({ ...f, categories: f.categories.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Section Heading</h3>
        <Field label="Badge Label" value={form.categories_label} onChange={(v) => s("categories_label", v)} placeholder="Product Range" />
        <Field label="Section Title" value={form.categories_title} onChange={(v) => s("categories_title", v)} placeholder="Explore Our Collections" />
        <Field label="Section Description" value={form.categories_subtitle} onChange={(v) => s("categories_subtitle", v)} textarea placeholder="Description..." />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category Cards</h3>
          <Button variant="outline" size="sm" className="rounded-full gap-1 text-xs" onClick={addCat}>
            <Plus className="w-3 h-3" /> Add Category
          </Button>
        </div>
        {cats.map((cat, i) => (
          <div key={i} className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-600">Category {i + 1}</span>
              <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => removeCat(i)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Name" value={cat.name} onChange={(v) => updateCat(i, "name", v)} placeholder="Beach Bucket Sets" />
              <Field label="Emoji" value={cat.emoji} onChange={(v) => updateCat(i, "emoji", v)} placeholder="🪣" />
              <Field label="Link" value={cat.link} onChange={(v) => updateCat(i, "link", v)} placeholder="/Products?category=..." />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}