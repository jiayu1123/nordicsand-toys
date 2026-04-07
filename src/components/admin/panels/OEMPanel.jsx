import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "../ImageUploader";

const DEFAULT = {
  hero_image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/087c56c45_generated_c3199ac0.png",
  hero_badge: "OEM / ODM Services",
  hero_heading: "Build Your Own Beach Toy Brand",
  hero_text: "From custom colors and logos to fully original product designs, we're your complete manufacturing partner. Flexible MOQ, fast sampling, and reliable delivery.",
  services: [
    { title: "Custom Logo", desc: "Print or emboss your brand logo on any product." },
    { title: "Custom Colors", desc: "Choose from our Pantone library or specify your own colors." },
    { title: "Custom Packaging", desc: "Design your own retail-ready packaging, mesh bags, or display boxes." },
    { title: "Custom Toy Sets", desc: "Create unique toy combinations and exclusive sets for your market." },
  ],
  process_steps: [
    { step: "01", title: "Share Your Brief", desc: "Tell us your product idea, target market, and branding needs." },
    { step: "02", title: "Design & Sampling", desc: "We create product designs and physical samples for your approval." },
    { step: "03", title: "Approval & Order", desc: "Review samples, confirm details, and place your production order." },
    { step: "04", title: "Production", desc: "Manufacturing with strict quality control at every stage." },
    { step: "05", title: "Quality Check", desc: "Final QC inspection before packaging and shipping." },
    { step: "06", title: "Delivery", desc: "On-time shipment via sea, air, or express to your destination." },
  ],
  moq_items: [
    { label: "Minimum Order (Standard)", value: "500 pcs per SKU" },
    { label: "Minimum Order (Custom)", value: "1,000 pcs per SKU" },
    { label: "Sample Time", value: "7–15 working days" },
    { label: "Production Lead Time", value: "30–45 days" },
    { label: "Payment Terms", value: "T/T, L/C (negotiable)" },
  ],
};

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-500">{label}</Label>
      {children}
    </div>
  );
}

export default function OEMPanel() {
  const qc = useQueryClient();
  const { data: list = [] } = useQuery({
    queryKey: ["oem-settings"],
    queryFn: () => base44.entities.OEMSettings.list(),
  });
  const record = list[0] || null;
  const [data, setData] = useState(DEFAULT);

  useEffect(() => {
    if (record) setData({ ...DEFAULT, ...record });
  }, [record]);

  const mutation = useMutation({
    mutationFn: (d) => record
      ? base44.entities.OEMSettings.update(record.id, d)
      : base44.entities.OEMSettings.create(d),
    onSuccess: () => { qc.invalidateQueries(["oem-settings"]); toast.success("OEM page saved!"); },
  });

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const updateArr = (key, i, field, val) => {
    const arr = [...data[key]];
    arr[i] = { ...arr[i], [field]: val };
    set(key, arr);
  };
  const addArr = (key, template) => set(key, [...data[key], template]);
  const removeArr = (key, i) => set(key, data[key].filter((_, idx) => idx !== i));

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">OEM/ODM Page</h2>
          <p className="text-sm text-slate-400">Edit hero, services, process steps, and order info</p>
        </div>
        <Button onClick={() => mutation.mutate(data)} disabled={mutation.isPending} className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 text-sm">
          <Save className="w-4 h-4" /> {mutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {/* Hero */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h3 className="font-semibold text-slate-700">Hero Section</h3>
        <Field label="Background Image"><ImageUploader value={data.hero_image} onChange={(url) => set("hero_image", url)} /></Field>
        <Field label="Badge"><Input value={data.hero_badge} onChange={(e) => set("hero_badge", e.target.value)} className="rounded-xl text-sm" /></Field>
        <Field label="Heading"><Input value={data.hero_heading} onChange={(e) => set("hero_heading", e.target.value)} className="rounded-xl text-sm" /></Field>
        <Field label="Sub-text"><Textarea value={data.hero_text} onChange={(e) => set("hero_text", e.target.value)} className="rounded-xl text-sm min-h-[70px]" /></Field>
      </section>

      {/* Services */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Service Cards</h3>
          <Button onClick={() => addArr("services", { title: "", desc: "" })} size="sm" variant="outline" className="rounded-full gap-1 text-xs"><Plus className="w-3.5 h-3.5" />Add</Button>
        </div>
        {data.services.map((s, i) => (
          <div key={i} className="flex gap-3 items-start border border-slate-100 rounded-xl p-3">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <Field label="Title"><Input value={s.title} onChange={(e) => updateArr("services", i, "title", e.target.value)} className="rounded-xl text-sm" /></Field>
              <Field label="Description"><Input value={s.desc} onChange={(e) => updateArr("services", i, "desc", e.target.value)} className="rounded-xl text-sm" /></Field>
            </div>
            <Button onClick={() => removeArr("services", i)} size="sm" variant="ghost" className="text-red-400 hover:text-red-600 h-7 w-7 p-0 mt-6"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </section>

      {/* Process */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Process Steps</h3>
          <Button onClick={() => addArr("process_steps", { step: String(data.process_steps.length + 1).padStart(2, "0"), title: "", desc: "" })} size="sm" variant="outline" className="rounded-full gap-1 text-xs"><Plus className="w-3.5 h-3.5" />Add</Button>
        </div>
        {data.process_steps.map((s, i) => (
          <div key={i} className="flex gap-3 items-start border border-slate-100 rounded-xl p-3">
            <span className="text-2xl font-bold text-slate-200 shrink-0 mt-1 w-8">{s.step}</span>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <Field label="Title"><Input value={s.title} onChange={(e) => updateArr("process_steps", i, "title", e.target.value)} className="rounded-xl text-sm" /></Field>
              <Field label="Description"><Input value={s.desc} onChange={(e) => updateArr("process_steps", i, "desc", e.target.value)} className="rounded-xl text-sm" /></Field>
            </div>
            <Button onClick={() => removeArr("process_steps", i)} size="sm" variant="ghost" className="text-red-400 hover:text-red-600 h-7 w-7 p-0 mt-6"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </section>

      {/* MOQ */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Order Info Table</h3>
          <Button onClick={() => addArr("moq_items", { label: "", value: "" })} size="sm" variant="outline" className="rounded-full gap-1 text-xs"><Plus className="w-3.5 h-3.5" />Add Row</Button>
        </div>
        {data.moq_items.map((m, i) => (
          <div key={i} className="flex gap-3 items-start border border-slate-100 rounded-xl p-3">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <Field label="Label"><Input value={m.label} onChange={(e) => updateArr("moq_items", i, "label", e.target.value)} className="rounded-xl text-sm" /></Field>
              <Field label="Value"><Input value={m.value} onChange={(e) => updateArr("moq_items", i, "value", e.target.value)} className="rounded-xl text-sm" /></Field>
            </div>
            <Button onClick={() => removeArr("moq_items", i)} size="sm" variant="ghost" className="text-red-400 hover:text-red-600 h-7 w-7 p-0 mt-6"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </section>
    </div>
  );
}