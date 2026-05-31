// Shared domain types for the Atlas of Architecture app.

// A media item attached to an era. The union is intentionally open so that
// `video` and `animation` can be layered in later without restructuring the
// rendering components (see ArticleSection / MediaItem).
export interface ImageMedia {
  kind: 'image';
  src: string;
  caption?: string;
  credit?: string;
}

export interface VideoMedia {
  kind: 'video';
  src: string;
  poster?: string;
  caption?: string;
  credit?: string;
}

export interface AnimationMedia {
  kind: 'animation';
  // Identifier resolved by a future animation registry (e.g. a Lottie file
  // or a custom canvas/Framer scene). Kept abstract for now.
  ref: string;
  caption?: string;
  credit?: string;
}

export type Media = ImageMedia | VideoMedia | AnimationMedia;

// A single architectural era / period within a country's history.
export interface Era {
  id: string;
  period: string; // e.g. "c. 800 BCE - 146 BCE"
  title: string; // e.g. "Ancient Greek"
  text: string;
  media: Media[];
}

// A curated country record. Any field beyond `name` is optional so a country
// can fall back to live Wikipedia content when it isn't curated yet.
export interface CountryContent {
  name: string; // must match topojson properties.name
  wikipediaTitle: string; // page used for live enrichment / fallback
  flagEmoji?: string;
  tagline?: string;
  intro?: string;
  heroImage?: string;
  heroCredit?: string;
  eras?: Era[];
}

// Normalised shape consumed by the panel, blending curated + live data.
export interface PanelData {
  name: string;
  wikipediaTitle: string;
  tagline?: string;
  flagEmoji?: string;
  intro: string;
  heroImage?: string;
  heroCredit?: string;
  eras: Era[];
  source: 'curated' | 'wikipedia' | 'mixed';
  // Raw Wikipedia HTML for countries without curated eras (rendered as a
  // long-form article body, Wikipedia-style).
  wikipediaHtml?: string;
}
