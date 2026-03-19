import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/ProductDetail?id=${product.id}`} className="group block">
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-50 transition-all duration-300">
          <div className="relative aspect-square bg-gradient-to-br from-sky-50 to-cyan-50 overflow-hidden">
            {product.main_image ? (
              <img
                src={product.main_image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <span className="text-5xl">🏖️</span>
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {product.is_new && (
                <Badge className="bg-coral-500 bg-[#FF8C7C] text-white border-0 rounded-full text-xs px-2.5">
                  New
                </Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-sky-500 text-white border-0 rounded-full text-xs px-2.5">
                  Best Seller
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4 pb-5">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-sky-600 transition-colors">
                {product.name}
              </h3>
            </div>
            {product.subtitle && (
              <p className="text-xs text-slate-400 mb-2 line-clamp-1">{product.subtitle}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">{product.sku}</span>
              {product.age_group && (
                <Badge variant="outline" className="rounded-full text-xs border-slate-200 text-slate-500 font-normal">
                  Age {product.age_group}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}