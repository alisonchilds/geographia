declare module 'topojson-client' {
  // Minimal surface used by this app.
  export function feature(
    topology: unknown,
    object: unknown,
  ): { type: 'FeatureCollection'; features: GeoJSON.Feature[] };
}
