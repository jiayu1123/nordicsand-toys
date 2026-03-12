import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/fc2e5dd77_generated_9233e5b6.png",
    badge: "Premium Beach Toys Manufacturer",
    headline: "Where Play Meets the Shore",
    headlineHighlight: "the Shore",
    description: "We design and manufacture premium children's beach toys with Nordic-inspired aesthetics. Safe, sustainable, and built for joy.",
    buttonLabel: "Explore Products",
    buttonLink: "/Products",
    overlay: "from-white/80 via-white/30 to-transparent",
  },
  {
    id: 2,
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/b9045b80b_generated_9bd74fbc.png",
    badge: "New Collection 2026",
    headline: "Nordic Summer Collection Has Arrived",
    headlineHighlight: "Has Arrived",
    description: "Our newest line of beach toys combines Scandinavian design with maximum fun. Explore pastel palettes, sustainable materials, and award-winning shapes.",
    buttonLabel: "Read the Story",
    buttonLink: "/News?article=nordic-summer-2026",
    overlay: "from-white/80 via-white/30 to-transparent",
  },
  {
    id: 3,
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/48b5eddf1_generated_6f1df75d.png",
    badge: "OEM / ODM Services",
    headline: "Build Your Own Beach Toy Brand",
    headlineHighlight: "Beach Toy Brand",
    description: "Custom logos, colors, packaging, and toy designs. We bring your brand vision to life with flexible MOQ and fast sampling.",
    buttonLabel: "Learn About OEM",
    buttonLink: "/OEM",
    overlay: "from-slate-900/80 via-slate-900/40 to-transparent",
    darkText: true,
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index, dir = 1) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];
  const textColor = slide.darkText ? "text-white" : "text-slate-800";
  const subColor = slide.darkText ? "text-white/80" : "text-slate-500";
  const badgeBg = slide.darkText ? "bg-white/20 text-white" : "bg-sky-100 text-sky-600";

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background images */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={{ enter: (d) => ({ opacity: 0 }), center: { opacity: 1 }, exit: (d) => ({ opacity: 0 }) }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id + "-text"}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-xl"
          >
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 ${badgeBg}`}>
              {slide.badge}
            </span>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${textColor}`}>
              {slide.headline.replace(slide.headlineHighlight, "").trim()}{" "}
              <span className={slide.darkText ? "text-sky-300" : "text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-400"}>
                {slide.headlineHighlight}
              </span>
            </h1>
            <p className={`mt-5 text-base md:text-lg leading-relaxed max-w-md ${subColor}`}>
              {slide.description}
            </p>
            <div className="mt-8">
              <Link to={slide.buttonLink}>
                <Button className={`rounded-full px-7 py-5 text-sm gap-2 ${slide.darkText ? "bg-white text-slate-800 hover:bg-white/90" : "bg-slate-800 hover:bg-slate-700 text-white"}`}>
                  {slide.buttonLabel} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all z-10"
      >
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all z-10"
      >
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"}`}
          />
        ))}
      </div>
    </section>
  );
}