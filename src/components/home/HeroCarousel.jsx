import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useHomeSettings } from "../shared/useHomeSettings";

const variants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const { cms } = useHomeSettings();

  // Fetch all published stories so we can join them to slide config
  const { data: allStories = [] } = useQuery({
    queryKey: ["news-all-published"],
    queryFn: () => base44.entities.News.filter({ status: "published" }, "-publish_date", 50),
    initialData: [],
  });

  const storyMap = useMemo(
    () => Object.fromEntries(allStories.map((s) => [s.id, s])),
    [allStories]
  );

  // Build carousel slides from slide config + story data
  const slides = useMemo(() => {
    const slideConfig = cms.hero_slides || [];
    if (!slideConfig.length) return [];

    return slideConfig
      .filter((s) => s.enabled !== false && s.story_id)           // must be enabled and have a linked story
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) // manual order wins
      .map((s) => {
        const story = storyMap[s.story_id];
        if (!story) return null;                                   // story deleted/unpublished → skip
        // Use slug if available, otherwise fall back to ?article=id (matches Stories page routing)
        const link = story.slug ? `/Stories/${story.slug}` : `/Stories?article=${story.id}`;
        return {
          id: s.story_id,
          image: story.cover_image || "",
          headline: story.title || "",
          subheadline: story.excerpt || story.subtitle || "",
          badge: story.category || "",
          button_text: s.button_text || "Read the Story",
          button_link: link,
        };
      })
      .filter(Boolean);
  }, [cms.hero_slides, storyMap]);

  const goTo = useCallback((index, dir = 1) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => goTo((current + 1) % Math.max(slides.length, 1), 1), [current, slides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + Math.max(slides.length, 1)) % Math.max(slides.length, 1), -1), [current, slides.length, goTo]);

  useEffect(() => {
    if (current >= slides.length && slides.length > 0) setCurrent(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  // Safe fallback: show a placeholder hero so the page never goes blank
  if (!slides.length) {
    return (
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-sky-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-5">
            Premium Beach Toys Manufacturer
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5">
            Where Play Meets the Shore
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            We design and manufacture premium children's beach toys with Nordic-inspired aesthetics.
          </p>
          <Link to="/Products">
            <Button className="rounded-full px-7 py-5 text-sm gap-2 bg-white text-slate-800 hover:bg-white/90">
              Explore Products <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[current];

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
          {slide.image && (
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
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
            {slide.badge && (
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-5">
                {slide.badge}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
              {slide.headline}
            </h1>
            {slide.subheadline && (
              <p className="mt-5 text-base md:text-lg leading-relaxed max-w-md text-white/80">
                {slide.subheadline}
              </p>
            )}
            <div className="mt-8">
              <Link to={slide.button_link}>
                <Button className="rounded-full px-7 py-5 text-sm gap-2 bg-white text-slate-800 hover:bg-white/90">
                  {slide.button_text} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all z-10">
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all z-10">
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}