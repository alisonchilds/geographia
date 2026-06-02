import { useEffect, useRef, useState } from 'react';
import { feature } from 'topojson-client';
import type { FeatureCollection } from 'geojson';
import { geoCentroid } from 'd3-geo';
import { ATLAS, buildAtlasFillColorExpression } from '../lib/mapPalette';
import { WORLD_OCEAN } from '../lib/globeOcean';
import { glZoomToSvg, svgZoomToGl } from '../lib/mapProjection';
import { isMapboxEnabled, MAPBOX_TOKEN } from '../lib/mapbox';
import type { MapPosition } from '../lib/mapTypes';

const GEO_URL = `${import.meta.env.BASE_URL}countries-110m.json`;

interface GlobeMapGLProps {
  selectedCountry: string | null;
  curatedNames: Set<string>;
  position: MapPosition;
  onSelectCountry: (name: string, centroid: [number, number]) => void;
  onMoveEnd: (position: MapPosition) => void;
  onHoverChange?: (name: string | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GlobeMap = any;

function configureGlobeAtmosphere(map: GlobeMap) {
  if (typeof map.setFog === 'function') {
    map.setFog({
      color: ATLAS.globeOcean,
      'high-color': ATLAS.globeOcean,
      'space-color': ATLAS.background,
      'horizon-blend': 0.08,
      'star-intensity': 0,
    });
  }
}

async function createGlobeMap(
  container: HTMLDivElement,
  center: [number, number],
  zoom: number,
): Promise<GlobeMap> {
  const style = {
    version: 8 as const,
    projection: { type: 'globe' as const },
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background' as const,
        paint: { 'background-color': ATLAS.background },
      },
    ],
  };

  if (isMapboxEnabled) {
    const mapboxgl = await import('mapbox-gl');
    await import('mapbox-gl/dist/mapbox-gl.css');
    mapboxgl.default.accessToken = MAPBOX_TOKEN!;
    const map = new mapboxgl.default.Map({
      container,
      style: style as unknown as mapboxgl.StyleSpecification,
      center,
      zoom,
      minZoom: svgZoomToGl(1),
      maxZoom: svgZoomToGl(8),
      attributionControl: false,
      antialias: true,
    });
    map.addControl(new mapboxgl.default.AttributionControl({ compact: true }), 'bottom-left');
    return map;
  }

  const maplibregl = await import('maplibre-gl');
  await import('maplibre-gl/dist/maplibre-gl.css');
  return new maplibregl.default.Map({
    container,
    style: style as unknown as maplibregl.StyleSpecification,
    center,
    zoom,
    minZoom: svgZoomToGl(1),
    maxZoom: svgZoomToGl(8),
    attributionControl: false,
  });
}

