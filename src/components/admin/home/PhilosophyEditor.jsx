import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import Field from "./Field";

export default function PhilosophyEditor({ form, setForm }) {
  const s = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const badges = form.philosophy_badges || [];

  const updateBadge = (i, val) =>
    setForm((f) => ({
      ...f,
      philosophy_badges: f.philosophy_badges.map((b, idx) => (idx === i ? val : b)),
    }));

  const addBadge = () =>
    setForm((f) => ({ ...f, philosophy_badges: [...f.philosophy_badges, ""] }));

  const removeBadge = (i) =>
    setForm((f) => ({ ...f, philosophy_badges: f.philosophy_badges.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-5">
      <Field label="Badge Label" value={form.philosophy_label} onChange={(v) => s("philosophy_label", v)} placeholder="Our Philosophy" />
      <Field label="Title" value={form.philosophy_title} onChange={(v) => s("philosophy_title", v)} />
      <Field label="Paragraph" value={form.philosophy_paragraph} onChange={(v) => s("philosophy_paragraph", v)} textarea />
      <Field label="Image URL" value={form.philosophy_image} onChange={(v) => s("philosophy_image", v)} placeholder="https://..." />
      {form.philosophy_image && (
        <img src={form.philosophy_image} alt="" className="rounded-xl w-full h-40 object-cover border border-slate-200" />
      )}

      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Highlight Badges</label>
          <Button variant="outline" size="sm" className="rounded-full gap-1 text-xs" onClick={addBadge}>
            <Plus className="w-3 h-3" /> Add Badge
          </Button>
        </div>
        {badges.map((badge, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={badge}
              onChange={(e) => updateBadge(i, e.target.value)}
              placeholder="CE & EN-71 Certified"
              className="rounded-xl text-sm flex-1"
            />
            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-8 w-8 shrink-0" onClick={() => removeBadge(i)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}