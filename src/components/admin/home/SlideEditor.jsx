import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import Field from "./Field";

export default function SlideEditor({ form, setForm }) {
  const slides = form.hero_slides || [];

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
        { image: "", badge: "", headline: "", subheadline: "", button_text: "Learn More", button_link: "/", dark_text: true, sort_order: f.hero_slides.length, enabled: true },
      ],
    }));

  const remove = (i) =>
    setForm((f) => ({ ...f, hero_slides: f.hero_slides.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">Slides are shown in sort order. Disabled slides are hidden.</p>
        <Button variant="outline" size="sm" className="rounded-full gap-1 text-xs" onClick={add}>
          <Plus className="w-3 h-3" /> Add Slide
        </Button>
      </div>

      {slides.map((slide, i) => (
        <div key={i} className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-slate-300" />
              <span className="text-xs font-semibold text-slate-600">Slide {i + 1}</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={slide.enabled !== false}
                  onChange={(e) => update(i, "enabled", e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-slate-500">Enabled</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={slide.dark_text === true}
                  onChange={(e) => update(i, "dark_text", e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-slate-500">Dark Overlay</span>
              </label>
            </div>
            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => remove(i)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Field label="Background Image URL" value={slide.image} onChange={(v) => update(i, "image", v)} placeholder="https://..." />
          {slide.image && (
            <img src={slide.image} alt="" className="rounded-xl w-full h-28 object-cover border border-slate-200" />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge / Label" value={slide.badge} onChange={(v) => update(i, "badge", v)} placeholder="Premium Beach Toys" />
            <Field label="Sort Order" value={slide.sort_order} onChange={(v) => update(i, "sort_order", Number(v))} type="number" placeholder="0" />
          </div>

          <Field label="Headline" value={slide.headline} onChange={(v) => update(i, "headline", v)} placeholder="Main headline..." />
          <Field label="Subheadline" value={slide.subheadline} onChange={(v) => update(i, "subheadline", v)} textarea placeholder="Supporting description..." />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Button Text" value={slide.button_text} onChange={(v) => update(i, "button_text", v)} placeholder="Explore Products" />
            <Field label="Button Link" value={slide.button_link} onChange={(v) => update(i, "button_link", v)} placeholder="/Products" />
          </div>
        </div>
      ))}
    </div>
  );
}