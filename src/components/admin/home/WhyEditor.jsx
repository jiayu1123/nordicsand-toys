import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import Field from "./Field";

const ICON_OPTIONS = [
  "Factory", "Palette", "ShieldCheck", "Globe", "Truck", "Award",
  "Leaf", "Heart", "Star", "Zap", "Users", "Clock", "Package",
  "CheckCircle2", "Anchor", "Target", "Layers", "Cpu",
];

export default function WhyEditor({ form, setForm }) {
  const s = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const cards = form.why_cards || [];

  const updateCard = (i, key, val) =>
    setForm((f) => ({
      ...f,
      why_cards: f.why_cards.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)),
    }));

  const addCard = () =>
    setForm((f) => ({ ...f, why_cards: [...f.why_cards, { icon: "Star", title: "", desc: "" }] }));

  const removeCard = (i) =>
    setForm((f) => ({ ...f, why_cards: f.why_cards.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Section Heading</h3>
        <Field label="Badge Label" value={form.why_label} onChange={(v) => s("why_label", v)} placeholder="Why Shoreplay" />
        <Field label="Section Title" value={form.why_title} onChange={(v) => s("why_title", v)} placeholder="Your Trusted Beach Toy Partner" />
        <Field label="Section Description" value={form.why_subtitle} onChange={(v) => s("why_subtitle", v)} textarea placeholder="Description..." />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Feature Cards</h3>
          <Button variant="outline" size="sm" className="rounded-full gap-1 text-xs" onClick={addCard}>
            <Plus className="w-3 h-3" /> Add Card
          </Button>
        </div>
        {cards.map((card, i) => (
          <div key={i} className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-600">Card {i + 1}</span>
              <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => removeCard(i)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500">Icon</label>
              <select
                value={card.icon || "Star"}
                onChange={(e) => updateCard(i, "icon", e.target.value)}
                className="w-full h-9 rounded-xl border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <Field label="Title" value={card.title} onChange={(v) => updateCard(i, "title", v)} placeholder="Own Factory" />
            <Field label="Description" value={card.desc} onChange={(v) => updateCard(i, "desc", v)} textarea placeholder="Short description..." />
          </div>
        ))}
      </div>
    </div>
  );
}