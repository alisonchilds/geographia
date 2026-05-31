import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Sphere,
  Graticule,
} from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { useIsDark } from '../lib/theme';

// Prefixed with Vite's base URL so the topojson resolves under the GitHub
// Pages subpath (/geographia/) in production and at root ('/') during dev.
const GEO_URL = `${import.meta.env.BASE_URL}countries-110m.json`;

export interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

interface WorldMapProps {
  selectedCountry: string | null;
  curatedNames: Set<string>;
  position: MapPosition;
  onSelectCountry: (name: string, centroid: [number, number]) => void;
  onMoveEnd: (position: MapPosition) => void;
  onHoverChange?: (name: string | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Geo = any;

export default function WorldMap({
  selectedCountry,
  curatedNames,
  position,
  onSelectCountry,
  onMoveEnd,
  onHoverChange,
}: WorldMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const dark = useIsDark();

  const setHover = (name: string | null) => {
    setHovered(name);
    onHoverChange?.(name);
  };

  const c = dark
    ? {
        ocean: 'bg-[#0b1220]',
        sphereFill: '#0e1726',
        sphereStroke: '#1e2a40',
        graticule: '#1b2640',
        landDefault: '#334155',
        landCurated: '#3d4a63',
        landHover: '#4b5a73',
        landSelected: '#c9a86a',
        strokeDefault: '#1e293b',
        strokeHover: '#94a3b8',
      }
    : {
        ocean: 'bg-ocean',
        sphereFill: '#aadaff',
        sphereStroke: '#cfe8ff',
        graticule: '#cfe8ff',
        landDefault: '#e9e3d6',
        landCurated: '#dcd3bf',
        landHover: '#d9cfba',
        landSelected: '#c9a86a',
        strokeDefault: '#b9ad93',
        strokeHover: '#8a7c5c',
      };

  return (
    <div className={`absolute inset-0 ${c.ocean}`}>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 170 }}
        width={980}
        height={520}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          minZoom={1}
          maxZoom={8}
          onMoveEnd={onMoveEnd}
        >
          <Sphere id="sphere" stroke={c.sphereStroke} strokeWidth={0.6} fill={c.sphereFill} />
          <Graticule stroke={c.graticule} strokeWidth={0.4} />
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: Geo[] }) =>
              geographies.map((geo) => {
                const name: string = geo.properties.name;
                const isSelected = selectedCountry === name;
                const isHovered = hovered === name;
                const isCurated = curatedNames.has(name);

                const fill = isSelected
                  ? c.landSelected
                  : isHovered
                    ? c.landHover
                    : isCurated
                      ? c.landCurated
                      : c.landDefault;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHover(name)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => onSelectCountry(name, geoCentroid(geo) as [number, number])}
                    tabIndex={-1}
                    style={{
                      default: {
                        fill,
                        stroke: c.strokeDefault,
                        strokeWidth: 0.4,
                        outline: 'none',
                        transition: 'fill 200ms ease',
                      },
                      hover: {
                        fill: isSelected ? c.landSelected : c.landHover,
                        stroke: c.strokeHover,
                        strokeWidth: 0.6,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: c.landSelected,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {hovered && (
        <div className="pointer-events-none absolute bottom-16 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/85 px-4 py-1.5 text-sm font-medium text-white shadow-float">
          {hovered}
          {curatedNames.has(hovered) && (
            <span className="ml-2 rounded-full bg-landActive px-2 py-0.5 text-[11px] font-semibold text-ink">
              Featured
            </span>
          )}
        </div>
      )}
    </div>
  );
}
