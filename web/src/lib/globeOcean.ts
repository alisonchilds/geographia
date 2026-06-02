import type { FeatureCollection } from 'geojson';

// Two hemispheres avoid an antimeridian seam on the globe. Placed beneath country
// polygons so the sphere reads as light-blue ocean instead of dark background.
export const WORLD_OCEAN: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-180, -90],
              [0, -90],
              [0, 90],
              [-180, 90],
              [-180, -90],
            ],
          ],
          [
            [
              [0, -90],
              [180, -90],
              [180, 90],
              [0, 90],
              [0, -90],
            ],
          ],
        ],
      },
    },
  ],
};
