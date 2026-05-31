import { useMemo, useState } from 'react';

interface MapOverlayProps {
  countryNames: string[];
  curatedNames: Set<string>;
  onSearchSelect: (name: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function MapOverlay({
  countryNames,
  curatedNames,
  onSearchSelect,
  onZoomIn,
  onZoomOut,
  onReset,
}: MapOverlayProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Surface the curated countries as suggestions when the box is empty.
      return countryNames.filter((n) => curatedNames.has(n)).slice(0, 8);
    }
    return countryNames
      .filter((n) => n.toLowerCase().includes(q))
      .sort((a, b) => {
        const ac = curatedNames.has(a) ? 0 : 1;
        const bc = curatedNames.has(b) ? 0 : 1;
        return ac - bc || a.localeCompare(b);
      })
      .slice(0, 8);
  }, [query, countryNames, curatedNames]);

  const choose = (name: string) => {
    onSearchSelect(name);
    setQuery('');
    setOpen(false);
  };

  return (
    <>
      {/* Brand + search combined into a single floating bar, top-left.
          Width + left edge match the info panel's default size. */}
      <div className="pointer-events-none absolute left-3 top-4 z-40 w-[min(420px,90vw)]">
        <div className="pointer-events-auto relative">
          <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 py-2 pl-3 pr-3 shadow-float backdrop-blur">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-landActive text-lg">
              {'\u{1F3DB}\u{FE0F}'}
            </div>
            <div className="hidden shrink-0 leading-tight sm:block">
              <div className="font-serif text-[15px] font-semibold text-ink">
                Atlas of Architecture
              </div>
              <div className="text-[11px] text-neutral-500">
                A world history of building
              </div>
            </div>

            <div className="mx-1 hidden h-8 w-px shrink-0 bg-neutral-200 sm:block" />

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 text-neutral-400">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder="Search a country..."
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          {open && matches.length > 0 && (
            <ul className="absolute mt-1 max-h-72 w-full overflow-auto rounded-xl bg-white py-1 shadow-panel">
              {!query.trim() && (
                <li className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                  Featured countries
                </li>
              )}
              {matches.map((name) => (
                <li key={name}>
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(name)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ink hover:bg-neutral-100"
                  >
                    <span>{name}</span>
                    {curatedNames.has(name) && (
                      <span className="rounded-full bg-landActive/30 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                        Featured
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Zoom controls, bottom-right */}
      <div className="absolute bottom-6 right-4 z-40 flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden rounded-xl bg-white/95 shadow-float backdrop-blur">
          <button
            onClick={onZoomIn}
            aria-label="Zoom in"
            className="flex h-10 w-10 items-center justify-center text-xl text-ink hover:bg-neutral-100"
          >
            +
          </button>
          <div className="mx-auto h-px w-6 bg-neutral-200" />
          <button
            onClick={onZoomOut}
            aria-label="Zoom out"
            className="flex h-10 w-10 items-center justify-center text-xl text-ink hover:bg-neutral-100"
          >
            {'\u2212'}
          </button>
        </div>
        <button
          onClick={onReset}
          aria-label="Reset view"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-ink shadow-float backdrop-blur hover:bg-neutral-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.5-6.5-1.4 1.4M7.9 16.1l-1.4 1.4m12.6 0-1.4-1.4M7.9 7.9 6.5 6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </>
  );
}
