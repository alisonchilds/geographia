// Mapbox GL integration for the 3D globe view.
//
// Set VITE_MAPBOX_ACCESS_TOKEN in .env.local (see .env.example).
// Get a free token at https://account.mapbox.com/access-tokens/

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined;

export const isMapboxEnabled = Boolean(MAPBOX_TOKEN);
