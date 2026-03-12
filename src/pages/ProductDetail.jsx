import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ProductGallery from "../components/products/ProductGallery";
import ProductSpecs from "../components/products/ProductSpecs";
import FeatureBadges from "../components/products/FeatureBadges";
import InquiryButton from "../components/shared/InquiryButton";
import ProductCard from "../components/products/ProductCard";
import SectionHeading from "../components/shared/SectionHeading";

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const all = await base44.entities.Product.list();
      return all.find((p) => p.id === productId) || null;
    },
    enabled: !!productId,
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["related-products", product?.category],
    queryFn: () =>
      base44.entities.Product.filter({ category: product.category, status: "active" }, "-sort_order", 5),
    enabled: !!product?.category,
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">🏖️</span>
        <h2 className="text-xl font-semibold text-slate-700">Product not found</h2>
        <Link to="/Products" className="text-sky-500 text-sm hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const related = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link to="/Products" className="hover:text-sky-500 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Products
          </Link>
          <span>/</span>
          <span className="text-slate-600">{product.name}</span>
        </div>
      </div>

      {/* Product Main */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGallery mainImage={product.main_image} galleryImages={product.gallery_images} />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.is_new && (
                  <Badge className="bg-[#FF8C7C] text-white border-0 rounded-full text-xs">New</Badge>
                )}
                {product.is_featured && (
                  <Badge className="bg-sky-500 text-white border-0 rounded-full text-xs">Best Seller</Badge>
                )}
                {product.category && (
                  <Badge variant="outline" className="rounded-full text-xs">{product.category}</Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{product.name}</h1>
              {product.subtitle && (
                <p className="text-slate-500 mt-1">{product.subtitle}</p>
              )}
              <p className="text-xs text-slate-400 font-mono mt-2">SKU: {product.sku}</p>
            </div>

            {product.age_group && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm">
                👶 Recommended Age: {product.age_group} years
              </div>
            )}

            <FeatureBadges features={product.features} />

            {product.highlights?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800 text-sm">Key Highlights</h3>
                <ul className="space-y-1.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.description && (
              <div>
                <h3 className="font-semibold text-slate-800 text-sm mb-2">Description</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{product.description}</p>
              </div>
            )}

            <ProductSpecs product={product} />

            <div className="pt-2 flex flex-wrap gap-3">
              <InquiryButton productName={product.name} className="flex-1 sm:flex-none" />
              <Link to="/OEM" className="flex-1 sm:flex-none">
                <button className="w-full rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-3 text-sm font-medium transition-colors">
                  OEM / ODM Options
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Related Products" subtitle="You might also like these beach toys." />
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}