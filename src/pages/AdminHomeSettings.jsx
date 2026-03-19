import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shell, Save, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useHomeSettings, HOME_DEFAULTS } from "../components/shared/useHomeSettings";
import SlideEditor from "../components/admin/home/SlideEditor";
import CategoriesEditor from "../components/admin/home/CategoriesEditor";
import FeaturedEditor from "../components/admin/home/FeaturedEditor";
import WhyEditor from "../components/admin/home/WhyEditor";
import PhilosophyEditor from "../components/admin/home/PhilosophyEditor";
import OemEditor from "../components/admin/home/OemEditor";
import CtaEditor from "../components/admin/home/CtaEditor";
import FooterEditor from "../components/admin/home/FooterEditor";

const SECTIONS = [
  { id: "hero", label: "Hero Carousel", emoji: "🎠" },
  { id: "categories", label: "Product Range", emoji: "🗂️" },
  { id: "featured", label: "Featured Products", emoji: "⭐" },
  { id: "why", label: "Why Shoreplay", emoji: "✅" },
  { id: "philosophy", label: "Brand Philosophy", emoji: "💡" },
  { id: "oem", label: "OEM / ODM Banner", emoji: "🏭" },
  { id: "cta", label: "CTA / Ready to Start", emoji: "🚀" },
  { id: "footer", label: "Footer", emoji: "🦶" },
];

function Section({ id, label, emoji, open, onToggle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-semibold text-slate-800">{label}</span>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-1 border-t border-slate-50">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminHomeSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { cms, isLoading, record } = useHomeSettings();
  const [form, setForm] = useState(HOME_DEFAULTS);
  const [openSection, setOpenSection] = useState("hero");
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && !isLoading) {
      initialized.current = true;
      setForm(cms);
    }
  }, [isLoading, cms]);

  const toggleSection = (id) => setOpenSection((prev) => (prev === id ? null : id));

  const mutation = useMutation({
    mutationFn: async (data) => {
      const { id, created_date, updated_date, created_by, ...payload } = data;
      if (record) {
        return base44.entities.HomeSettings.update(record.id, payload);
      } else {
        return base44.entities.HomeSettings.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-settings"] });
      toast({ title: "Saved!", description: "Home page updated successfully." });
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/Home" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center">
                  <Shell className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Shoreplay</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-semibold text-slate-800">Home Settings</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link to="/Admin"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">Products ↗</Button></Link>
              <Link to="/AdminStories"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">Stories ↗</Button></Link>
              <Link to="/AdminContactSettings"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">Contact ↗</Button></Link>
              <Link to="/AdminAboutSettings"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">About ↗</Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Home Page Settings</h1>
            <p className="text-sm text-slate-400 mt-1">Edit all sections of the Home page without touching code</p>
          </div>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || isLoading}
            className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 px-6"
          >
            <Save className="w-4 h-4" />
            {mutation.isPending ? "Saving..." : "Save All"}
          </Button>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-6 h-6 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {SECTIONS.map(({ id, label, emoji }) => (
              <Section key={id} id={id} label={label} emoji={emoji} open={openSection === id} onToggle={toggleSection}>
                {id === "hero" && <SlideEditor form={form} setForm={setForm} />}
                {id === "categories" && <CategoriesEditor form={form} setForm={setForm} />}
                {id === "featured" && <FeaturedEditor form={form} setForm={setForm} />}
                {id === "why" && <WhyEditor form={form} setForm={setForm} />}
                {id === "philosophy" && <PhilosophyEditor form={form} setForm={setForm} />}
                {id === "oem" && <OemEditor form={form} setForm={setForm} />}
                {id === "cta" && <CtaEditor form={form} setForm={setForm} />}
                {id === "footer" && <FooterEditor form={form} setForm={setForm} />}
              </Section>
            ))}
          </div>
        )}

        <div className="flex justify-end pb-8">
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || isLoading}
            className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 px-6"
          >
            <Save className="w-4 h-4" />
            {mutation.isPending ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>
    </div>
  );
}