import { useEffect, useRef, useState } from 'react';
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { feature } from 'topojson-client';
import type { FeatureCollection } from 'geojson';
import { geoCentroid } from 'd3-geo';
import { ATLAS, buildAtlasFillColorExpression } from '../lib/mapPalette';
import { glZoomToSvg, svgZoomToGl } from '../lib/mapProjection';
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

export default function GlobeMapGL({
  selectedCountry,
  curatedNames,
  position,
  onSelectCountry,
  onMoveEnd,
  onHoverChange,
}: GlobeMapGLProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
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

  // Initialise MapLibre globe once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        projection: { type: 'globe' },
        sources: {},
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: { 'background-color': ATLAS.background },
          },
        ],
      },
      center: position.coordinates,
      zoom: svgZoomToGl(position.zoom),
      minZoom: svgZoomToGl(1),
      maxZoom: svgZoomToGl(8),
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', async () => {
      if (cancelled) return;

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

        map.addSource('countries', {
          type: 'geojson',
          data: fc,
          promoteId: 'name',
        });

        map.addLayer({
          id: 'countries-fill',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-color': buildAtlasFillColorExpression(),
            'fill-opacity': 1,
          },
        });

        map.addLayer({
          id: 'countries-line',
          type: 'line',
          source: 'countries',
          paint: {
            'line-color': ATLAS.stroke,
            'line-width': 0.45,
          },
        });

        map.on('mousemove', 'countries-fill', (e) => {
          if (!e.features?.length) return;
          map.getCanvas().style.cursor = 'pointer';
          const name = e.features[0].properties?.name as string | undefined;
          if (!name || name === hoveredRef.current) return;

          if (hoveredRef.current) {
            map.setFeatureState(
              { source: 'countries', id: hoveredRef.current },
              { hover: false },
            );
          }
          hoveredRef.current = name;
          map.setFeatureState({ source: 'countries', id: name }, { hover: true });
          setHover(name);
        });

        map.on('mouseleave', 'countries-fill', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredRef.current) {
            map.setFeatureState(
              { source: 'countries', id: hoveredRef.current },
              { hover: false },
            );
            hoveredRef.current = null;
          }
          setHover(null);
        });

        map.on('click', 'countries-fill', (e) => {
          const name = e.features?.[0]?.properties?.name as string | undefined;
          if (!name) return;
          const centroid = centroidsRef.current[name] ?? [
            e.lngLat.lng,
            e.lngLat.lat,
          ];
          onSelectCountry(name, centroid);
        });

        map.on('moveend', () => {
          if (programmaticMoveRef.current) {
            programmaticMoveRef.current = false;
            return;
          }
          onMoveEnd({
            coordinates: [map.getCenter().lng, map.getCenter().lat],
            zoom: glZoomToSvg(map.getZoom()),
          });
        });

        setReady(true);
      } catch {
        /* topojson failed — globe still shows, without countries */
      }
    });

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, []);

  // Sync camera when parent updates position (zoom buttons, country fly-to).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    programmaticMoveRef.current = true;
    map.jumpTo({
      center: position.coordinates,
      zoom: svgZoomToGl(position.zoom),
    });
  }, [position, ready]);

  // Highlight selected country via feature-state (same red as SVG map).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    if (selectedRef.current && selectedRef.current !== selectedCountry) {
      map.setFeatureState(
        { source: 'countries', id: selectedRef.current },
        { selected: false },
      );
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
