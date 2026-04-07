import React, { useState, useEffect, useRef } from "react";
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
  hero_label: "Our Story",
  hero_heading: "Making Beach Days Brighter Since 2009",
  hero_paragraph: "HXToys was born from a simple belief: children's toys should be beautiful, safe, and built to inspire. As a dedicated beach toy manufacturer, we combine Nordic design philosophy with over 15 years of manufacturing expertise to create products that families love.",
  hero_image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/b9045b80b_generated_9bd74fbc.png",
  stats: [
    { number: "15+", label: "Years Experience" },
    { number: "50+", label: "Countries Served" },
    { number: "500+", label: "Product SKUs" },
    { number: "2M+", label: "Toys Produced Yearly" },
  ],
  values_title: "What Drives Us",
  values_subtitle: "We believe that great products start with great values. Here's what guides every decision at HXToys.",
  values: [
    { title: "Design-First", desc: "Every toy starts with thoughtful, child-centered design inspired by Nordic minimalism." },
    { title: "Safety Above All", desc: "CE, EN-71, ASTM certified. Only BPA-free, non-toxic, food-grade materials are used." },
    { title: "Eco-Conscious", desc: "We use recyclable materials and minimize packaging waste wherever possible." },
    { title: "Global Reach", desc: "Exporting to over 50 countries across Europe, North America, Asia, and Oceania." },
  ],
};

export default function AboutPanel() {
  const qc = useQueryClient();
  const [form, setForm] = useState(DEFAULT);
  const initialized = useRef(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["about-settings"],
    queryFn: () => base44.entities.AboutSettings.list(),
  });

  useEffect(() => {
    if (!initialized.current && settings?.length > 0) {
      initialized.current = true;
      const s = settings[0];
      setForm({ ...DEFAULT, ...s, stats: s.stats?.length ? s.stats : DEFAULT.stats, values: s.values?.length ? s.values : DEFAULT.values });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const { id, created_date, updated_date, created_by, ...payload } = data;
      return settings?.length > 0
        ? base44.entities.AboutSettings.update(settings[0].id, payload)
        : base44.entities.AboutSettings.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["about-settings"] }); toast.success("About page saved!"); },
  });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const updateStat = (i, key, val) => set("stats", form.stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const updateValue = (i, key, val) => set("values", form.values.map((v, idx) => idx === i ? { ...v, [key]: val } : v));

  if (isLoading) return <div className="py-20 flex justify-center"><div className="w-6 h-6 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">About Us Page</h2>
          <p className="text-sm text-slate-400">Edit hero intro, stats, and brand values</p>
        </div>
        <Button onClick={() => mutation.mutate(form)} disabled={mutation.isPending} className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 text-sm">
          <Save className="w-4 h-4" /> {mutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {/* Hero */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h3 className="font-semibold text-slate-700">Hero / Intro Section</h3>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Small Label</Label>
          <Input value={form.hero_label} onChange={(e) => set("hero_label", e.target.value)} className="rounded-xl text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Main Heading</Label>
          <Input value={form.hero_heading} onChange={(e) => set("hero_heading", e.target.value)} className="rounded-xl text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Paragraph</Label>
          <Textarea value={form.hero_paragraph} onChange={(e) => set("hero_paragraph", e.target.value)} className="rounded-xl text-sm min-h-[80px]" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Hero Image</Label>
          <ImageUploader value={form.hero_image} onChange={(url) => set("hero_image", url)} />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Stats</h3>
          <Button onClick={() => set("stats", [...form.stats, { number: "", label: "" }])} size="sm" variant="outline" className="rounded-full gap-1 text-xs"><Plus className="w-3.5 h-3.5" />Add</Button>
        </div>
        {form.stats.map((stat, i) => (
          <div key={i} className="flex gap-3 items-end">
            <div className="flex-1"><Label className="text-xs text-slate-500">Number</Label><Input value={stat.number} onChange={(e) => updateStat(i, "number", e.target.value)} className="rounded-xl text-sm mt-1" /></div>
            <div className="flex-1"><Label className="text-xs text-slate-500">Label</Label><Input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} className="rounded-xl text-sm mt-1" /></div>
            <Button variant="ghost" size="icon" onClick={() => set("stats", form.stats.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </section>

      {/* Values */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h3 className="font-semibold text-slate-700">Values Section</h3>
        <div className="space-y-1.5"><Label className="text-xs text-slate-500">Section Title</Label><Input value={form.values_title} onChange={(e) => set("values_title", e.target.value)} className="rounded-xl text-sm" /></div>
        <div className="space-y-1.5"><Label className="text-xs text-slate-500">Section Subtitle</Label><Textarea value={form.values_subtitle} onChange={(e) => set("values_subtitle", e.target.value)} className="rounded-xl text-sm min-h-[60px]" /></div>
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Value Cards</p>
          <Button onClick={() => set("values", [...form.values, { title: "", desc: "" }])} size="sm" variant="outline" className="rounded-full gap-1 text-xs"><Plus className="w-3.5 h-3.5" />Add</Button>
        </div>
        {form.values.map((val, i) => (
          <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">Card {i + 1}</p>
              <Button variant="ghost" size="icon" onClick={() => set("values", form.values.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 h-7 w-7"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
            <div><Label className="text-xs text-slate-500">Title</Label><Input value={val.title} onChange={(e) => updateValue(i, "title", e.target.value)} className="rounded-xl text-sm mt-1" /></div>
            <div><Label className="text-xs text-slate-500">Description</Label><Textarea value={val.desc} onChange={(e) => updateValue(i, "desc", e.target.value)} className="rounded-xl text-sm mt-1" rows={2} /></div>
          </div>
        ))}
      </section>
    </div>
  );
}