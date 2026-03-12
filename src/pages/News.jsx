import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "../components/shared/SectionHeading";

const articles = [
  {
    id: "nordic-summer-2026",
    date: "March 2026",
    tag: "New Collection",
    title: "Nordic Summer Collection 2026 Has Arrived",
    summary: "Our most ambitious collection yet — featuring pastel palettes, sustainable materials, and Scandinavian-inspired shapes that spark creativity at the water's edge.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/b9045b80b_generated_9bd74fbc.png",
    body: `We're thrilled to unveil the Shoreplay Nordic Summer Collection 2026 — a fresh lineup of beach toys designed with children's joy and parents' peace of mind at heart.

This collection draws deep inspiration from Scandinavian design philosophy: clean forms, soft natural palettes, and a strong commitment to sustainability. Every piece is crafted from BPA-free, recyclable materials and certified to CE and EN-71 standards.

**What's new this season:**
- 6 new bucket and spade sets in muted coral, sage green, and sky blue
- A redesigned sand castle mold series with interlocking architecture pieces
- The first ever Shoreplay water play station — a freestanding sprinkler and splash table
- Limited-edition mesh carry bags featuring ocean-inspired prints

The Nordic Summer Collection is available for wholesale and retail orders starting April 2026. Contact our team for samples and pricing.`,
  },
  {
    id: "oem-guide-2026",
    date: "February 2026",
    tag: "Manufacturing",
    title: "A Complete Guide to Our OEM/ODM Beach Toy Services",
    summary: "From concept sketch to container — everything you need to know about partnering with Shoreplay to create your own branded beach toy line.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/48b5eddf1_generated_6f1df75d.png",
    body: `Building your own beach toy brand has never been easier. Shoreplay's OEM/ODM program offers end-to-end manufacturing support — from initial concept to finished, packaged product ready for retail shelves.

**Our process:**

1. **Briefing** — Share your target market, design ideas, and packaging preferences with our team.
2. **Design** — Our in-house designers create 3D renders and prototypes based on your brief.
3. **Sampling** — Physical samples are produced and shipped to you for approval, typically within 3–4 weeks.
4. **Production** — Once approved, we begin full production with your branding applied.
5. **Quality Control** — Every batch undergoes rigorous QC including CE/EN-71 compliance testing.
6. **Shipping** — We handle export logistics to your destination port or warehouse.

Minimum order quantities start at just 500 units per SKU, making it accessible for new and emerging brands. Reach out to our team to start your journey.`,
  },
  {
    id: "safety-standards-2025",
    date: "December 2025",
    tag: "Safety",
    title: "Why Safety Certifications Matter in Children's Beach Toys",
    summary: "A deep dive into CE, EN-71, ASTM, and BPA-free standards — and why Shoreplay holds all of them.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/fc2e5dd77_generated_9233e5b6.png",
    body: `When it comes to children's toys, safety isn't optional — it's everything. At Shoreplay, we hold our products to the highest international standards to give parents confidence and protect children worldwide.

**CE Marking** — Required for all toys sold in the European Union. It confirms that the product meets EU health, safety, and environmental protection requirements.

**EN-71** — The European toy safety standard covering physical and mechanical properties, flammability, chemical properties, and more. All Shoreplay products are EN-71 compliant.

**ASTM F963** — The American standard for toy safety, ensuring our products are safe for North American markets.

**BPA-Free** — All plastics used in our products are free from bisphenol A, a chemical linked to health concerns in young children.

We conduct annual third-party testing at accredited laboratories and maintain full traceability across our supply chain. When you choose Shoreplay, you choose verified safety.`,
  },
];

export default function News() {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("article");
  const article = articles.find((a) => a.id === articleId);

  if (article) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <Link to="/News" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1 text-xs text-sky-600 font-semibold uppercase tracking-wider">
                <Tag className="w-3 h-3" /> {article.tag}
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3 h-3" /> {article.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-6">{article.title}</h1>
            <img src={article.image} alt={article.title} className="w-full rounded-2xl object-cover aspect-video mb-8 shadow-lg" />
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
              {article.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-base leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100">
              <Link to="/Contact">
                <Button className="rounded-full bg-slate-800 hover:bg-slate-700 text-white gap-2 px-7 py-5 text-sm">
                  Get in Touch <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading badge="Latest News" title="Stories from Shoreplay" subtitle="Updates on new collections, manufacturing insights, and industry news." />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art, i) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link to={`/News?article=${art.id}`} className="group block bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-sky-100 transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{art.tag}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{art.date}</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 group-hover:text-sky-600 transition-colors">{art.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{art.summary}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-sky-600 font-medium">
                    Read more <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}