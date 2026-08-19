import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

const DEFAULTS = {
  siteName: "Felizardo's Event Place",
  description:
    "Showcases premium event venues with immersive visuals and smooth interactions to attract bookings and provide a luxury user experience.",
  image: "https://images.unsplash.com/photo-1778514253639-3bd14410db8b?w=1920&h=1080&fit=crop&auto=format",
};

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    // derive attribute from selector (name=... or property=...)
    const m = selector.match(/\[(name|property)="(.+)"\]/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
}

function upsertJsonLd(id: string, payload: unknown) {
  let el = document.head.querySelector(`#${id}`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload, null, 2);
}

export default function SEO({ title, description, image, url, type = "website", noindex }: SEOProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const fullTitle = title ? `${title} | ${DEFAULTS.siteName}` : DEFAULTS.siteName;
    document.title = fullTitle;

    upsertMeta('[name="description"]', { content: description || DEFAULTS.description });
    upsertMeta('[name="robots"]', { content: noindex ? "noindex, nofollow" : "index,follow" });

    upsertMeta('[property="og:title"]', { content: fullTitle });
    upsertMeta('[property="og:description"]', { content: description || DEFAULTS.description });
    upsertMeta('[property="og:type"]', { content: type });
    upsertMeta('[property="og:image"]', { content: image || DEFAULTS.image });
    upsertMeta('[property="og:url"]', { content: url || window.location.href });

    upsertMeta('[name="twitter:card"]', { content: "summary_large_image" });
    upsertMeta('[name="twitter:title"]', { content: fullTitle });
    upsertMeta('[name="twitter:description"]', { content: description || DEFAULTS.description });
    upsertMeta('[name="twitter:image"]', { content: image || DEFAULTS.image });

    // canonical link
    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url || window.location.href;

    // theme color
    upsertMeta('[name="theme-color"]', { content: "#0B1A0B" });

    // JSON-LD structured data (Organization + LocalBusiness/EventVenue)
    try {
      const host = window.location.origin;
      const org = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: DEFAULTS.siteName,
        url: url || host,
        logo: image || DEFAULTS.image,
      };

      const venue = {
        "@context": "https://schema.org",
        "@type": "EventVenue",
        name: title || DEFAULTS.siteName,
        description: description || DEFAULTS.description,
        image: image || DEFAULTS.image,
        url: url || host,
      };

      // Combined graph
      upsertJsonLd("ld-org", org);
      upsertJsonLd("ld-venue", venue);
    } catch (err) {
      // no-op in non-browser environments
    }
  }, [title, description, image, url, type, noindex]);

  return null;
}
