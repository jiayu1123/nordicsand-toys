import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const STATIC_SLIDES = [
  {
    id: "static-1",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/fc2e5dd77_generated_9233e5b6.png",
    badge: "Premium Beach Toys Manufacturer",
    headline: "Where Play Meets the Shore",
    description: "We design and manufacture premium children's beach toys with Nordic-inspired aesthetics. Safe, sustainable, and built for joy.",
    buttonLabel: "Explore Products",
    buttonLink: "/Products",
    overlay: "from-white/80 via-white/30 to-transparent",
    darkText: false,
  },
  {
    id: "static-2",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/48b5eddf1_generated_6f1df75d.png",
    badge: "OEM / ODM Services",
    headline: "Build Your Own Beach Toy Brand",
    description: "Custom logos, colors, packaging, and toy designs. We bring your brand vision to life with flexible MOQ and fast sampling.",
    buttonLabel: "Learn About OEM",
    buttonLink: "/OEM",
    overlay: "from-slate-900/80 via-slate-900/40 to-transparent",
    darkText: true,
  },
];

function newsToSlide(article) {
  return {
    id: `news-${article.id}`,
    image: article.cover_image || "",
    badge: article.category || "News",
    headline: article.title,
    description: article.subtitle || "",
    buttonLabel: "Read the Story",
    buttonLink: `/Stories?article=${article.id}`,
    overlay: "from-slate-900/75 via-slate-900/30 to-transparent",
    darkText: true,
  };
}

const textVariants = {
  enter: (dir) => ({ opacity: 0, y: 30, x: dir > 0 ? 20 : -20 }),
  center: { opacity: 1, y: 0, x: 0 },
  exit: (dir) => ({ opacity: 0, y: -20, x: dir > 0 ? -20 : 20 }),
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" } }),
};

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const INTERVAL = 5500;

  const { data: featuredNews = [] } = useQuery({
    queryKey: ["news-featured-hero"],
    queryFn: () => base44.entities.News.filter({ status: "published", is_featured: true }, "-publish_date", 3),
    initialData: [],
  });

  const slides = useMemo(() => {
    const newsSlides = featuredNews.filter((a) => a.cover_image).map(newsToSlide);
    const [firstStatic, ...restStatic] = STATIC_SLIDES;
    return [firstStatic, ...newsSlides, ...restStatic];
  }, [featuredNews]);

  const goTo = useCallback((index, dir = 1) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, slides.length, goTo]);

  // Reset current if slides shrink
  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  if (!slides.length) return null;

  const slide = slides[current];
  const textColor = slide.darkText ? "text-white" : "text-slate-800";
  const subColor = slide.darkText ? "text-white/80" : "text-slate-500";
  const badgeBg = slide.darkText ? "bg-white/20 text-white" : "bg-sky-100 text-sky-600";

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {slide.image && <img src={slide.image} alt="" className="w-full h-full object-cover" />}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
        </motion.div>
      </AnimatePresence>

      {/* Text */}
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
              {slide.headline}
            </h1>
            {slide.description && (
              <p className={`mt-5 text-base md:text-lg leading-relaxed max-w-md ${subColor}`}>
                {slide.description}
              </p>
            )}
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

      {/* Prev / Next */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all z-10">
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all z-10">
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>

      {/* Dots */}
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