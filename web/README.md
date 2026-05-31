# Atlas of Architecture

An interactive, responsive web app that pairs a **Google-Maps-style world map** with a
**Wikipedia-style article panel** to explore the history of architecture country by country.

Click (or search) a country and a panel slides in with a concise, illustrated history of
that country's architecture across eras. Featured countries use hand-curated content with
free images from Wikimedia Commons; every other country falls back to live content pulled
from Wikipedia.

## Features

- **Stylized SVG world map** (no API key) with smooth pan/zoom, hover highlighting, and
  fly-to-country on selection.
- **Hybrid content model**
  - Curated, multi-era histories for flagship countries: Italy, Japan, Egypt, India,
    Greece, Mexico.
  - Live fallback for any other country via the Wikipedia REST + Action APIs.
- **Wikipedia-style panel**: hero image, sticky table-of-contents, era sections, image
  galleries with captions/credits, and a "View on Wikipedia" link.
- **Expandable panel**: a toggle widens the panel on desktop (and near-fullscreens the
  bottom sheet on mobile), reflowing era galleries into more columns.
- **Optional Unsplash gallery**: add a free Unsplash key to surface a live photo strip of
  each country's architecture (see below).
- **Fully responsive**: left side-panel on desktop, bottom sheet on mobile.
- **Built to grow**: the content model already supports `video` and `animation` media
  types, and Framer Motion is wired in for richer transitions.

## Tech stack

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Build tool     | [Vite](https://vite.dev) + React 18 + TypeScript  |
| Styling        | [Tailwind CSS](https://tailwindcss.com)           |
| Map            | [react-simple-maps](https://www.react-simple-maps.io) + [world-atlas](https://github.com/topojson/world-atlas) topojson |
| Animation      | [Framer Motion](https://www.framer.com/motion/)   |
| Content        | Wikipedia REST + Action APIs, Wikimedia Commons images |

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173).

> Note: this project enables Vite file-watch polling (see `vite.config.ts`) because the
> repo lives on a cloud-synced path where native file events are unreliable. Remove the
> `server.watch.usePolling` option if you move it to a local disk.

### Optional: Unsplash photo gallery

Each country panel can show a live strip of photos from Unsplash. This is off by default
and requires a free key:

1. Create an app at https://unsplash.com/developers and copy the **Access Key**
   (the public/publishable one — **not** the Secret Key).
2. Create a file named `.env.local` in the project root with:

   ```bash
   VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
   ```

3. Restart `npm run dev`.

Without a key the gallery simply doesn't render, and everything else works normally. Image
sources, in order of preference: curated Wikimedia Commons (always on), live Wikipedia
images (for non-curated countries), and Unsplash (when a key is set).

#### Keeping the key safe

- **Never commit it.** `.env`, `.env.local`, and `.env.*` are gitignored (only
  `.env.example` is tracked). `.env.local` is the recommended place for your key.
- **Only use the Access Key.** It's designed for client-side use and is rate-limited. The
  Unsplash **Secret Key** must never appear in frontend code.
- **Be aware of client exposure.** Vite inlines any `VITE_`-prefixed variable into the
  built JavaScript, so a key shipped this way is technically visible to anyone who inspects
  the site. That's fine for a local mockup or a demo with the publishable Access Key. For a
  public production deployment, proxy Unsplash requests through a small backend / serverless
  function and keep the key server-side (see note below).
- Optionally restrict usage and rotate the key from your Unsplash app dashboard.

> Production hardening (later): instead of calling `api.unsplash.com` directly from the
> browser, add a serverless endpoint (e.g. `/api/unsplash`) that holds the key and forwards
> requests. Then point `searchUnsplash` at that endpoint and drop the client-side key.

### Other scripts

```bash
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build
npm run lint      # run eslint
```

## How it works

```
Click / search a country
        │
        ▼
 selectedCountry (App state) ──► map flies to centroid + highlights
        │
        ▼
 loadCountry(name)  (src/lib/wikipedia.ts)
        ├─ curated record?  ──► render curated eras (src/data/countries.ts)
        └─ otherwise        ──► Wikipedia summary + parsed article HTML
                                 (cleaned, links/images normalised)
```

### Project structure

```
public/
  countries-110m.json     # world map topojson (bundled, no key needed)
src/
  App.tsx                 # layout shell + state + map fly-to
  types.ts                # domain types (incl. video/animation media union)
  data/countries.ts       # curated, hand-written country histories
  lib/
    wikipedia.ts          # live Wikipedia fetch + HTML cleanup
    images.ts             # Wikimedia Commons URL helper
    useIsMobile.ts        # breakpoint hook for panel layout
  components/
    WorldMap.tsx          # the interactive map
    MapOverlay.tsx        # brand chip, search, zoom controls
    CountryPanel.tsx      # sliding panel + TOC + hero
    ArticleSection.tsx    # one era (text + media)
    SmartImage.tsx        # image with shimmer + graceful failure
```

## Adding a curated country

Add an entry to `CURATED` in [`src/data/countries.ts`](src/data/countries.ts). The key
must match the country's `properties.name` in the topojson:

```ts
Spain: {
  name: 'Spain',
  wikipediaTitle: 'Architecture_of_Spain',
  flagEmoji: '🇪🇸',
  tagline: '…',
  heroImage: commons('Sagrada Familia 01.jpg', 1400),
  intro: '…',
  eras: [
    {
      id: 'moorish',
      period: '8th–15th century',
      title: 'Moorish',
      text: '…',
      media: [{ kind: 'image', src: commons('Alhambra ...jpg'), caption: '…' }],
    },
  ],
},
```

## Roadmap: video & complex animations

The data model is intentionally future-proof. `Era.media` is a union:

```ts
type Media = ImageMedia | VideoMedia | AnimationMedia;
```

- **Video**: already rendered by `ArticleSection` — just push a
  `{ kind: 'video', src, poster }` item onto an era's `media` array.
- **Animation**: `{ kind: 'animation', ref }` renders a placeholder slot today; wire it to
  a Lottie player or a custom Framer/canvas scene resolved by `ref`.
- **Map transitions**: Framer Motion is already a dependency, and the map fly-to is driven
  by a single `position` state in `App.tsx`, so animated camera moves and section
  reveal-on-scroll can be layered in without restructuring.

## Content & licensing

Curated images are linked from [Wikimedia Commons](https://commons.wikimedia.org) via the
stable `Special:FilePath` redirect and credited in captions. Live article text and images
come from Wikipedia and are subject to their respective licenses (mostly CC BY-SA).
