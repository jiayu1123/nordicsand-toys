import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const HERO_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/fc2e5dd77_generated_9233e5b6.png";
const LIFESTYLE_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/b9045b80b_generated_9bd74fbc.png";
const FACTORY_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/48b5eddf1_generated_6f1df75d.png";

export const HOME_DEFAULTS = {
  hero_slides: [],
  categories_label: "Product Range",
  categories_title: "Explore Our Collections",
  categories_subtitle: "From bucket sets to water play, we create beach toys that inspire imagination and outdoor adventure.",
  categories: [
    { name: "Beach Bucket Sets", emoji: "🪣", link: "/Products?category=Beach%20Bucket%20Sets" },
    { name: "Sand Molds", emoji: "🐚", link: "/Products?category=Sand%20Molds" },
    { name: "Water Play Toys", emoji: "💧", link: "/Products?category=Water%20Play%20Toys" },
    { name: "Beach Tools", emoji: "🏖️", link: "/Products?category=Beach%20Tools" },
    { name: "Play Sets", emoji: "🎪", link: "/Products?category=Play%20Sets" },
  ],
  featured_label: "Best Sellers",
  featured_title: "Featured Products",
  featured_subtitle: "Our most popular beach toys loved by children and trusted by parents worldwide.",
  featured_max: 8,
  why_label: "Why Shoreplay",
  why_title: "Your Trusted Beach Toy Partner",
  why_subtitle: "From concept to container, we deliver quality, reliability, and design excellence.",
  why_cards: [
    { icon: "Factory", title: "Own Factory", desc: "Full control over production, quality, and lead times" },
    { icon: "Palette", title: "Custom Design", desc: "OEM/ODM services with custom colors, logos, and packaging" },
    { icon: "ShieldCheck", title: "Safety Certified", desc: "CE, EN-71, ASTM, and BPA-free materials" },
    { icon: "Globe", title: "Global Export", desc: "Shipping to 50+ countries with export expertise" },
    { icon: "Truck", title: "Flexible MOQ", desc: "Competitive minimum orders for retailers and distributors" },
    { icon: "Award", title: "15+ Years", desc: "Experienced manufacturer with proven track record" },
  ],
  philosophy_label: "Our Philosophy",
  philosophy_title: "Designed for Joy, Built for Safety",
  philosophy_paragraph: "Every Shoreplay toy is designed with children's safety and delight in mind. We use only BPA-free, non-toxic materials and meet international safety standards including CE, EN-71, and ASTM.",
  philosophy_image: LIFESTYLE_IMG,
  philosophy_badges: ["Child-Safe Materials", "Eco-Conscious", "CE & EN-71 Certified"],
  oem_label: "OEM / ODM Services",
  oem_title: "Create Your Own Beach Toy Brand",
  oem_paragraph: "Custom logos, colors, packaging, and toy designs. We bring your brand vision to life with flexible MOQ and fast sampling.",
  oem_image: FACTORY_IMG,
  oem_button_text: "Learn More",
  oem_button_link: "/OEM",
  cta_label: "Get in Touch",
  cta_title: "Ready to Start?",
  cta_paragraph: "Whether you're a retailer, distributor, or brand owner, we'd love to hear from you. Let's create something wonderful together.",
  cta_primary_text: "Request a Quote",
  cta_primary_link: "/Contact",
  cta_secondary_text: "Browse Products",
  cta_secondary_link: "/Products",
  footer_description: "Designing and manufacturing premium children's beach toys with Nordic-inspired aesthetics. Safe, sustainable, and joyful.",
  footer_product_links: [
    { label: "Beach Bucket Sets", link: "/Products?category=Beach%20Bucket%20Sets" },
    { label: "Sand Molds", link: "/Products?category=Sand%20Molds" },
    { label: "Water Play Toys", link: "/Products?category=Water%20Play%20Toys" },
    { label: "Beach Tools", link: "/Products?category=Beach%20Tools" },
    { label: "Play Sets", link: "/Products?category=Play%20Sets" },
  ],
  footer_company_links: [
    { label: "About Us", link: "/About" },
    { label: "OEM / ODM", link: "/OEM" },
    { label: "Contact", link: "/Contact" },
    { label: "News", link: "/Stories" },
  ],
  footer_email: "info@shoreplay.com",
  footer_phone: "+86 123 456 7890",
  footer_address: "Shantou, Guangdong, China",
  footer_certifications: ["CE Certified", "EN-71 Compliant", "BPA Free"],
  footer_copyright: "© 2026 Shoreplay. All rights reserved.",
};

const ARRAY_KEYS = ["hero_slides", "categories", "why_cards", "philosophy_badges", "footer_product_links", "footer_company_links", "footer_certifications"];

export function mergeWithDefaults(raw) {
  if (!raw) return HOME_DEFAULTS;
  const merged = { ...HOME_DEFAULTS, ...raw };
  ARRAY_KEYS.forEach((key) => {
    if (!raw[key] || !Array.isArray(raw[key]) || raw[key].length === 0) {
      merged[key] = HOME_DEFAULTS[key];
    }
  });
  return merged;
}

export function useHomeSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ["home-settings"],
    queryFn: () => base44.entities.HomeSettings.list(),
  });
  const cms = mergeWithDefaults(data?.[0] || null);
  return { cms, isLoading, record: data?.[0] };
}