export default function GlobeMapGL({
  selectedCountry,
  curatedNames,
  position,
  onSelectCountry,
  onMoveEnd,
  onHoverChange,
}: GlobeMapGLProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<GlobeMap | null>(null);
  const centroidsRef = useRef<Record<string, [number, number]>>({});
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(null);
  const programmaticMoveRef = useRef(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const setHover = (name: string | null) => {
    setHovered(name);
    onHoverChange?.(name);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    void createGlobeMap(container, position.coordinates, svgZoomToGl(position.zoom)).then(
      (map) => {
        if (cancelled) {
          map.remove();
          return;
        }

        mapRef.current = map;

        map.on('load', () => {
          if (cancelled) return;
          configureGlobeAtmosphere(map);
          void setupCountries(map);
        });

        resizeObserver = new ResizeObserver(() => map.resize());
        resizeObserver.observe(container);

        async function setupCountries(m: GlobeMap) {
          try {
            const topology = await fetch(GEO_URL).then((r) => r.json());
            if (cancelled) return;

            const fc = feature(topology, topology.objects.countries) as FeatureCollection;
            const centroids: Record<string, [number, number]> = {};
            for (const f of fc.features) {
              const name = (f.properties as { name?: string } | null)?.name;
              if (!name) continue;
              centroids[name] = geoCentroid(f) as [number, number];
            }
            centroidsRef.current = centroids;

            m.addSource('ocean', { type: 'geojson', data: WORLD_OCEAN });
            m.addLayer({
              id: 'ocean-fill',
              type: 'fill',
              source: 'ocean',
              paint: {
                'fill-color': ATLAS.globeOcean,
                'fill-antialias': true,
              },
            });

            m.addSource('countries', {
              type: 'geojson',
              data: fc,
              promoteId: 'name',
            });

            m.addLayer({
              id: 'countries-fill',
              type: 'fill',
              source: 'countries',
              paint: {
                'fill-color': buildAtlasFillColorExpression(),
                'fill-opacity': 1,
                'fill-antialias': true,
              },
            });

            m.addLayer({
              id: 'countries-line',
              type: 'line',
              source: 'countries',
              paint: {
                'line-color': ATLAS.stroke,
                'line-width': 0.35,
                'line-opacity': 0.85,
              },
            });

            m.on('mousemove', 'countries-fill', (e: {
              features?: { properties?: { name?: string } }[];
            }) => {
              if (!e.features?.length) return;
              m.getCanvas().style.cursor = 'pointer';
              const name = e.features[0].properties?.name as string | undefined;
              if (!name || name === hoveredRef.current) return;

              if (hoveredRef.current) {
                m.setFeatureState({ source: 'countries', id: hoveredRef.current }, { hover: false });
              }
              hoveredRef.current = name;
              m.setFeatureState({ source: 'countries', id: name }, { hover: true });
              setHover(name);
            });

            m.on('mouseleave', 'countries-fill', () => {
              m.getCanvas().style.cursor = '';
              if (hoveredRef.current) {
                m.setFeatureState({ source: 'countries', id: hoveredRef.current }, { hover: false });
                hoveredRef.current = null;
              }
              setHover(null);
            });

            m.on('click', 'countries-fill', (e: {
              features?: { properties?: { name?: string } }[];
              lngLat: { lng: number; lat: number };
            }) => {
              const name = e.features?.[0]?.properties?.name as string | undefined;
              if (!name) return;
              const centroid = centroidsRef.current[name] ?? [e.lngLat.lng, e.lngLat.lat];
              onSelectCountry(name, centroid);
            });

            m.on('moveend', () => {
              if (programmaticMoveRef.current) {
                programmaticMoveRef.current = false;
                return;
              }
              onMoveEnd({
                coordinates: [m.getCenter().lng, m.getCenter().lat],
                zoom: glZoomToSvg(m.getZoom()),
              });
            });

            setReady(true);
          } catch {
            /* topojson failed */
          }
        }
      },
    );

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    programmaticMoveRef.current = true;
    map.jumpTo({
      center: position.coordinates,
      zoom: svgZoomToGl(position.zoom),
    });
  }, [position, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (selectedRef.current && selectedRef.current !== selectedCountry) {
      map.setFeatureState({ source: 'countries', id: selectedRef.current }, { selected: false });
    }
    if (selectedCountry) {
      map.setFeatureState({ source: 'countries', id: selectedCountry }, { selected: true });
    }
    selectedRef.current = selectedCountry;
  }, [selectedCountry, ready]);

  return (
    <div className="absolute inset-0" style={{ backgroundColor: ATLAS.background }}>
      <div ref={containerRef} className="h-full w-full" />

      {hovered && (
        <div className="pointer-events-none absolute bottom-16 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 px-4 py-1.5 text-sm font-medium text-white shadow-float">
          {hovered}
          {curatedNames.has(hovered) && (
            <span className="ml-2 rounded-full bg-[#f5c842] px-2 py-0.5 text-[11px] font-semibold text-[#1a1a1a]">
              Featured
            </span>
          )}
        </div>
      )}
    </div>
  );
}
