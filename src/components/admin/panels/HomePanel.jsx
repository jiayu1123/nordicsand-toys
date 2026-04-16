import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, Image } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "../ImageUploader";

const DEFAULT = {
  hero_slides: [
    {
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/fc2e5dd77_generated_9233e5b6.png",
      badge: "Premium Beach Toys Manufacturer",
      headline: "Where Play Meets the Shore",
      description: "We design and manufacture premium children's beach toys with Nordic-inspired aesthetics. Safe, sustainable, and built for joy.",
      buttonLabel: "Explore Products",
      buttonLink: "/Products",
      darkText: false,
    },
  ],
  hero_include_stories: true,
  hero_include_about: false,
  hero_include_oem: false,
  philosophy_badge: "Our Philosophy",
  philosophy_heading: "Designed for Joy, Built for Safety",
  philosophy_text: "Every HXToys product is designed with children's safety and delight in mind. We use only BPA-free, non-toxic materials and meet international safety standards including CE, EN-71, and ASTM.",
  philosophy_image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/b9045b80b_generated_9bd74fbc.png",
  factory_image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/48b5eddf1_generated_6f1df75d.png",
  oem_heading: "Create Your Own Beach Toy Brand",
  oem_text: "Custom logos, colors, packaging, and toy designs. We bring your brand vision to life with flexible MOQ and fast sampling.",
  why_items: [
    { title: "Own Factory", desc: "Full control over production, quality, and lead times" },
    { title: "Custom Design", desc: "OEM/ODM services with custom colors, logos, and packaging" },
    { title: "Safety Certified", desc: "CE, EN-71, ASTM, and BPA-free materials" },
    { title: "Global Export", desc: "Shipping to 50+ countries with export expertise" },
    { title: "Flexible MOQ", desc: "Competitive minimum orders for retailers and distributors" },
    { title: "15+ Years", desc: "Experienced manufacturer with proven track record" },
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

export default function HomePanel() {
  const qc = useQueryClient();
  const { data: list = [] } = useQuery({
    queryKey: ["home-settings"],
    queryFn: () => base44.entities.HomeSettings.list(),
  });

  const record = list[0] || null;
  const [data, setData] = useState(DEFAULT);

  useEffect(() => {
    if (record) setData({ ...DEFAULT, ...record });
  }, [record]);

  const mutation = useMutation({
    mutationFn: (d) => record
      ? base44.entities.HomeSettings.update(record.id, d)
      : base44.entities.HomeSettings.create(d),
    onSuccess: () => { qc.invalidateQueries(["home-settings"]); toast.success("Home page saved!"); },
  });

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const updateSlide = (i, key, val) => {
    const slides = [...data.hero_slides];
    slides[i] = { ...slides[i], [key]: val };
    set("hero_slides", slides);
  };

  const addSlide = () => set("hero_slides", [...data.hero_slides, { image: "", badge: "", headline: "New Slide", description: "", buttonLabel: "Learn More", buttonLink: "/Products", darkText: true }]);
  const removeSlide = (i) => set("hero_slides", data.hero_slides.filter((_, idx) => idx !== i));

  const updateWhy = (i, key, val) => {
    const items = [...data.why_items];
    items[i] = { ...items[i], [key]: val };
    set("why_items", items);
  };
  const addWhy = () => set("why_items", [...data.why_items, { title: "", desc: "" }]);
  const removeWhy = (i) => set("why_items", data.why_items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Home Page</h2>
          <p className="text-sm text-slate-400">Edit hero carousel, philosophy section, and Why Choose Us</p>
        </div>
        <Button onClick={() => mutation.mutate(data)} disabled={mutation.isPending} className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 text-sm">
          <Save className="w-4 h-4" /> {mutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      {/* Hero Slides */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-slate-700 mb-4">Hero Carousel</h3>
          <div className="bg-slate-50 rounded-xl p-4 space-y-3 mb-4 border border-slate-200">
            <div className="text-sm font-semibold text-slate-600 mb-2">Include sections:</div>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={data.hero_include_stories} onChange={(e) => set("hero_include_stories", e.target.checked)} className="w-4 h-4" />
              <span>Featured Blog Stories</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={data.hero_include_about} onChange={(e) => set("hero_include_about", e.target.checked)} className="w-4 h-4" />
              <span>About Us Slide</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={data.hero_include_oem} onChange={(e) => set("hero_include_oem", e.target.checked)} className="w-4 h-4" />
              <span>OEM/ODM Services Slide</span>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-700">Custom Slides</h4>
          <Button onClick={addSlide} size="sm" variant="outline" className="rounded-full gap-1 text-xs"><Plus className="w-3.5 h-3.5" />Add Slide</Button>
        </div>
        {data.hero_slides.map((slide, i) => (
          <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Slide {i + 1}</span>
              <Button onClick={() => removeSlide(i)} size="sm" variant="ghost" className="text-red-400 hover:text-red-600 h-7 w-7 p-0"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <Field label="Background Image">
              <ImageUploader value={slide.image} onChange={(url) => updateSlide(i, "image", url)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Badge Text"><Input value={slide.badge} onChange={(e) => updateSlide(i, "badge", e.target.value)} className="rounded-xl text-sm" /></Field>
              <Field label="Button Label"><Input value={slide.buttonLabel} onChange={(e) => updateSlide(i, "buttonLabel", e.target.value)} className="rounded-xl text-sm" /></Field>
            </div>
            <Field label="Headline"><Input value={slide.headline} onChange={(e) => updateSlide(i, "headline", e.target.value)} className="rounded-xl text-sm" /></Field>
            <Field label="Description"><Textarea value={slide.description} onChange={(e) => updateSlide(i, "description", e.target.value)} className="rounded-xl text-sm min-h-[60px]" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Button Link"><Input value={slide.buttonLink} onChange={(e) => updateSlide(i, "buttonLink", e.target.value)} className="rounded-xl text-sm" /></Field>
              <Field label="Text Color">
                <select value={slide.darkText ? "dark" : "light"} onChange={(e) => updateSlide(i, "darkText", e.target.value === "dark")} className="w-full h-9 rounded-xl border border-input px-3 text-sm bg-transparent">
                  <option value="light">Light Text (dark bg)</option>
                  <option value="dark">Light Text on dark overlay</option>
                </select>
              </Field>
            </div>
          </div>
        ))}
      </section>

      {/* Philosophy */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h3 className="font-semibold text-slate-700">Philosophy Section</h3>
        <Field label="Badge"><Input value={data.philosophy_badge} onChange={(e) => set("philosophy_badge", e.target.value)} className="rounded-xl text-sm" /></Field>
        <Field label="Heading"><Input value={data.philosophy_heading} onChange={(e) => set("philosophy_heading", e.target.value)} className="rounded-xl text-sm" /></Field>
        <Field label="Text"><Textarea value={data.philosophy_text} onChange={(e) => set("philosophy_text", e.target.value)} className="rounded-xl text-sm min-h-[80px]" /></Field>
        <Field label="Image">
          <ImageUploader value={data.philosophy_image} onChange={(url) => set("philosophy_image", url)} />
        </Field>
      </section>

      {/* Factory / OEM CTA */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h3 className="font-semibold text-slate-700">Factory / OEM CTA Section</h3>
        <Field label="Background Image">
          <ImageUploader value={data.factory_image} onChange={(url) => set("factory_image", url)} />
        </Field>
        <Field label="Heading"><Input value={data.oem_heading} onChange={(e) => set("oem_heading", e.target.value)} className="rounded-xl text-sm" /></Field>
        <Field label="Text"><Textarea value={data.oem_text} onChange={(e) => set("oem_text", e.target.value)} className="rounded-xl text-sm min-h-[60px]" /></Field>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">Why Choose Us Cards</h3>
          <Button onClick={addWhy} size="sm" variant="outline" className="rounded-full gap-1 text-xs"><Plus className="w-3.5 h-3.5" />Add Card</Button>
        </div>
        {data.why_items.map((item, i) => (
          <div key={i} className="flex gap-3 items-start border border-slate-100 rounded-xl p-3">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <Field label="Title"><Input value={item.title} onChange={(e) => updateWhy(i, "title", e.target.value)} className="rounded-xl text-sm" /></Field>
              <Field label="Description"><Input value={item.desc} onChange={(e) => updateWhy(i, "desc", e.target.value)} className="rounded-xl text-sm" /></Field>
            </div>
            <Button onClick={() => removeWhy(i)} size="sm" variant="ghost" className="text-red-400 hover:text-red-600 h-7 w-7 p-0 mt-6"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </section>
    </div>
  );
}