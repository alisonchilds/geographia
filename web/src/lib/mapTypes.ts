export interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

export type MapRenderer = 'svg' | 'globe';
