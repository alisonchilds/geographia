import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Media, PanelData } from '../types';
import { useIsMobile } from '../lib/useIsMobile';
import { wikipediaPageUrl } from '../lib/wikipedia';
import {
  isUnsplashEnabled,
  searchUnsplash,
  type UnsplashPhoto,
} from '../lib/unsplash';
import ArticleSection from './ArticleSection';
import SmartImage from './SmartImage';
import UnsplashGallery from './UnsplashGallery';

interface CountryPanelProps {
  open: boolean;
  loading: boolean;
  data: PanelData | null;
  countryName: string | null;
  onClose: () => void;
}

interface TocEntry {
  id: string;
  label: string;
}

// Assign anchor ids to Wikipedia article headings and extract a table of
// contents so the sticky nav can scroll to sections.
function processWikiHtml(html: string): { html: string; toc: TocEntry[] } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const toc: TocEntry[] = [];
  let i = 0;
  doc.querySelectorAll('h2').forEach((h) => {
    const label = (h.textContent || '').trim();
    if (!label) return;
    const id = `wiki-h-${i++}`;
    h.setAttribute('id', id);
    h.classList.add('scroll-mt-4');
    toc.push({ id, label });
  });
  return { html: doc.body.innerHTML, toc };
}

function photoToMedia(p: UnsplashPhoto): Media {
  return {
    kind: 'image',
    src: p.regular,
    caption: p.alt,
    credit: `Unsplash / ${p.authorName}`,
  };
}

