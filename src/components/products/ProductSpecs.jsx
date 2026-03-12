import React from "react";
import { Ruler, Layers, Package, Scale, Baby, Box } from "lucide-react";

const specItems = [
  { key: "material", label: "Material", icon: Layers },
  { key: "dimensions", label: "Dimensions", icon: Ruler },
  { key: "pieces_included", label: "Pieces", icon: Box },
  { key: "weight", label: "Weight", icon: Scale },
  { key: "age_group", label: "Age Group", icon: Baby },
  { key: "packaging_type", label: "Packaging", icon: Package },
];

export default function ProductSpecs({ product }) {
  const specs = specItems.filter((s) => product[s.key]);

  if (specs.length === 0) return null;

  return (
    <div className="bg-slate-50 rounded-2xl p-6">
      <h3 className="font-semibold text-slate-800 mb-4">Specifications</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specs.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Icon className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="text-sm font-medium text-slate-700">
                {key === "pieces_included" ? `${product[key]} pcs` : product[key]}
              </p>
            </div>
          </div>
        ))}
      </div>
      {product.packaging_dimensions && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 mb-1">Packaging Dimensions</p>
          <p className="text-sm text-slate-700">{product.packaging_dimensions}</p>
        </div>
      )}
    </div>
  );
}