import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_STATIC_SLIDES = [
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

  const { data: cmsList = [] } = useQuery({
    queryKey: ["home-settings"],
    queryFn: () => base44.entities.HomeSettings.list(),
    initialData: [],
  });

  const slides = useMemo(() => {
    const cms = cmsList[0] || {};
    const customSlides = (cms?.hero_slides?.length ? cms.hero_slides : DEFAULT_STATIC_SLIDES).map((s, i) => ({
      ...s,
      id: `custom-${i}`,
      overlay: s.darkText ? "from-slate-900/80 via-slate-900/40 to-transparent" : "from-white/80 via-white/30 to-transparent",
    }));

    const result = [];
    if (customSlides.length > 0) result.push(customSlides[0]);

    if (cms?.hero_include_stories) {
      const newsSlides = featuredNews.filter((a) => a.cover_image).map(newsToSlide);
      result.push(...newsSlides);
    }

    if (cms?.hero_include_about) {
      result.push({
        id: "about-slide",
        image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/b9045b80b_generated_9bd74fbc.png",
        badge: "About Us",
        headline: "Designed for Joy, Built for Safety",
        description: "Every product is designed with children's safety and delight in mind. We use BPA-free, non-toxic materials and meet international safety standards.",
        buttonLabel: "Learn Our Story",
        buttonLink: "/About",
        overlay: "from-slate-900/80 via-slate-900/40 to-transparent",
        darkText: true,
      });
    }

    if (cms?.hero_include_oem) {
      result.push({
        id: "oem-slide",
        image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/48b5eddf1_generated_6f1df75d.png",
        badge: "OEM / ODM Services",
        headline: "Build Your Own Beach Toy Brand",
        description: "Custom logos, colors, packaging, and designs. Flexible MOQ and fast sampling.",
        buttonLabel: "Learn About OEM",
        buttonLink: "/OEM",
        overlay: "from-slate-900/80 via-slate-900/40 to-transparent",
        darkText: true,
      });
    }

    if (customSlides.length > 1) result.push(...customSlides.slice(1));

    return result.length > 0 ? result : [DEFAULT_STATIC_SLIDES[0]];
  }, [featuredNews, cmsList]);

  const goTo = useCallback((index, dir = 1) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
    setDirection(1);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setDirection(-1);
  }, [slides.length]);

  // Reset current if slides shrink
  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    setProgress(0);
    const tick = 50;
    const steps = INTERVAL / tick;
    let count = 0;
    const progressTimer = setInterval(() => {
      count++;
      setProgress((count / steps) * 100);
    }, tick);
    const timer = setTimeout(() => {
      next();
    }, INTERVAL);
    return () => { clearInterval(progressTimer); clearTimeout(timer); };
  }, [current, next, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];
  const textColor = slide.darkText ? "text-white" : "text-slate-800";
  const subColor = slide.darkText ? "text-white/80" : "text-slate-500";
  const badgeBg = slide.darkText ? "bg-white/20 text-white" : "bg-sky-100 text-sky-600";

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background with Ken Burns effect */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
        >
          {slide.image && (
            <motion.img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "easeOut" }}
            />
          )}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
        </motion.div>
      </AnimatePresence>

      {/* Text */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slide.id + "-text"}
            custom={direction}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-xl"
          >
            <motion.span
              custom={0}
              variants={childVariants}
              initial="hidden"
              animate="visible"
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 ${badgeBg}`}
            >
              {slide.badge}
            </motion.span>
            <motion.h1
              custom={1}
              variants={childVariants}
              initial="hidden"
              animate="visible"
              className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${textColor}`}
            >
              {slide.headline}
            </motion.h1>
            {slide.description && (
              <motion.p
                custom={2}
                variants={childVariants}
                initial="hidden"
                animate="visible"
                className={`mt-5 text-base md:text-lg leading-relaxed max-w-md ${subColor}`}
              >
                {slide.description}
              </motion.p>
            )}
            <motion.div
              custom={3}
              variants={childVariants}
              initial="hidden"
              animate="visible"
              className="mt-8"
            >
              <Link to={slide.buttonLink}>
                <Button className={`rounded-full px-7 py-5 text-sm gap-2 ${slide.darkText ? "bg-white text-slate-800 hover:bg-white/90" : "bg-slate-800 hover:bg-slate-700 text-white"}`}>
                  {slide.buttonLabel} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
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

      {/* Progress indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            className="relative overflow-hidden rounded-full h-1 transition-all duration-300"
            style={{ width: i === current ? 40 : 10 }}
          >
            <span className="absolute inset-0 rounded-full bg-white/40" />
            {i === current && (
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-white transition-none"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}