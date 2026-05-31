import { useState } from 'react';

interface SmartImageProps {
  src: string;
  alt?: string;
  className?: string;
}

// An <img> that shows a shimmer while loading and gracefully hides itself if
// the source fails (e.g. a Commons file that moved). Keeps the gallery clean.
export default function SmartImage({ src, alt = '', className = '' }: SmartImageProps) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

  if (state === 'error') return null;

  return (
    <div className={`relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 ${className}`}>
      {state === 'loading' && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setState('loaded')}
        onError={() => setState('error')}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          state === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
