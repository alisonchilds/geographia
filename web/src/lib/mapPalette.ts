// Flat “architectural atlas” palette inspired by stylized globe illustrations.
export const ATLAS = {
  background: '#1a1a1a',
  ocean: '#2060a8',
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
  selected: '#f5c842',
  stroke: '#184d88',
} as const;

export type AtlasLandTone = keyof typeof ATLAS.land;

const RED = new Set(['United States of America']);

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
  if (RED.has(countryName)) return 'red';
  if (WHITE.has(countryName)) return 'white';
  if (TAN.has(countryName)) return 'tan';
  return 'green';
}

export function getAtlasLandFill(
  countryName: string,
  state: 'default' | 'hover' | 'selected',
): string {
  if (state === 'selected') return ATLAS.selected;
  const tone = getAtlasLandTone(countryName);
  return state === 'hover' ? ATLAS.landHover[tone] : ATLAS.land[tone];
}