export default function CountryPanel({
  open,
  loading,
  data,
  countryName,
  onClose,
}: CountryPanelProps) {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [eraPhotoMap, setEraPhotoMap] = useState<Record<string, UnsplashPhoto[]>>({});
  const [galleryPhotos, setGalleryPhotos] = useState<UnsplashPhoto[]>([]);
  const [unsplashLoading, setUnsplashLoading] = useState(false);

  // Collapse and scroll to top whenever a new country is opened.
  useEffect(() => {
    setExpanded(false);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [countryName]);

  // Fetch Unsplash photos: one query per era (for relevance) plus a country
  // pool for the bottom gallery. Per-era queries cost more requests, but stay
  // well within the demo key's hourly budget for typical browsing.
  useEffect(() => {
    const name = data?.name;
    const eras = data?.eras ?? [];
    if (!isUnsplashEnabled || !name) {
      setEraPhotoMap({});
      setGalleryPhotos([]);
      return;
    }
    let active = true;
    setUnsplashLoading(true);
    setEraPhotoMap({});
    setGalleryPhotos([]);

    const eraReqs = eras.map((e) =>
      searchUnsplash(`${name} ${e.title} architecture`, 4).then(
        (photos) => [e.id, photos] as const,
      ),
    );
    const galleryReq = searchUnsplash(`${name} architecture landmark`, 12);

    Promise.all([Promise.all(eraReqs), galleryReq])
      .then(([eraResults, gallery]) => {
        if (!active) return;
        const map: Record<string, UnsplashPhoto[]> = {};
        for (const [id, photos] of eraResults) map[id] = photos;
        setEraPhotoMap(map);
        setGalleryPhotos(gallery);
      })
      .finally(() => active && setUnsplashLoading(false));

    return () => {
      active = false;
    };
  }, [data?.name]);

  const wiki = useMemo(
    () => (data?.wikipediaHtml ? processWikiHtml(data.wikipediaHtml) : null),
    [data?.wikipediaHtml],
  );

  const toc: TocEntry[] = useMemo(() => {
    if (data?.eras && data.eras.length > 0) {
      return data.eras.map((e) => ({ id: `era-${e.id}`, label: e.title }));
    }
    return wiki?.toc ?? [];
  }, [data, wiki]);

  const scrollTo = (id: string) => {
    const root = scrollRef.current;
    const el = root?.querySelector(`#${CSS.escape(id)}`);
    if (el && root) {
      const top = (el as HTMLElement).offsetTop - 8;
      root.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const variants = isMobile
    ? {
        hidden: { y: '100%' },
        visible: { y: 0 },
      }
    : {
        hidden: { x: '-100%' },
        visible: { x: 0 },
      };

  // On desktop the panel floats as a card that starts BELOW the brand/search
  // overlay, so those never cover the hero or the sticky sub-nav.
  const positionClass = isMobile
    ? 'inset-x-3 bottom-3 h-[80vh] rounded-2xl'
    : `left-3 top-[84px] bottom-3 rounded-2xl ${expanded ? 'w-[min(860px,94vw)]' : 'w-[min(420px,calc(100%-1.5rem))]'}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="panel"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          className={`absolute z-30 flex flex-col overflow-hidden bg-white shadow-panel transition-[width] duration-300 ease-out dark:bg-overlayDark dark:shadow-[0_10px_40px_-8px_rgba(0,0,0,0.65)] ${positionClass}`}
        >
          <div ref={scrollRef} className="panel-scroll relative flex-1 overflow-y-auto">
            {/* Expand + close buttons. Zero-height sticky row pinned just below
                the sub-nav so the sticky TOC never covers them on scroll. */}
            <div className="pointer-events-none sticky top-11 z-20 h-0">
              <div className="pointer-events-none flex justify-end gap-2 px-3">
                {!isMobile && (
                  <button
                    onClick={() => setExpanded((e) => !e)}
                    aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
                    title={expanded ? 'Collapse' : 'Expand'}
                    className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-float backdrop-blur transition hover:bg-white dark:bg-overlayDarkHover dark:text-neutral-100 dark:hover:bg-neutral-950"
                  >
                    {expanded ? (
                      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M9 9H4V4M15 9h5V4M9 15H4v5M15 15h5v5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-float backdrop-blur transition hover:bg-white dark:bg-overlayDarkHover dark:text-neutral-100 dark:hover:bg-neutral-950"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {loading && !data ? (
              <PanelSkeleton name={countryName} />
            ) : data ? (
              <>
                {/* Hero */}
                <header className="relative">
                  {data.heroImage ? (
                    <div className="relative h-60 w-full md:h-52">
                      <SmartImage src={data.heroImage} alt={data.name} className="h-full w-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-gradient-to-br from-landActive to-amber-700" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-2 text-2xl">
                      {data.flagEmoji && <span>{data.flagEmoji}</span>}
                      <h2 className="font-serif text-2xl font-bold drop-shadow">
                        {data.name}
                      </h2>
                    </div>
                    {data.tagline && (
                      <p className="mt-0.5 text-sm text-white/85 drop-shadow">{data.tagline}</p>
                    )}
                  </div>
                </header>

                {/* Sub-header: source + wikipedia link */}
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 text-xs dark:border-neutral-800">
                  <span className="inline-flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        data.source === 'curated' ? 'bg-emerald-500' : 'bg-sky-500'
                      }`}
                    />
                    {data.source === 'curated' ? 'Curated history' : 'Live from Wikipedia'}
                  </span>
                  <a
                    href={wikipediaPageUrl(data.wikipediaTitle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#3366cc] hover:underline dark:text-[#8ab4ff]"
                  >
                    View on Wikipedia {'\u2197'}
                  </a>
                </div>

                {/* Sticky table of contents */}
                {toc.length > 0 && (
                  <nav className="sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-neutral-200 bg-white/95 px-4 py-2 backdrop-blur dark:border-white/10 dark:bg-overlayDark">
                    {toc.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => scrollTo(t.id)}
                        className="whitespace-nowrap rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-landActive/30 dark:bg-overlayDarkHover dark:text-neutral-200 dark:hover:bg-landActive/30"
                      >
                        {t.label}
                      </button>
                    ))}
                  </nav>
                )}

                {/* Body */}
                <div className="px-4 pb-10 pt-3">
                  {data.intro && (
                    <p className="mb-2 text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200">
                      {data.intro}
                    </p>
                  )}

                  {data.eras && data.eras.length > 0 ? (
                    <div>
                      {data.eras.map((era) => (
                        <ArticleSection
                          key={era.id}
                          era={era}
                          wide={expanded && !isMobile}
                          stackImages={isMobile}
                          extraMedia={(eraPhotoMap[era.id] ?? [])
                            .slice(0, 1)
                            .map(photoToMedia)}
                        />
                      ))}
                    </div>
                  ) : wiki ? (
                    <div
                      className="wiki-html mt-3 text-[15px] text-neutral-800 dark:text-neutral-200"
                      dangerouslySetInnerHTML={{ __html: wiki.html }}
                    />
                  ) : (
                    <EmptyState name={data.name} />
                  )}

                  <UnsplashGallery photos={galleryPhotos} loading={unsplashLoading} />
                </div>
              </>
            ) : null}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PanelSkeleton({ name }: { name: string | null }) {
  return (
    <div>
      <div className="relative h-60 w-full overflow-hidden bg-neutral-200 md:h-52 dark:bg-neutral-800">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <div className="font-serif text-2xl font-bold text-white drop-shadow">{name}</div>
        </div>
      </div>
      <div className="space-y-3 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-3.5 w-full rounded bg-neutral-200 dark:bg-neutral-800" style={{ width: `${90 - i * 7}%` }} />
        ))}
        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="aspect-[16/10] rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="aspect-[16/10] rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ name }: { name: string }) {
  return (
    <div className="py-10 text-center">
      <div className="mb-2 text-4xl">{'\u{1F5FA}\u{FE0F}'}</div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        We don't have a detailed architecture history for{' '}
        <span className="font-semibold">{name}</span> yet.
      </p>
      <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
        Try one of the featured countries highlighted on the map.
      </p>
    </div>
  );
}
