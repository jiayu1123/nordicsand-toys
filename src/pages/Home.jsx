import React from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Factory, ShieldCheck, Palette, Globe, Truck, Award, Leaf, Heart } from "lucide-react";
import SectionHeading from "../components/shared/SectionHeading";
import ProductCard from "../components/products/ProductCard";
import InquiryButton from "../components/shared/InquiryButton";

const HERO_IMG = "/__generating__/img_c3a581c92bdf.png";
const LIFESTYLE_IMG = "/__generating__/img_be7e44f1b615.png";
const FACTORY_IMG = "/__generating__/img_235b799278dc.png";

const categories = [
  { name: "Beach Bucket Sets", emoji: "🪣", color: "from-sky-100 to-sky-50" },
  { name: "Sand Molds", emoji: "🐚", color: "from-amber-100 to-amber-50" },
  { name: "Water Play Toys", emoji: "💧", color: "from-cyan-100 to-cyan-50" },
  { name: "Beach Tools", emoji: "🏖️", color: "from-emerald-100 to-emerald-50" },
  { name: "Play Sets", emoji: "🎪", color: "from-rose-100 to-rose-50" },
];

const whyChooseUs = [
  { icon: Factory, title: "Own Factory", desc: "Full control over production, quality, and lead times" },
  { icon: Palette, title: "Custom Design", desc: "OEM/ODM services with custom colors, logos, and packaging" },
  { icon: ShieldCheck, title: "Safety Certified", desc: "CE, EN-71, ASTM, and BPA-free materials" },
  { icon: Globe, title: "Global Export", desc: "Shipping to 50+ countries with export expertise" },
  { icon: Truck, title: "Flexible MOQ", desc: "Competitive minimum orders for retailers and distributors" },
  { icon: Award, title: "15+ Years", desc: "Experienced manufacturer with proven track record" },
];

export default function Home() {
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => base44.entities.Product.filter({ is_featured: true, status: "active" }, "-sort_order", 8),
    initialData: [],
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Beach toys" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-600 text-xs font-semibold uppercase tracking-wider mb-5">
              Premium Beach Toys Manufacturer
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight leading-tight">
              Where Play Meets{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-400">
                the Shore
              </span>
            </h1>
            <p className="mt-5 text-slate-500 text-base md:text-lg leading-relaxed max-w-md">
              We design and manufacture premium children's beach toys with Nordic-inspired aesthetics. Safe, sustainable, and built for joy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/Products">
                <Button className="rounded-full bg-slate-800 hover:bg-slate-700 px-7 py-5 text-sm gap-2">
                  Explore Products <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/OEM">
                <Button variant="outline" className="rounded-full px-7 py-5 text-sm border-slate-300">
                  OEM / ODM Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Product Range"
            title="Explore Our Collections"
            subtitle="From bucket sets to water play, we create beach toys that inspire imagination and outdoor adventure."
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Link
                  to={`/Products?category=${encodeURIComponent(cat.name)}`}
                  className="group block"
                >
                  <div className={`bg-gradient-to-br ${cat.color} rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
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
              badge="Best Sellers"
              title="Featured Products"
              subtitle="Our most popular beach toys loved by children and trusted by parents worldwide."
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
            badge="Why Shoreplay"
            title="Your Trusted Beach Toy Partner"
            subtitle="From concept to container, we deliver quality, reliability, and design excellence."
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle + Brand */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src={LIFESTYLE_IMG} alt="Children playing" className="rounded-3xl shadow-2xl shadow-sky-100" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-white text-sky-600 text-xs font-semibold uppercase tracking-wider mb-4">
                Our Philosophy
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-5">
                Designed for Joy, Built for Safety
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Every Shoreplay toy is designed with children's safety and delight in mind. We use only BPA-free, non-toxic materials and meet international safety standards including CE, EN-71, and ASTM.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Heart, text: "Child-Safe Materials" },
                  { icon: Leaf, text: "Eco-Conscious" },
                  { icon: Award, text: "CE & EN-71 Certified" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white text-sm text-slate-600">
                    <Icon className="w-4 h-4 text-emerald-500" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Factory / OEM CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <img src={FACTORY_IMG} alt="Our factory" className="w-full h-80 md:h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-12 max-w-lg">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-4">
                  OEM / ODM Services
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Create Your Own Beach Toy Brand
                </h2>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Custom logos, colors, packaging, and toy designs. We bring your brand vision to life with flexible MOQ and fast sampling.
                </p>
                <Link to="/OEM">
                  <Button className="rounded-full bg-white text-slate-800 hover:bg-white/90 px-7 py-5 text-sm gap-2">
                    Learn More <ArrowRight className="w-4 h-4" />
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
            badge="Get in Touch"
            title="Ready to Start?"
            subtitle="Whether you're a retailer, distributor, or brand owner, we'd love to hear from you. Let's create something wonderful together."
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <InquiryButton />
            <Link to="/Products">
              <Button variant="outline" className="rounded-full px-7 py-5 text-sm border-slate-300">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}