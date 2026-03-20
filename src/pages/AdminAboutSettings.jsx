import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Shell, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

function Field({ label, value, onChange, textarea, placeholder }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-500">{label}</Label>
      {textarea ? (
        <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-xl text-sm" rows={3} />
      ) : (
        <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-xl text-sm" />
      )}
    </div>
  );
}

export default function AdminAboutSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
      setForm({
        ...DEFAULT,
        ...s,
        stats: s.stats?.length ? s.stats : DEFAULT.stats,
        values: s.values?.length ? s.values : DEFAULT.values,
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const { id, created_date, updated_date, created_by, ...payload } = data;
      if (settings?.length > 0) {
        return base44.entities.AboutSettings.update(settings[0].id, payload);
      } else {
        return base44.entities.AboutSettings.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-settings"] });
      toast({ title: "Saved!", description: "About page updated." });
    },
  });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const updateStat = (i, key, val) => {
    const updated = form.stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s);
    set("stats", updated);
  };
  const addStat = () => set("stats", [...form.stats, { number: "", label: "" }]);
  const removeStat = (i) => set("stats", form.stats.filter((_, idx) => idx !== i));

  const updateValue = (i, key, val) => {
    const updated = form.values.map((v, idx) => idx === i ? { ...v, [key]: val } : v);
    set("values", updated);
  };
  const addValue = () => set("values", [...form.values, { title: "", desc: "" }]);
  const removeValue = (i) => set("values", form.values.filter((_, idx) => idx !== i));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/Home" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center">
                  <Shell className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700">HXToys</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-semibold text-slate-800">About Settings</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/Admin"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">Products ↗</Button></Link>
              <Link to="/AdminStories"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">Stories ↗</Button></Link>
              <Link to="/AdminContactSettings"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">Contact ↗</Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">About Us Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Edit content displayed on the About Us page</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><div className="w-6 h-6 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-6">

            {/* Hero */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3">Hero / Intro Section</h2>
              <Field label="Small Label (e.g. 'Our Story')" value={form.hero_label} onChange={(v) => set("hero_label", v)} placeholder="Our Story" />
              <Field label="Main Heading" value={form.hero_heading} onChange={(v) => set("hero_heading", v)} placeholder="Making Beach Days Brighter Since 2009" />
              <Field label="Paragraph Text" value={form.hero_paragraph} onChange={(v) => set("hero_paragraph", v)} textarea placeholder="Short intro paragraph..." />
              <Field label="Hero Image URL" value={form.hero_image} onChange={(v) => set("hero_image", v)} placeholder="https://..." />
              {form.hero_image && (
                <img src={form.hero_image} alt="Hero preview" className="rounded-xl w-full max-h-48 object-cover mt-1" />
              )}
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-semibold text-slate-700">Stats</h2>
                <Button variant="outline" size="sm" className="rounded-full text-xs gap-1" onClick={addStat}>
                  <Plus className="w-3 h-3" /> Add Stat
                </Button>
              </div>
              {form.stats.map((stat, i) => (
                <div key={i} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label className="text-xs text-slate-500">Number</Label>
                    <Input value={stat.number} onChange={(e) => updateStat(i, "number", e.target.value)} placeholder="15+" className="rounded-xl text-sm mt-1" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-slate-500">Label</Label>
                    <Input value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} placeholder="Years Experience" className="rounded-xl text-sm mt-1" />
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 mb-0.5" onClick={() => removeStat(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Values */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3">Values Section</h2>
              <Field label="Section Title" value={form.values_title} onChange={(v) => set("values_title", v)} placeholder="What Drives Us" />
              <Field label="Section Subtitle" value={form.values_subtitle} onChange={(v) => set("values_subtitle", v)} textarea placeholder="Short description..." />

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Value Cards</p>
                <Button variant="outline" size="sm" className="rounded-full text-xs gap-1" onClick={addValue}>
                  <Plus className="w-3 h-3" /> Add Card
                </Button>
              </div>
              {form.values.map((val, i) => (
                <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-600">Card {i + 1}</p>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => removeValue(i)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Title</Label>
                    <Input value={val.title} onChange={(e) => updateValue(i, "title", e.target.value)} placeholder="Design-First" className="rounded-xl text-sm mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Description</Label>
                    <Textarea value={val.desc} onChange={(e) => updateValue(i, "desc", e.target.value)} placeholder="Short description..." className="rounded-xl text-sm mt-1" rows={2} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => mutation.mutate(form)}
                disabled={mutation.isPending}
                className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}