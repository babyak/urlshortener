export function normalizeUrl(url: string): string {
  if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
    return url;
  }
  return `https://${url}`;
}
