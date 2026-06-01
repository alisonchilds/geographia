// Optional Unsplash integration.
//
// Set VITE_UNSPLASH_ACCESS_KEY in a .env file to enable a live photo gallery in
// each country panel. Without a key, `isUnsplashEnabled` is false and the
// gallery simply doesn't render, so the app works out of the box.
//
// Get a free key at https://unsplash.com/developers (create an app).

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined;
const UTM = '?utm_source=atlas_of_architecture&utm_medium=referral';

export const isUnsplashEnabled = Boolean(ACCESS_KEY);

export interface UnsplashPhoto {
  id: string;
  thumb: string; // small square for the desktop gallery grid
  gallery: string; // landscape crop for the mobile gallery grid
  regular: string; // high-res, retina-friendly for in-article images
  alt: string;
  photoLink: string;
  authorName: string;
  authorLink: string;
}

interface RawUnsplashPhoto {
  id: string;
  alt_description: string | null;
  // `raw` is an Imgix base URL that accepts dynamic sizing params, which lets
  // us request crisp, retina-resolution crops instead of Unsplash's fixed sizes.
  urls: { raw: string; thumb: string; small: string; regular: string };
  links: { html: string };
  user: { name: string; links: { html: string } };
}

// Build a sized image URL off Unsplash's `raw` (Imgix) endpoint. dpr=2 keeps
// images sharp on retina displays.
function sized(raw: string, width: number, opts: { square?: boolean } = {}): string {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    q: '80',
    w: String(width),
    dpr: '2',
  });
  if (opts.square) params.set('h', String(width));
  const sep = raw.includes('?') ? '&' : '?';
  return `${raw}${sep}${params.toString()}`;
}

// Search Unsplash for photos matching a query (e.g. "Italy architecture").
export async function searchUnsplash(
  query: string,
  perPage = 12,
): Promise<UnsplashPhoto[]> {
  if (!ACCESS_KEY) return [];
  try {
    const params = new URLSearchParams({
      query,
      per_page: String(perPage),
      orientation: 'landscape',
      content_filter: 'high',
    });
    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
        'Accept-Version': 'v1',
      },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { results: RawUnsplashPhoto[] };
    return (data.results || []).map((p) => ({
      id: p.id,
      thumb: sized(p.urls.raw, 400, { square: true }),
      gallery: sized(p.urls.raw, 640),
      regular: sized(p.urls.raw, 900),
      alt: p.alt_description || query,
      photoLink: `${p.links.html}${UTM}`,
      authorName: p.user.name,
      authorLink: `${p.user.links.html}${UTM}`,
    }));
  } catch {
    return [];
  }
}
