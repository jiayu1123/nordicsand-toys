import React from "react";
import Field from "./Field";

export default function CtaEditor({ form, setForm }) {
  const s = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-5">
      <Field label="Badge Label" value={form.cta_label} onChange={(v) => s("cta_label", v)} placeholder="Get in Touch" />
      <Field label="Title" value={form.cta_title} onChange={(v) => s("cta_title", v)} placeholder="Ready to Start?" />
      <Field label="Paragraph" value={form.cta_paragraph} onChange={(v) => s("cta_paragraph", v)} textarea />

      <div className="pt-2 space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Primary Button</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Text" value={form.cta_primary_text} onChange={(v) => s("cta_primary_text", v)} placeholder="Request a Quote" />
          <Field label="Link" value={form.cta_primary_link} onChange={(v) => s("cta_primary_link", v)} placeholder="/Contact" />
        </div>
      </div>

      <div className="pt-1 space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Secondary Button</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Text" value={form.cta_secondary_text} onChange={(v) => s("cta_secondary_text", v)} placeholder="Browse Products" />
          <Field label="Link" value={form.cta_secondary_link} onChange={(v) => s("cta_secondary_link", v)} placeholder="/Products" />
        </div>
      </div>
    </div>
  );
}