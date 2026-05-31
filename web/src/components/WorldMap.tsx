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
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Geo = any;

export default function WorldMap({
  selectedCountry,
  curatedNames,
  position,
  onSelectCountry,
  onMoveEnd,
}: WorldMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 bg-ocean">
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
          <Sphere id="sphere" stroke="#cfe8ff" strokeWidth={0.6} fill="#aadaff" />
          <Graticule stroke="#cfe8ff" strokeWidth={0.4} />
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: Geo[] }) =>
              geographies.map((geo) => {
                const name: string = geo.properties.name;
                const isSelected = selectedCountry === name;
                const isHovered = hovered === name;
                const isCurated = curatedNames.has(name);

                const fill = isSelected
                  ? '#c9a86a'
                  : isHovered
                    ? '#d9cfba'
                    : isCurated
                      ? '#dcd3bf'
                      : '#e9e3d6';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onSelectCountry(name, geoCentroid(geo) as [number, number])}
                    tabIndex={-1}
                    style={{
                      default: {
                        fill,
                        stroke: '#b9ad93',
                        strokeWidth: 0.4,
                        outline: 'none',
                        transition: 'fill 200ms ease',
                      },
                      hover: {
                        fill: isSelected ? '#c9a86a' : '#cdbf9c',
                        stroke: '#8a7c5c',
                        strokeWidth: 0.6,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#c9a86a',
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
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-ink/85 px-4 py-1.5 text-sm font-medium text-white shadow-float">
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
