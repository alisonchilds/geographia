import { fixGeoJson } from 'antimeridian-ts';
import type { FeatureCollection, Geometry, MultiPolygon, Polygon, Position } from 'geojson';

// Web Mercator / globe rendering breaks down beyond these latitudes and draws
// spurious fills over the ocean (Natural Earth includes ±90° rings).
const LAT_LIMIT = 85.0511;
const DATELINE_NUDGE = 179.99;

function clampLat(lat: number): number {
  return Math.max(-LAT_LIMIT, Math.min(LAT_LIMIT, lat));
}

function nudgeLng(lng: number): number {
  if (lng <= -180) return -DATELINE_NUDGE;
  if (lng >= 180) return DATELINE_NUDGE;
  return lng;
}

function normalizeRing(ring: Position[]): Position[] {
  const out: Position[] = [];
  for (const [lng, lat] of ring) {
    const point: Position = [nudgeLng(lng), clampLat(lat)];
    const prev = out[out.length - 1];
    if (prev && prev[0] === point[0] && prev[1] === point[1]) continue;
    out.push(point);
  }
  return out;
}

function ringHasLongEdge(ring: Position[]): boolean {
  for (let i = 0; i < ring.length - 1; i++) {
    if (Math.abs(ring[i + 1][0] - ring[i][0]) > 120) return true;
  }
  return false;
}

/** Split a ring when consecutive vertices jump across the dateline. */
function splitRingAtDateline(ring: Position[]): Position[][] {
  if (ring.length < 4) return [ring];

  const open =
    ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring.slice();

  const chunks: Position[][] = [];
  let chunk: Position[] = [open[0]];

  for (let i = 0; i < open.length; i++) {
    const p0 = i === 0 ? open[0] : open[i];
    const p1 = open[(i + 1) % open.length];
    if (i > 0) chunk.push(p0);

    const rawDiff = p1[0] - p0[0];
    if (Math.abs(rawDiff) > 120) {
      const exitLng = rawDiff > 0 ? -180 : 180;
      const enterLng = rawDiff > 0 ? 180 : -180;
      const adjEnd = rawDiff > 0 ? p1[0] - 360 : p1[0] + 360;
      const t = (exitLng - p0[0]) / (adjEnd - p0[0]);
      const lat = p0[1] + t * (p1[1] - p0[1]);
      chunk.push([exitLng, lat]);
      if (chunk.length >= 3) chunks.push([...chunk, chunk[0]]);
      chunk = [[enterLng, lat], p1];
    } else if (i === open.length - 1) {
      chunk.push(p1);
    }
  }

  if (chunk.length >= 3) chunks.push([...chunk, chunk[0]]);
  return chunks.length > 0 ? chunks : [ring];
}

function splitGeometryAtDateline(geometry: Geometry): Geometry {
  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates.flatMap((ring) => splitRingAtDateline(ring));
    if (rings.length === 1) return { type: 'Polygon', coordinates: [rings[0]] };
    return { type: 'MultiPolygon', coordinates: rings.map((ring) => [ring]) };
  }

  if (geometry.type === 'MultiPolygon') {
    const polys = geometry.coordinates.flatMap((poly) =>
      splitRingAtDateline(poly[0]).map((ring) => [ring]),
    );
    if (polys.length === 1) return { type: 'Polygon', coordinates: polys[0] as Polygon['coordinates'] };
    return { type: 'MultiPolygon', coordinates: polys as MultiPolygon['coordinates'] };
  }

  return geometry;
}

function clampGeometry(geometry: Geometry): Geometry {
  if (geometry.type === 'Polygon') {
    return {
      ...geometry,
      coordinates: geometry.coordinates
        .map((ring) => normalizeRing(ring))
        .filter((ring) => ring.length >= 4 && !ringHasLongEdge(ring)),
    };
  }

  if (geometry.type === 'MultiPolygon') {
    const coordinates = geometry.coordinates
      .map((poly) => [normalizeRing(poly[0])] as Polygon['coordinates'])
      .filter((poly) => poly[0].length >= 4 && !ringHasLongEdge(poly[0]));
    if (coordinates.length === 0) return geometry;
    if (coordinates.length === 1) return { type: 'Polygon', coordinates: coordinates[0] };
    return { type: 'MultiPolygon', coordinates: coordinates as MultiPolygon['coordinates'] };
  }

  return geometry;
}

function fixAntimeridian(geometry: Geometry): Geometry {
  const split = splitGeometryAtDateline(geometry);
  try {
    const fixed = fixGeoJson({ type: 'Feature', properties: {}, geometry: split });
    if (fixed.type === 'Feature') return fixed.geometry;
  } catch {
    /* fall through — Antarctica pole rings */
  }
  return split;
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
