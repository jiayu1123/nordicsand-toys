import React from "react";
import { motion } from "framer-motion";
import { Factory, Award, Heart, Leaf, ShieldCheck, Globe, Users, Clock } from "lucide-react";
import SectionHeading from "../components/shared/SectionHeading";
import InquiryButton from "../components/shared/InquiryButton";

const FACTORY_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/48b5eddf1_generated_6f1df75d.png";
const LIFESTYLE_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/b9045b80b_generated_9bd74fbc.png";

const values = [
  { icon: Heart, title: "Design-First", desc: "Every toy starts with thoughtful, child-centered design inspired by Nordic minimalism." },
  { icon: ShieldCheck, title: "Safety Above All", desc: "CE, EN-71, ASTM certified. Only BPA-free, non-toxic, food-grade materials are used." },
  { icon: Leaf, title: "Eco-Conscious", desc: "We use recyclable materials and minimize packaging waste wherever possible." },
  { icon: Globe, title: "Global Reach", desc: "Exporting to over 50 countries across Europe, North America, Asia, and Oceania." },
];

const milestones = [
  { year: "2009", text: "Company founded in Shantou, Guangdong" },
  { year: "2012", text: "First European export orders" },
  { year: "2015", text: "CE & EN-71 certification achieved" },
  { year: "2018", text: "Expanded to 15,000 sqm modern factory" },
  { year: "2021", text: "Launched eco-friendly product line" },
  { year: "2024", text: "Serving 50+ countries worldwide" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sky-50 via-cyan-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-600 text-xs font-semibold uppercase tracking-wider mb-4">
                Our Story
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight leading-tight mb-5">
                Making Beach Days Brighter Since 2009
              </h1>
              <p className="text-slate-500 leading-relaxed">
                Shoreplay was born from a simple belief: children's toys should be beautiful, safe, and built to inspire. As a dedicated beach toy manufacturer, we combine Nordic design philosophy with over 15 years of manufacturing expertise to create products that families love.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src={LIFESTYLE_IMG} alt="Children at beach" className="rounded-3xl shadow-2xl shadow-sky-100" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "15+", label: "Years Experience", icon: Clock },
              { number: "50+", label: "Countries Served", icon: Globe },
              { number: "500+", label: "Product SKUs", icon: Factory },
              { number: "2M+", label: "Toys Produced Yearly", icon: Users },
            ].map(({ number, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center p-6 rounded-2xl bg-slate-50"
              >
                <Icon className="w-6 h-6 text-sky-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-slate-800">{number}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Values"
            title="What Drives Us"
            subtitle="We believe that great products start with great values. Here's what guides every decision at Shoreplay."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Factory */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src={FACTORY_IMG} alt="Our factory" className="rounded-3xl shadow-lg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-semibold uppercase tracking-wider mb-4">
                Our Factory
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-4">
                Modern Manufacturing, Trusted Quality
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Our 15,000 sqm facility in Shantou is equipped with modern injection molding, painting, and assembly lines. We maintain strict quality control at every stage, from raw material inspection to final packaging.
              </p>
              <ul className="space-y-3">
                {[
                  "ISO 9001 quality management system",
                  "Automated production lines for consistency",
                  "In-house QC lab and testing facility",
                  "Monthly capacity of 200,000+ units",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <Award className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-br from-sky-50 to-cyan-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading badge="Our Journey" title="Milestones" />
          <div className="mt-12 space-y-0">
            {milestones.map(({ year, text }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 pb-8 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
                    {year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-sky-200 mt-2" />}
                </div>
                <div className="pt-2">
                  <p className="text-xs text-sky-600 font-semibold">{year}</p>
                  <p className="text-slate-700 mt-0.5">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <SectionHeading
            title="Let's Work Together"
            subtitle="Whether you're looking for a reliable supplier or a creative partner, we're ready to help."
          />
          <div className="mt-8">
            <InquiryButton />
          </div>
        </div>
      </section>
    </div>
  );
}