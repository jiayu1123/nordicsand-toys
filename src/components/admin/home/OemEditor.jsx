import React from "react";
import Field from "./Field";

export default function OemEditor({ form, setForm }) {
  const s = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-5">
      <Field label="Badge Label" value={form.oem_label} onChange={(v) => s("oem_label", v)} placeholder="OEM / ODM Services" />
      <Field label="Title" value={form.oem_title} onChange={(v) => s("oem_title", v)} />
      <Field label="Paragraph" value={form.oem_paragraph} onChange={(v) => s("oem_paragraph", v)} textarea />
      <Field label="Background Image URL" value={form.oem_image} onChange={(v) => s("oem_image", v)} placeholder="https://..." />
      {form.oem_image && (
        <img src={form.oem_image} alt="" className="rounded-xl w-full h-36 object-cover border border-slate-200" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Button Text" value={form.oem_button_text} onChange={(v) => s("oem_button_text", v)} placeholder="Learn More" />
        <Field label="Button Link" value={form.oem_button_link} onChange={(v) => s("oem_button_link", v)} placeholder="/OEM" />
      </div>
    </div>
  );
}