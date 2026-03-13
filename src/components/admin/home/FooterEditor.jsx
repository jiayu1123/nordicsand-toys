import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import Field from "./Field";

function LinksSection({ title, links, onChange }) {
  const updateLink = (i, key, val) => onChange(links.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)));
  const addLink = () => onChange([...links, { label: "", link: "" }]);
  const removeLink = (i) => onChange(links.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
        <Button variant="outline" size="sm" className="rounded-full gap-1 text-xs" onClick={addLink}>
          <Plus className="w-3 h-3" /> Add
        </Button>
      </div>
      {links.map((link, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input value={link.label} onChange={(e) => updateLink(i, "label", e.target.value)} placeholder="Label" className="rounded-xl text-sm" />
          <Input value={link.link} onChange={(e) => updateLink(i, "link", e.target.value)} placeholder="/page" className="rounded-xl text-sm" />
          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-8 w-8 shrink-0" onClick={() => removeLink(i)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function FooterEditor({ form, setForm }) {
  const s = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const certs = form.footer_certifications || [];

  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Brand</h3>
        <Field label="Brand Description" value={form.footer_description} onChange={(v) => s("footer_description", v)} textarea />
        <Field label="Copyright Text" value={form.footer_copyright} onChange={(v) => s("footer_copyright", v)} placeholder="© 2026 Shoreplay. All rights reserved." />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Info</h3>
        <Field label="Email" value={form.footer_email} onChange={(v) => s("footer_email", v)} placeholder="info@shoreplay.com" />
        <Field label="Phone" value={form.footer_phone} onChange={(v) => s("footer_phone", v)} placeholder="+86 123 456 7890" />
        <Field label="Address" value={form.footer_address} onChange={(v) => s("footer_address", v)} placeholder="Shantou, Guangdong, China" />
      </div>

      <LinksSection
        title="Product Links"
        links={form.footer_product_links || []}
        onChange={(v) => s("footer_product_links", v)}
      />

      <LinksSection
        title="Company Links"
        links={form.footer_company_links || []}
        onChange={(v) => s("footer_company_links", v)}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Certifications</h3>
          <Button variant="outline" size="sm" className="rounded-full gap-1 text-xs" onClick={() => s("footer_certifications", [...certs, ""])}>
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
        {certs.map((cert, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={cert}
              onChange={(e) => s("footer_certifications", certs.map((c, idx) => (idx === i ? e.target.value : c)))}
              placeholder="CE Certified"
              className="rounded-xl text-sm flex-1"
            />
            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-8 w-8 shrink-0" onClick={() => s("footer_certifications", certs.filter((_, idx) => idx !== i))}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}