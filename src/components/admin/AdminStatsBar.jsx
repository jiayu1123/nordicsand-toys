import React from "react";
import { Package, Star, Sparkles, Archive } from "lucide-react";

export default function AdminStatsBar({ products }) {
  const total = products.length;
  const active = products.filter((p) => p.status === "active").length;
  const featured = products.filter((p) => p.is_featured).length;
  const newArrivals = products.filter((p) => p.is_new).length;
  const drafts = products.filter((p) => p.status === "draft").length;

  const stats = [
    { icon: Package, label: "Total Products", value: total, color: "text-sky-600 bg-sky-50" },
    { icon: Package, label: "Active", value: active, color: "text-emerald-600 bg-emerald-50" },
    { icon: Star, label: "Featured", value: featured, color: "text-amber-600 bg-amber-50" },
    { icon: Sparkles, label: "New Arrivals", value: newArrivals, color: "text-purple-600 bg-purple-50" },
    { icon: Archive, label: "Drafts", value: drafts, color: "text-slate-500 bg-slate-100" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 leading-none">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}