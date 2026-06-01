import { motion } from 'framer-motion';
import type { Era, Media } from '../types';
import SmartImage from './SmartImage';

interface ArticleSectionProps {
  era: Era;
  wide?: boolean;
  // Bottom-sheet layout: always stack images so pairs are not squeezed side by side.
  stackImages?: boolean;
  // Extra media (e.g. live Unsplash photos) mixed into this era's image grid.
  extraMedia?: Media[];
}

function Figure({ media, large }: { media: Media; large?: boolean }) {
  const caption = media.caption;
  const credit = media.credit;
  // Taller frames on small screens; desktop keeps the denser grid ratios.
  const aspect = large ? 'aspect-[16/10]' : 'aspect-[16/10] md:aspect-[4/3]';

  let visual: React.ReactNode = null;
  if (media.kind === 'image') {
    visual = <SmartImage src={media.src} alt={caption} className={`${aspect} w-full rounded-lg`} />;
  } else if (media.kind === 'video') {
    // Video support is wired now so it can be populated later.
    visual = (
      <video
        controls
        poster={media.poster}
        className="aspect-video w-full rounded-lg bg-black"
        src={media.src}
      />
    );
  } else {
    // Animation placeholder slot for future Lottie / custom scenes.
    visual = (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 text-xs text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500">
        Animation: {media.ref}
      </div>
    );
  }

  return (
    <figure className="group overflow-hidden rounded-lg">
      {visual}
      {(caption || credit) && (
        <figcaption className="mt-1 text-xs leading-snug text-neutral-500 dark:text-neutral-400">
          {caption}
          {credit && <span className="text-neutral-400 dark:text-neutral-500"> {'\u2014'} {credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export default function ArticleSection({
  era,
  wide = false,
  stackImages = false,
  extraMedia = [],
}: ArticleSectionProps) {
  const media = extraMedia.length > 0 ? [...era.media, ...extraMedia] : era.media;

  // Never use more columns than there are images, so two images always span the
  // full width (50/50) instead of leaving an empty third column when expanded.
  const maxCols = wide ? 3 : 2;
  const colCount = Math.min(media.length, maxCols);
  const gridCols = stackImages
    ? 'grid-cols-1'
    : colCount >= 3
      ? 'grid-cols-3'
      : colCount === 2
        ? 'grid-cols-2'
        : 'grid-cols-1';
  const largeImages = stackImages || colCount <= 2;
  return (
    <motion.section
      id={`era-${era.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-4 border-b border-neutral-200 pb-6 pt-5 last:border-b-0 dark:border-neutral-800"
    >
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-landActive">
        {era.period}
      </div>
      <h3 className="mb-2 font-serif text-xl font-semibold text-ink dark:text-neutral-100">{era.title}</h3>
      <p className="mb-4 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">{era.text}</p>

      {media.length > 0 && (
        <div className={`grid gap-4 ${gridCols}`}>
          {media.map((m, i) => (
            <Figure key={i} media={m} large={largeImages} />
          ))}
        </div>
      )}
    </motion.section>
  );
}
