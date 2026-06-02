// Flat “architectural atlas” palette inspired by stylized globe illustrations.
import type { ExpressionSpecification } from 'maplibre-gl';

export const ATLAS = {
  background: '#1a1a1a',
  ocean: '#2060a8',
  /** Lighter blue for the Mapbox/MapLibre globe sphere surface. */
  globeOcean: '#aadaff',
  oceanStroke: '#184d88',
  land: {
    red: '#ff204e',
    green: '#66b04b',
    tan: '#ddbb88',
    white: '#ffffff',
  },
  landHover: {
    red: '#ff4d70',
    green: '#7dc95e',
    tan: '#ecd4a8',
    white: '#f5f5f5',
  },
  stroke: '#184d88',
} as const;

export type AtlasLandTone = keyof typeof ATLAS.land;

const WHITE = new Set(['Greenland', 'Antarctica', 'Fr. S. Antarctic Lands']);

// Northern Africa, Mexico, and the southern cone — tan in the reference art.
const TAN = new Set([
  'Mexico',
  'Morocco',
  'Algeria',
  'Tunisia',
  'Libya',
  'Egypt',
  'W. Sahara',
  'Mauritania',
  'Mali',
  'Niger',
  'Chad',
  'Chile',
  'Argentina',
]);

export function getAtlasLandTone(countryName: string): AtlasLandTone {
  if (WHITE.has(countryName)) return 'white';
  if (TAN.has(countryName)) return 'tan';
  return 'green';
}

export function getAtlasLandFill(
  countryName: string,
  state: 'default' | 'hover' | 'selected',
): string {
  if (state === 'selected') {
    return ATLAS.land.red;
  }
  const tone = getAtlasLandTone(countryName);
  return state === 'hover' ? ATLAS.landHover[tone] : ATLAS.land[tone];
}

function buildMatchExpression(
  colorMap: Record<AtlasLandTone, string>,
  defaultColor: string,
): ExpressionSpecification {
  const pairs: (string | ExpressionSpecification)[] = [];
  for (const name of WHITE) pairs.push(name, colorMap.white);
  for (const name of TAN) pairs.push(name, colorMap.tan);
  return ['match', ['get', 'name'], ...pairs, defaultColor] as unknown as ExpressionSpecification;
}

/** MapLibre `fill-color` expression mirroring the SVG atlas palette. */
export function buildAtlasFillColorExpression(): ExpressionSpecification {
  return [
    'case',
    ['boolean', ['feature-state', 'selected'], false],
    [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      ATLAS.landHover.red,
      ATLAS.land.red,
    ],
    ['boolean', ['feature-state', 'hover'], false],
    buildMatchExpression(ATLAS.landHover, ATLAS.landHover.green),
    buildMatchExpression(ATLAS.land, ATLAS.land.green),
  ];
}
