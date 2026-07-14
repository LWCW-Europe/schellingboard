// The site's public base URL (e.g. https://sessions.example.org), used where
// a relative link won't do — most notably links back to the site in emails.
//
// Optional in general (null when unset), but initMailer requires it whenever
// SMTP is configured, so email code can rely on it in practice.
export function siteUrl(): string | null {
  const url = process.env.SITE_URL;
  if (!url) return null;
  if (!URL.canParse(url)) {
    throw new Error(`SITE_URL must be a valid absolute URL, got "${url}"`);
  }
  return url.replace(/\/+$/, "");
}
