// Keep SVG (react-simple-maps) and MapLibre globe zoom levels roughly aligned.
const GL_BASE = 1.15;

export function svgZoomToGl(svgZoom: number): number {
  return Math.log2(svgZoom) + GL_BASE;
}

export function glZoomToSvg(glZoom: number): number {
  return Math.pow(2, glZoom - GL_BASE);
}
