import { useMemo, useState } from 'react';
import { CURATED } from '../data/countries';
import { toggleTheme, useIsDark } from '../lib/theme';

interface MapOverlayProps {
  countryNames: string[];
  curatedNames: Set<string>;
  panelOpen: boolean;
  onSearchSelect: (name: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

// How many featured places to show in the landing card. Kept small so the card
// never covers too much of the map.
const FEATURED_LIMIT = 5;

export default function MapOverlay({
  countryNames,
  curatedNames,
  panelOpen,
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
          <div className="flex items-center gap-2.5 rounded-xl bg-[#2a2a2a]/95 py-2 pl-3 pr-3 shadow-float backdrop-blur">
            <div className="hidden shrink-0 leading-tight sm:block">
              <div className="text-[15px] font-semibold tracking-tight text-white">
                Atlas of Architecture
              </div>
            </div>

            <div className="mx-1 hidden h-8 w-px shrink-0 bg-white/15 sm:block" />

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/50">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Search a country..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
            </div>
          </div>

          {showList && (
            <div className="absolute mt-1 max-h-[60vh] w-full overflow-auto rounded-xl bg-[#2a2a2a] py-1 shadow-panel">
              {!isSearching && (
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
                    Featured places
                  </span>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setDismissed(true)}
                    aria-label="Hide featured places"
                    className="flex h-6 w-6 items-center justify-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
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
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-white/10"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
                          {curated?.flagEmoji ?? '\u{1F4CD}'}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-white">{name}</span>
                          {!isSearching && curated?.tagline && (
                            <span className="block truncate text-xs text-white/50">
                              {curated.tagline}
                            </span>
                          )}
                        </span>
                        {isSearching && curatedNames.has(name) && (
                          <span className="shrink-0 rounded-full bg-[#f5c842]/25 px-2 py-0.5 text-[10px] font-semibold text-[#f5c842]">
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
          onClick={toggleTheme}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Light mode' : 'Dark mode'}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a2a2a]/95 text-white shadow-float backdrop-blur hover:bg-[#353535]"
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

        <div className="flex flex-col overflow-hidden rounded-xl bg-[#2a2a2a]/95 shadow-float backdrop-blur">
          <button
            onClick={onZoomIn}
            aria-label="Zoom in"
            className="flex h-10 w-10 items-center justify-center text-xl text-white hover:bg-[#353535]"
          >
            +
          </button>
          <div className="mx-auto h-px w-6 bg-white/15" />
          <button
            onClick={onZoomOut}
            aria-label="Zoom out"
            className="flex h-10 w-10 items-center justify-center text-xl text-white hover:bg-[#353535]"
          >
            {'\u2212'}
          </button>
        </div>
        <button
          onClick={onReset}
          aria-label="Reset view"
          title="Reset view"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a2a2a]/95 text-white shadow-float backdrop-blur hover:bg-[#353535]"
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
