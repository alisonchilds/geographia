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

/** Clamp country geometries so globe fill layers don't bleed over the ocean. */
export function prepareCountriesForGlobe(fc: FeatureCollection): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: fc.features.map((f) => ({
      ...f,
      geometry: clampGeometry(f.geometry),
    })),
  };
}
