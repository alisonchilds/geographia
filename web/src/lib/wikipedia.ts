import type { PanelData } from '../types';
import { CURATED, fallbackWikiTitle } from '../data/countries';

const REST = 'https://en.wikipedia.org/api/rest_v1';
const ACTION = 'https://en.wikipedia.org/w/api.php';

interface Summary {
  title: string;
  extract: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
  type?: string;
}

async function fetchSummary(title: string): Promise<Summary | null> {
  try {
    const res = await fetch(`${REST}/page/summary/${encodeURIComponent(title)}?redirect=true`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Summary;
    if (data.type && data.type.includes('not_found')) return null;
    return data;
  } catch {
    return null;
  }
}

// Fetch the rendered article HTML via the Action API (CORS via origin=*),
// then clean it up so it reads as a long-form, Wikipedia-style body.
async function fetchArticleHtml(title: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      action: 'parse',
      page: title,
      prop: 'text',
      formatversion: '2',
      format: 'json',
      redirects: '1',
      origin: '*',
    });
    const res = await fetch(`${ACTION}?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    const html: string | undefined = data?.parse?.text;
    if (!html) return null;
    return cleanWikiHtml(html);
  } catch {
    return null;
  }
}

// Strip Wikipedia chrome and normalise links/images for embedding.
function cleanWikiHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const junkSelectors = [
    '.mw-editsection',
    'sup.reference',
    '.reference',
    '.hatnote',
    '.navbox',
    '.metadata',
    '.mbox-small',
    'table.infobox',
    'table.sidebar',
    'table.ambox',
    '.thumbcaption .magnify',
    'style',
    'link',
    '.mw-empty-elt',
    '.reflist',
    '#toc',
    '.toc',
    '.noprint',
    '.mw-jump-link',
    '.shortdescription',
  ];
  doc.querySelectorAll(junkSelectors.join(',')).forEach((el) => el.remove());

  // Drop the references / external-links sections and everything after them.
  doc.querySelectorAll('h2, h3').forEach((h) => {
    const id = (h.textContent || '').trim().toLowerCase();
    if (['references', 'external links', 'see also', 'notes', 'bibliography', 'sources', 'further reading', 'citations'].includes(id)) {
      let node: Element | null = h;
      while (node) {
        const next: Element | null = node.nextElementSibling;
        node.remove();
        node = next;
      }
    }
  });

  // Normalise links: absolute + open in new tab.
  doc.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('/wiki/')) {
      a.setAttribute('href', `https://en.wikipedia.org${href}`);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    } else if (href.startsWith('http')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    } else {
      // Anchor / unsupported link: neutralise it.
      a.removeAttribute('href');
    }
  });

  // Normalise images: protocol-relative -> https, enable native lazy loading.
  doc.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (src.startsWith('//')) img.setAttribute('src', `https:${src}`);
    img.setAttribute('loading', 'lazy');
    img.removeAttribute('srcset');
  });

  const body = doc.querySelector('.mw-parser-output') || doc.body;
  return body.innerHTML;
}

// Public entry point: blend curated content with live Wikipedia data.
export async function loadCountry(countryName: string): Promise<PanelData> {
  const curated = CURATED[countryName];

  if (curated && curated.eras && curated.eras.length > 0) {
    // Curated path. Optionally enrich the hero from the live summary if absent.
    let heroImage = curated.heroImage;
    let intro = curated.intro || '';
    if (!heroImage || !intro) {
      const summary = await fetchSummary(curated.wikipediaTitle);
      if (summary) {
        heroImage = heroImage || summary.originalimage?.source || summary.thumbnail?.source;
        intro = intro || summary.extract;
      }
    }
    return {
      name: curated.name,
      wikipediaTitle: curated.wikipediaTitle,
      tagline: curated.tagline,
      flagEmoji: curated.flagEmoji,
      intro,
      heroImage,
      heroCredit: curated.heroCredit,
      eras: curated.eras,
      source: 'curated',
    };
  }

  // Live Wikipedia path for non-curated countries.
  const archTitle = curated?.wikipediaTitle || fallbackWikiTitle(countryName);

  let summary = await fetchSummary(archTitle);
  let usedTitle = archTitle;

  if (!summary) {
    // No dedicated "Architecture of X" article: fall back to the country page.
    summary = await fetchSummary(countryName);
    usedTitle = countryName;
  }

  const html = await fetchArticleHtml(usedTitle);

  return {
    name: countryName,
    wikipediaTitle: usedTitle,
    intro: summary?.extract || '',
    heroImage: summary?.originalimage?.source || summary?.thumbnail?.source,
    heroCredit: 'Wikipedia',
    eras: [],
    source: 'wikipedia',
    wikipediaHtml: html || undefined,
  };
}

export function wikipediaPageUrl(title: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
}
