import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Factory, ShieldCheck, Palette, Globe, Truck, Award, Leaf, Heart, Star, Zap, Users, Clock, Package, CheckCircle2, Anchor, Target, Layers, Cpu } from "lucide-react";
import SectionHeading from "../components/shared/SectionHeading";
import ProductCard from "../components/products/ProductCard";
import HeroCarousel from "../components/home/HeroCarousel";
import { useHomeSettings } from "../components/shared/useHomeSettings";

const ICON_MAP = {
  Factory, ShieldCheck, Palette, Globe, Truck, Award, Leaf, Heart,
  Star, Zap, Users, Clock, Package, CheckCircle2, Anchor, Target, Layers, Cpu,
};

export default function Home() {
  const { cms } = useHomeSettings();

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => base44.entities.Product.filter({ is_featured: true, status: "active" }, "-sort_order", cms.featured_max || 8),
    initialData: [],
  });

  return (
    <div>
      <HeroCarousel />

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={cms.categories_label}
            title={cms.categories_title}
            subtitle={cms.categories_subtitle}
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cms.categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Link to={cat.link || `/Products?category=${encodeURIComponent(cat.name)}`} className="group block">
                  <div className="bg-gradient-to-br from-sky-100 to-sky-50 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <span className="text-4xl block mb-3">{cat.emoji}</span>
                    <h3 className="text-sm font-semibold text-slate-700">{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge={cms.featured_label}
              title={cms.featured_title}
              subtitle={cms.featured_subtitle}
            />
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link to="/Products">
                <Button variant="outline" className="rounded-full px-8 py-5 text-sm gap-2 border-slate-300">
                  View All Products <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={cms.why_label}
            title={cms.why_title}
            subtitle={cms.why_subtitle}
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cms.why_cards.map((card, i) => {
              const Icon = ICON_MAP[card.icon] || Star;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-sky-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1.5">{card.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <img src={cms.philosophy_image} alt="Brand philosophy" className="rounded-3xl shadow-2xl shadow-sky-100" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="inline-block px-3 py-1 rounded-full bg-white text-sky-600 text-xs font-semibold uppercase tracking-wider mb-4">
                {cms.philosophy_label}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-5">
                {cms.philosophy_title}
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">{cms.philosophy_paragraph}</p>
              <div className="flex flex-wrap gap-3">
                {cms.philosophy_badges.map((badge, i) => {
                  const Icon = [Heart, Leaf, Award][i % 3];
                  return (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white text-sm text-slate-600">
                      <Icon className="w-4 h-4 text-emerald-500" />
                      {badge}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OEM Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <img src={cms.oem_image} alt="OEM" className="w-full h-80 md:h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-12 max-w-lg">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-4">
                  {cms.oem_label}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{cms.oem_title}</h2>
                <p className="text-white/70 text-sm leading-relaxed mb-6">{cms.oem_paragraph}</p>
                <Link to={cms.oem_button_link}>
                  <Button className="rounded-full bg-white text-slate-800 hover:bg-white/90 px-7 py-5 text-sm gap-2">
                    {cms.oem_button_text} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <SectionHeading
            badge={cms.cta_label}
            title={cms.cta_title}
            subtitle={cms.cta_paragraph}
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={cms.cta_primary_link}>
              <Button className="rounded-full px-7 py-5 text-sm bg-slate-800 hover:bg-slate-700 gap-2">
                {cms.cta_primary_text} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={cms.cta_secondary_link}>
              <Button variant="outline" className="rounded-full px-7 py-5 text-sm border-slate-300">
                {cms.cta_secondary_text}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}