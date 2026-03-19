import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, BookOpen, Eye, EyeOff } from "lucide-react";
import Field from "./Field";

export default function SlideEditor({ form, setForm }) {
  const slides = form.hero_slides || [];

  // Fetch all published stories to pick from
  const { data: stories = [] } = useQuery({
    queryKey: ["news-all-for-slides"],
    queryFn: () => base44.entities.News.filter({ status: "published" }, "-publish_date", 50),
  });

  const update = (i, key, val) =>
    setForm((f) => ({
      ...f,
      hero_slides: f.hero_slides.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)),
    }));

  const add = () =>
    setForm((f) => ({
      ...f,
      hero_slides: [
        ...f.hero_slides,
        { story_id: "", sort_order: f.hero_slides.length, enabled: true, button_text: "" },
      ],
    }));

  const remove = (i) =>
    setForm((f) => ({ ...f, hero_slides: f.hero_slides.filter((_, idx) => idx !== i) }));

  const moveUp = (i) => {
    if (i === 0) return;
    setForm((f) => {
      const arr = [...f.hero_slides];
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      return { ...f, hero_slides: arr.map((s, idx) => ({ ...s, sort_order: idx })) };
    });
  };

  const moveDown = (i) => {
    setForm((f) => {
      if (i >= f.hero_slides.length - 1) return f;
      const arr = [...f.hero_slides];
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      return { ...f, hero_slides: arr.map((s, idx) => ({ ...s, sort_order: idx })) };
    });
  };

  const storyMap = Object.fromEntries(stories.map((s) => [s.id, s]));

  return (
    <div className="space-y-5">
      <div className="p-4 bg-sky-50 rounded-xl text-sm text-sky-700 leading-relaxed">
        <strong>How it works:</strong> Link each slide to a published Story. The carousel will automatically display that Story's cover image, title, and excerpt — no duplicate editing needed. Use the order controls to set which Story appears first.
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{slides.length} slide{slides.length !== 1 ? "s" : ""} configured</p>
        <Button variant="outline" size="sm" className="rounded-full gap-1 text-xs" onClick={add}>
          <Plus className="w-3 h-3" /> Add Slide
        </Button>
      </div>

      {slides.length === 0 && (
        <div className="py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-2xl">
          <BookOpen className="w-8 h-8 mx-auto mb-3 text-slate-300" />
          No slides yet. Add a slide and link it to a Story.
        </div>
      )}

      {slides.map((slide, i) => {
        const linked = storyMap[slide.story_id];
        return (
          <div
            key={i}
            className={`border rounded-2xl p-5 space-y-4 transition-colors ${slide.enabled !== false ? "border-slate-200 bg-slate-50/50" : "border-slate-100 bg-slate-50 opacity-60"}`}
          >
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="text-slate-300 hover:text-slate-500 disabled:opacity-20 text-xs leading-none"
                    title="Move up"
                  >▲</button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === slides.length - 1}
                    className="text-slate-300 hover:text-slate-500 disabled:opacity-20 text-xs leading-none"
                    title="Move down"
                  >▼</button>
                </div>
                <GripVertical className="w-4 h-4 text-slate-300" />
                <span className="text-xs font-semibold text-slate-600">Slide {i + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => update(i, "enabled", slide.enabled === false ? true : false)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${slide.enabled !== false ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}
                >
                  {slide.enabled !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {slide.enabled !== false ? "Visible" : "Hidden"}
                </button>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => remove(i)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Story picker */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-medium">Linked Story</label>
              <select
                value={slide.story_id || ""}
                onChange={(e) => update(i, "story_id", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">— Select a Story —</option>
                {stories.map((story) => (
                  <option key={story.id} value={story.id}>
                    {story.title} {story.category ? `(${story.category})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview of linked story */}
            {linked ? (
              <div className="flex gap-4 items-start p-3 bg-white rounded-xl border border-slate-200">
                {linked.cover_image && (
                  <img src={linked.cover_image} alt="" className="w-24 h-16 object-cover rounded-lg shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{linked.title}</p>
                  {linked.excerpt && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{linked.excerpt}</p>
                  )}
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 text-[10px] font-medium">
                    {linked.category}
                  </span>
                </div>
              </div>
            ) : slide.story_id ? (
              <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">⚠ Story not found. It may have been deleted or unpublished.</p>
            ) : (
              <p className="text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-xl">No Story linked — this slide will not be shown in the carousel.</p>
            )}

            {/* Optional custom button text */}
            <Field
              label="Custom Button Text (optional)"
              value={slide.button_text || ""}
              onChange={(v) => update(i, "button_text", v)}
              placeholder='Defaults to "Read the Story"'
            />
          </div>
        );
      })}
    </div>
  );
}