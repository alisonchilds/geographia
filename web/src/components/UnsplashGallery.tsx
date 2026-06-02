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

  const gridClass =
    'grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-2';
  const cellClass =
    'group relative aspect-[4/3] overflow-hidden rounded-lg bg-neutral-200 md:aspect-square dark:bg-neutral-800';

  return (
    <section className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-800">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-landActive">
        Photography
      </div>
      <h3 className="mb-3 font-serif text-xl font-semibold text-ink dark:text-neutral-100">
        More from Unsplash
      </h3>

      {loading ? (
        <div className={gridClass}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={cellClass}>
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          ))}
        </div>
      ) : (
        <div className={gridClass}>
          {photos.map((p) => (
            <a
              key={p.id}
              href={p.photoLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cellClass}
              title={p.alt}
            >
              <img
                src={p.gallery}
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

      <p className="mt-2 text-[11px] text-neutral-400 dark:text-neutral-500">
        Photos via{' '}
        <a
          href="https://unsplash.com/?utm_source=omnia_archives&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          Unsplash
        </a>
      </p>
    </section>
  );
}
