import { fixGeoJson } from 'antimeridian-ts';
import type { FeatureCollection, Geometry } from 'geojson';

// Web Mercator / globe rendering breaks down beyond these latitudes and draws
// spurious fills over the ocean (Natural Earth includes ±90° rings).
const LAT_LIMIT = 85.0511;

function clampLat(lat: number): number {
  return Math.max(-LAT_LIMIT, Math.min(LAT_LIMIT, lat));
}

function clampRing(ring: number[][]): number[][] {
  return ring.map(([lng, lat]) => [lng, clampLat(lat)]);
}

function clampGeometry(geometry: Geometry): Geometry {
  switch (geometry.type) {
    case 'Polygon':
      return { ...geometry, coordinates: geometry.coordinates.map(clampRing) };
    case 'MultiPolygon':
      return {
        ...geometry,
        coordinates: geometry.coordinates.map((poly) => poly.map(clampRing)),
      };
    default:
      return geometry;
  }
}

/** Split polygons that cross the dateline (e.g. Russia) so globe fills stay on land. */
function fixAntimeridian(geometry: Geometry): Geometry {
  try {
    const fixed = fixGeoJson({ type: 'Feature', properties: {}, geometry });
    if (fixed.type === 'Feature') return fixed.geometry;
    return geometry;
  } catch {
    // Antarctica has pole-wrapping rings that the splitter can't handle; lat clamp is enough.
    return geometry;
  }
}

/** Prepare Natural Earth country shapes for Mapbox / MapLibre globe rendering. */
export function prepareCountriesForGlobe(fc: FeatureCollection): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: fc.features.map((f) => ({
      ...f,
      geometry: clampGeometry(fixAntimeridian(f.geometry)),
    })),
  };
}
