import { useMemo, useState } from 'react';
import { CURATED } from '../data/countries';
import { toggleMapRenderer } from '../lib/mapRenderer';
import { globeEngineLabel } from '../lib/mapbox';
import type { MapRenderer } from '../lib/mapTypes';
import { toggleTheme, useIsDark } from '../lib/theme';

interface MapOverlayProps {
  countryNames: string[];
  curatedNames: Set<string>;
  panelOpen: boolean;
  mapRenderer: MapRenderer;
  onSearchSelect: (name: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

// How many featured places to show in the landing card. Kept small so the card
// never covers too much of the map.
const FEATURED_LIMIT = 5;

// Shared dark-mode chrome for floating map controls.
const overlayDark =
  'dark:bg-overlayDark dark:text-neutral-100 dark:shadow-float-dark';
const overlayDarkSolid =
  'dark:bg-overlayDark dark:shadow-float-dark';
const overlayDarkHover = 'dark:hover:bg-overlayDarkHover';

export default function MapOverlay({
  countryNames,
  curatedNames,
  panelOpen,
  mapRenderer,
  onSearchSelect,
  onZoomIn,
  onZoomOut,
  onReset,
}: MapOverlayProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const dark = useIsDark();

  const isSearching = query.trim().length > 0;

  // Curated picks, surfaced as a Google-Maps-style "recents" list on landing.
  const featured = useMemo(
    () =>
      Object.keys(CURATED)
        .filter((n) => countryNames.includes(n))
        .slice(0, FEATURED_LIMIT),
    [countryNames],
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return featured;
    return countryNames
      .filter((n) => n.toLowerCase().includes(q))
      .sort((a, b) => {
        const ac = curatedNames.has(a) ? 0 : 1;
        const bc = curatedNames.has(b) ? 0 : 1;
        return ac - bc || a.localeCompare(b);
      })
      .slice(0, 8);
  }, [query, featured, countryNames, curatedNames]);

  // Show the suggestion list when the user is actively searching/focused, or
  // as the auto-expanded landing card (until a panel opens or it's dismissed).
  const showList =
    matches.length > 0 &&
    (focused || isSearching || (!panelOpen && !dismissed));

  const choose = (name: string) => {
    onSearchSelect(name);
    setQuery('');
    setFocused(false);
  };

  return (
    <>
      {/* Brand + search bar. On mobile use equal inset-x margins; on desktop
          align with the info panel's left edge and max width. */}
      <div className="pointer-events-none absolute inset-x-3 top-4 z-40 md:inset-x-auto md:left-3 md:w-[min(420px,calc(100%-1.5rem))]">
        <div className="pointer-events-auto relative">
          <div className={`flex items-center gap-2.5 rounded-2xl bg-white/95 py-2 pl-3 pr-3 shadow-float backdrop-blur ${overlayDark}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-landActive text-lg">
              {'\u{1F3DB}\u{FE0F}'}
            </div>
            <div className="hidden shrink-0 leading-tight sm:block">
              <div className="font-serif text-[15px] font-semibold text-ink dark:text-neutral-100">
                Atlas of Architecture
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                A world history of building
              </div>
            </div>

            <div className="mx-1 hidden h-8 w-px shrink-0 bg-neutral-200 sm:block dark:bg-neutral-700" />

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-neutral-400">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Search a country..."
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-neutral-400 dark:text-neutral-100"
              />
            </div>
          </div>

          {showList && (
            <div className={`absolute mt-1 max-h-[60vh] w-full overflow-auto rounded-xl bg-white py-1 shadow-panel ${overlayDarkSolid}`}>
              {!isSearching && (
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                    Featured places
                  </span>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setDismissed(true)}
                    aria-label="Hide featured places"
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-ink ${overlayDarkHover} dark:hover:text-neutral-100`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}
              <ul>
                {matches.map((name) => {
                  const curated = CURATED[name];
                  return (
                    <li key={name}>
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => choose(name)}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-neutral-100 ${overlayDarkHover}`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg dark:bg-overlayDarkHover">
                          {curated?.flagEmoji ?? '\u{1F4CD}'}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink dark:text-neutral-100">{name}</span>
                          {!isSearching && curated?.tagline && (
                            <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                              {curated.tagline}
                            </span>
                          )}
                        </span>
                        {isSearching && curatedNames.has(name) && (
                          <span className="shrink-0 rounded-full bg-landActive/30 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
                            Featured
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Zoom + view controls, bottom-right */}
      <div className="absolute bottom-6 right-4 z-40 flex flex-col gap-2">
        <button
          onClick={toggleMapRenderer}
          aria-label={mapRenderer === 'globe' ? 'Switch to flat map' : 'Try 3D globe'}
          title={mapRenderer === 'globe' ? 'Flat map' : `3D globe (${globeEngineLabel})`}
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-ink shadow-float backdrop-blur hover:bg-neutral-100 ${overlayDark} ${overlayDarkHover}`}
        >
          {mapRenderer === 'globe' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="2" />
              <path d="M4 10h16M8 6v12M16 6v12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
              <path
                d="M4 12h16M12 4c-2.5 2.8-2.5 13.2 0 16M12 4c2.5 2.8 2.5 13.2 0 16"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          )}
        </button>

        <button
          onClick={toggleTheme}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Light mode' : 'Dark mode'}
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-ink shadow-float backdrop-blur hover:bg-neutral-100 ${overlayDark} ${overlayDarkHover}`}
        >
          {dark ? (
            // Sun: click to go light
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            // Moon: click to go dark
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div className={`flex flex-col overflow-hidden rounded-xl bg-white/95 shadow-float backdrop-blur ${overlayDark}`}>
          <button
            onClick={onZoomIn}
            aria-label="Zoom in"
            className={`flex h-10 w-10 items-center justify-center text-xl text-ink hover:bg-neutral-100 dark:text-neutral-100 ${overlayDarkHover}`}
          >
            +
          </button>
          <div className="mx-auto h-px w-6 bg-neutral-200 dark:bg-white/10" />
          <button
            onClick={onZoomOut}
            aria-label="Zoom out"
            className={`flex h-10 w-10 items-center justify-center text-xl text-ink hover:bg-neutral-100 dark:text-neutral-100 ${overlayDarkHover}`}
          >
            {'\u2212'}
          </button>
        </div>
        <button
          onClick={onReset}
          aria-label="Reset view"
          title="Reset view"
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-ink shadow-float backdrop-blur hover:bg-neutral-100 ${overlayDark} ${overlayDarkHover}`}
        >
          {/* Recenter / locate target */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 2v3M12 19v3M2 12h3M19 12h3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="2.4" fill="currentColor" />
          </svg>
        </button>
      </div>
    </>
  );
}
