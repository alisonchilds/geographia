import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Sphere,
} from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { ATLAS, getAtlasLandFill } from '../lib/mapPalette';

// Prefixed with Vite's base URL so the topojson resolves under the GitHub
// Pages subpath (/geographia/) in production and at root ('/') during dev.
const GEO_URL = `${import.meta.env.BASE_URL}countries-110m.json`;

import type { MapPosition } from '../lib/mapTypes';

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

  const setHover = (name: string | null) => {
    setHovered(name);
    onHoverChange?.(name);
  };

  const fillFor = (name: string, isSelected: boolean, isHovered: boolean) => {
    if (isSelected) {
      return isHovered ? ATLAS.landHover.red : ATLAS.land.red;
    }
    return getAtlasLandFill(name, isHovered ? 'hover' : 'default');
  };

  return (
    <div className="absolute inset-0" style={{ backgroundColor: ATLAS.background }}>
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
          <Sphere
            id="sphere"
            stroke={ATLAS.oceanStroke}
            strokeWidth={1.2}
            fill={ATLAS.ocean}
          />
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: Geo[] }) =>
              geographies.map((geo) => {
                const name: string = geo.properties.name;
                const isSelected = selectedCountry === name;
                const isHovered = hovered === name;
                const fill = fillFor(name, isSelected, isHovered);

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
                        stroke: ATLAS.stroke,
                        strokeWidth: 0.35,
                        outline: 'none',
                        transition: 'fill 200ms ease',
                      },
                      hover: {
                        fill: fillFor(name, isSelected, true),
                        stroke: ATLAS.oceanStroke,
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: ATLAS.land.red,
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

export type { MapPosition } from '../lib/mapTypes';
