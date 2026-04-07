import { useEffect } from "react";

/**
 * Dynamically sets SEO meta tags for a page.
 * Call this hook in any page component.
 *
 * @param {object} options
 * @param {string} options.title         - Page title (will be appended with site name)
 * @param {string} [options.description] - Meta description (max ~160 chars)
 * @param {string} [options.image]       - Open Graph image URL
 * @param {string} [options.url]         - Canonical URL
 * @param {string} [options.type]        - OG type: "website" | "article" (default: "website")
 * @param {object} [options.jsonLd]      - Structured data JSON-LD object
 */
export default function useSEO({ title, description, image, url, type = "website", jsonLd } = {}) {
  const SITE_NAME = "HXToys";
  const DEFAULT_DESC = "HXToys manufactures premium beach and outdoor toys for children. Wholesale & OEM services available.";
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80";

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const metaDesc = description || DEFAULT_DESC;
  const metaImage = image || DEFAULT_IMAGE;
  const canonicalUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Helper to set/create meta tags
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const [attrName, attrValue] = attr.split("=");
        el.setAttribute(attrName, attrValue.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta('meta[name="description"]', 'name=description', metaDesc);
    setMeta('meta[property="og:title"]', 'property=og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property=og:description', metaDesc);
    setMeta('meta[property="og:image"]', 'property=og:image', metaImage);
    setMeta('meta[property="og:type"]', 'property=og:type', type);
    setMeta('meta[property="og:url"]', 'property=og:url', canonicalUrl);
    setMeta('meta[property="og:site_name"]', 'property=og:site_name', SITE_NAME);
    setMeta('meta[name="twitter:card"]', 'name=twitter:card', "summary_large_image");
    setMeta('meta[name="twitter:title"]', 'name=twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name=twitter:description', metaDesc);
    setMeta('meta[name="twitter:image"]', 'name=twitter:image', metaImage);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // JSON-LD structured data
    let scriptEl = document.querySelector('script[data-seo="json-ld"]');
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.setAttribute("type", "application/ld+json");
        scriptEl.setAttribute("data-seo", "json-ld");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    // Cleanup on unmount: restore defaults
    return () => {
      document.title = SITE_NAME;
    };
  }, [fullTitle, metaDesc, metaImage, canonicalUrl, type, jsonLd]);
}