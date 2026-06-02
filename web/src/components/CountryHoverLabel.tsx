import { hoverLabelLeft } from '../lib/mapPanelCenter';

interface CountryHoverLabelProps {
  name: string;
  featured: boolean;
  panelOpen: boolean;
  isMobile: boolean;
}

export default function CountryHoverLabel({
  name,
  featured,
  panelOpen,
  isMobile,
}: CountryHoverLabelProps) {
  const offsetLeft = hoverLabelLeft(panelOpen, isMobile);

  return (
    <div
      className={`pointer-events-none absolute bottom-6 z-[35] -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 px-4 py-1.5 text-sm font-medium text-white shadow-float${offsetLeft ? '' : ' left-1/2'}`}
      style={offsetLeft ? { left: offsetLeft } : undefined}
    >
      {name}
      {featured && (
        <span className="ml-2 rounded-full bg-[#f5c842] px-2 py-0.5 text-[11px] font-semibold text-[#1a1a1a]">
          Featured
        </span>
      )}
    </div>
  );
}
