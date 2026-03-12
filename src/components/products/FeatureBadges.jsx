import React from "react";
import { ShieldCheck, Leaf, Recycle, Award, Heart, Sparkles } from "lucide-react";

const featureIcons = {
  "BPA Free": ShieldCheck,
  "CE Certified": Award,
  "Eco-Friendly": Leaf,
  "Recyclable": Recycle,
  "Non-Toxic": Heart,
  "EN-71": Award,
};

export default function FeatureBadges({ features = [] }) {
  if (features.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {features.map((feature) => {
        const Icon = featureIcons[feature] || Sparkles;
        return (
          <div
            key={feature}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium"
          >
            <Icon className="w-3.5 h-3.5" />
            {feature}
          </div>
        );
      })}
    </div>
  );
}