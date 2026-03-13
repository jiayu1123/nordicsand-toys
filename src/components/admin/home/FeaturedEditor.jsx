import React from "react";
import Field from "./Field";

export default function FeaturedEditor({ form, setForm }) {
  const s = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-5">
      <div className="p-4 bg-sky-50 rounded-xl text-sm text-sky-700">
        The featured products section automatically pulls products marked as <strong>"Featured"</strong> from your Products catalog. Configure the section heading and max display count here.
      </div>
      <Field label="Badge Label" value={form.featured_label} onChange={(v) => s("featured_label", v)} placeholder="Best Sellers" />
      <Field label="Section Title" value={form.featured_title} onChange={(v) => s("featured_title", v)} placeholder="Featured Products" />
      <Field label="Section Description" value={form.featured_subtitle} onChange={(v) => s("featured_subtitle", v)} textarea placeholder="Description..." />
      <Field label="Max Products to Display" value={form.featured_max} onChange={(v) => s("featured_max", Number(v))} type="number" placeholder="8" />
    </div>
  );
}