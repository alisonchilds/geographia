import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { feature } from 'topojson-client';
import { geoCentroid } from 'd3-geo';
import WorldMap from './components/WorldMap';
import MapOverlay from './components/MapOverlay';
import CountryPanel from './components/CountryPanel';
import { CURATED } from './data/countries';
import { loadCountry } from './lib/wikipedia';
import { useMapRenderer } from './lib/mapRenderer';
import type { MapPosition } from './lib/mapTypes';
import type { PanelData } from './types';

const GlobeMapGL = lazy(() => import('./components/GlobeMapGL'));

// Prefixed with Vite's base URL so it resolves under the GitHub Pages
// subpath (/geographia/) in production and at root ('/') during dev.
const GEO_URL = `${import.meta.env.BASE_URL}countries-110m.json`;
// Center on the Americas to match the stylized atlas globe composition.
const HOME: MapPosition = { coordinates: [-95, 25], zoom: 1 };

const CURATED_NAMES = new Set(Object.keys(CURATED));

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [position, setPosition] = useState<MapPosition>(HOME);
  const [panelData, setPanelData] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const mapRenderer = useMapRenderer();

  const [countryNames, setCountryNames] = useState<string[]>([]);
  const centroidsRef = useRef<Record<string, [number, number]>>({});
  const requestId = useRef(0);

  // Build the country list + centroid lookup once from the topojson.
  useEffect(() => {
    let active = true;
    fetch(GEO_URL)
      .then((r) => r.json())
      .then((topology) => {
        if (!active) return;
        const fc = feature(topology, topology.objects.countries);
        const names: string[] = [];
        const centroids: Record<string, [number, number]> = {};
        for (const f of fc.features) {
          const name = (f.properties as { name?: string } | null)?.name;
          if (!name) continue;
          names.push(name);
          centroids[name] = geoCentroid(f) as [number, number];
        }
        names.sort((a, b) => a.localeCompare(b));
        setCountryNames(names);
        centroidsRef.current = centroids;
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const selectCountry = useCallback((name: string, centroid: [number, number]) => {
    setSelected(name);
    setOpen(true);
    setPosition({ coordinates: centroid, zoom: 4 });

    const id = ++requestId.current;
    setLoading(true);
    setPanelData(null);
    loadCountry(name)
      .then((data) => {
        if (id === requestId.current) setPanelData(data);
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, []);

  const handleSearchSelect = useCallback(
    (name: string) => {
      const centroid = centroidsRef.current[name] ?? HOME.coordinates;
      selectCountry(name, centroid);
    },
    [selectCountry],
  );

  const closePanel = useCallback(() => {
    setOpen(false);
    setSelected(null);
  }, []);

  const zoomIn = () =>
    setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.5, 8) }));
  const zoomOut = () =>
    setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }));
  const reset = () => {
    setPosition(HOME);
    closePanel();
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {mapRenderer === 'globe' ? (
        <Suspense fallback={null}>
          <GlobeMapGL
            selectedCountry={selected}
            curatedNames={CURATED_NAMES}
            position={position}
            onSelectCountry={selectCountry}
            onMoveEnd={setPosition}
            onHoverChange={setHoveredCountry}
          />
        </Suspense>
      ) : (
        <WorldMap
          selectedCountry={selected}
          curatedNames={CURATED_NAMES}
          position={position}
          onSelectCountry={selectCountry}
          onMoveEnd={setPosition}
          onHoverChange={setHoveredCountry}
        />
      )}

      <MapOverlay
        countryNames={countryNames}
        curatedNames={CURATED_NAMES}
        panelOpen={open}
        mapRenderer={mapRenderer}
        onSearchSelect={handleSearchSelect}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={reset}
      />

      <CountryPanel
        open={open}
        loading={loading}
        data={panelData}
        countryName={selected}
        onClose={closePanel}
      />

      {/* First-run hint — hidden while hovering a country so it never covers the label */}
      {!open && !hoveredCountry && countryNames.length > 0 && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/80 px-4 py-2 text-sm text-white shadow-float">
          Click a country to explore its architecture
        </div>
      )}
    </div>
  );
}
