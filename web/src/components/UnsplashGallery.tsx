import { isUnsplashEnabled, type UnsplashPhoto } from '../lib/unsplash';

interface UnsplashGalleryProps {
  photos: UnsplashPhoto[];
  loading: boolean;
}

// A live photo strip pulled from Unsplash. The parent (CountryPanel) owns the
// fetch so a single request can be shared between the in-article images and
// this gallery. Renders nothing unless an access key is configured.
export default function UnsplashGallery({ photos = [], loading = false }: UnsplashGalleryProps) {
  if (!isUnsplashEnabled) return null;
  if (!loading && photos.length === 0) return null;

  return (
    <section className="mt-6 border-t border-neutral-200 pt-5">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-landActive">
        Photography
      </div>
      <h3 className="mb-3 font-serif text-xl font-semibold text-ink">
        More from Unsplash
      </h3>

      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-neutral-200">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p) => (
            <a
              key={p.id}
              href={p.photoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg bg-neutral-200"
              title={p.alt}
            >
              <img
                src={p.thumb}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1 pt-4 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                {p.authorName}
              </span>
            </a>
          ))}
        </div>
      )}

      <p className="mt-2 text-[11px] text-neutral-400">
        Photos via{' '}
        <a
          href="https://unsplash.com/?utm_source=atlas_of_architecture&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-600"
        >
          Unsplash
        </a>
      </p>
    </section>
  );
}
