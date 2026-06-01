// Build a stable, resolution-controlled URL for a Wikimedia Commons file.
// Special:FilePath redirects to the underlying upload URL and works for any
// valid Commons filename, which keeps curated data readable (just filenames).
export function commons(filename: string, width = 1000): string {
  const encoded = encodeURIComponent(filename.replace(/ /g, '_'));
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=${width}`;
}

// Commons filename or a direct upload.wikimedia.org URL (e.g. English Wikipedia
// files that were never copied to Commons).
export function imageSrc(nameOrUrl: string, width = 1000): string {
  if (/^https?:\/\//i.test(nameOrUrl)) return nameOrUrl;
  return commons(nameOrUrl, width);
}
