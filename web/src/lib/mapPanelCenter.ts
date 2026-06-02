// Matches CountryPanel collapsed desktop layout: `left-3` + `min(420px, …)`.
export const COLLAPSED_PANEL_PX = 432;
// Map controls column: `right-4` + `w-10` toolbar.
export const MAP_CONTROLS_PX = 56;

/** Horizontal center of the map area between the collapsed panel and controls. */
export function hoverLabelLeft(panelOpen: boolean, isMobile: boolean): string | undefined {
  if (isMobile || !panelOpen) return undefined;
  return `calc(${COLLAPSED_PANEL_PX}px + (100% - ${COLLAPSED_PANEL_PX}px - ${MAP_CONTROLS_PX}px) / 2)`;
}

/**
 * Shift the map center west so a country's centroid sits in the map area
 * visible to the right of the collapsed side panel (desktop only).
 */
export function centerForCollapsedPanel(
  centroid: [number, number],
  zoom: number,
  viewportWidth: number,
  isMobile: boolean,
): [number, number] {
  if (isMobile || viewportWidth < 768) return centroid;

  const pixelShift = COLLAPSED_PANEL_PX / 2;
  const shiftFraction = pixelShift / viewportWidth;
  // Approximate visible longitude span for our Equal Earth + zoom setup.
  const visibleLng = 360 / zoom;
  const lngOffset = shiftFraction * visibleLng;

  return [centroid[0] - lngOffset, centroid[1]];
}
