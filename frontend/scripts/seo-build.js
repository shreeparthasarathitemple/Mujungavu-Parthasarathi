// Runs after `vite build`.
// 1. Writes dist/<route>.html for every public page with its own <title>, description,
//    canonical and social tags baked in, so Google and WhatsApp/Facebook previews see
//    the right text without running JavaScript (served via "cleanUrls" in vercel.json).
// 2. Writes dist/sitemap.xml including announcements and news from the API.
// 3. Writes dist/404.html so unknown URLs return a real 404 status.
import fs from 'fs';
import path from 'path';
import { PAGE_SEO, SITEMAP_PAGES, SITE_URL, DEFAULT_IMAGE, getPageSeo, canonicalUrl, festivalsToEvents } from '../src/seo/pages.js';

const DIST = path.resolve('dist');
const API_URL = process.env.VITE_API_URL || 'https://mujungavu-parthasarathi.onrender.com';
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

const esc = (str) => String(str ?? '')
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const plainText = (html) => String(html ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const setMeta = (html, attr, key, value) => {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
};

const renderPage = ({ title, description, url, image = DEFAULT_IMAGE, jsonLd }) => {
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${esc(url)}" />`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'name', 'twitter:url', url);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'name', 'twitter:image', image);
  if (jsonLd) {
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>\n  </head>`);
  }
  return html;
};

const writePage = (route, html) => {
  const file = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${route.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

// Render backend sleeps when idle, so allow a long wait and fall back to no dynamic data
const fetchJson = async (endpoint) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { signal: AbortSignal.timeout(90000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[seo-build] Could not fetch ${endpoint}: ${err.message}`);
    return [];
  }
};

const parseLocalized = (value, lang = 'en') => {
  if (!value) return '';
  if (typeof value === 'object') return value[lang] || value.en || value.kn || '';
  try {
    const parsed = JSON.parse(value.replace(/'/g, '"'));
    return parsed[lang] || parsed.en || parsed.kn || '';
  } catch {
    return value;
  }
};

const [festivals, announcements, news] = await Promise.all([
  fetchJson('/api/festivals'),
  fetchJson('/api/announcements'),
  fetchJson('/api/news'),
]);

// Static pages (English meta for crawlers; the app swaps to Kannada/English at runtime)
const events = festivalsToEvents(festivals);
for (const route of Object.keys(PAGE_SEO)) {
  const { title, description } = getPageSeo(route, 'en');
  const jsonLd = (route === '/festivals' || route === '/') && events.length
    ? { '@context': 'https://schema.org', '@graph': events }
    : null;
  writePage(route, renderPage({ title, description, url: canonicalUrl(route), jsonLd }));
}

// Announcement pages: /a/<last 6 chars of id>
const today = new Date().toISOString().slice(0, 10);
const sitemapEntries = SITEMAP_PAGES.map(([route, changefreq, priority]) => ({
  loc: canonicalUrl(route), changefreq, priority, lastmod: today,
}));

for (const a of announcements.filter(a => a.isActive !== false)) {
  const route = `/a/${a._id.slice(-6)}`;
  const description = plainText(a.content).slice(0, 155);
  writePage(route, renderPage({
    title: `${a.title} | Sri Parthasarathi Temple`,
    description,
    url: canonicalUrl(route),
    image: a.imageUrl || DEFAULT_IMAGE,
  }));
  sitemapEntries.push({ loc: canonicalUrl(route), changefreq: 'monthly', priority: '0.6', lastmod: (a.updatedAt || a.createdAt || '').slice(0, 10) || today });
}

for (const n of news.filter(n => !n.status || n.status === 'published')) {
  const route = `/news/${n._id}`;
  const title = parseLocalized(n.generatedTitle) || n.adminTitle;
  const description = plainText(parseLocalized(n.generatedBlurb) || n.adminDescription).slice(0, 155);
  writePage(route, renderPage({
    title: `${title} | Sri Parthasarathi Temple`,
    description,
    url: canonicalUrl(route),
    image: n.imageUrl || DEFAULT_IMAGE,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description,
      image: [n.imageUrl || DEFAULT_IMAGE],
      datePublished: n.createdAt,
      dateModified: n.updatedAt || n.createdAt,
      author: { '@type': 'Organization', name: 'Sri Parthasarathi Temple Mujungavu', url: SITE_URL },
    },
  }));
  sitemapEntries.push({ loc: canonicalUrl(route), changefreq: 'monthly', priority: '0.6', lastmod: (n.updatedAt || n.createdAt || '').slice(0, 10) || today });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(e => `  <url>
    <loc>${esc(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

// 404 page: same app shell (React shows the NotFound page) but marked noindex
const notFound = renderPage({
  title: 'Page Not Found | Sri Parthasarathi Temple Mujungavu',
  description: 'This page does not exist.',
  url: SITE_URL,
}).replace(/<meta name="robots" content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex" />')
  .replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>/, '');
fs.writeFileSync(path.join(DIST, '404.html'), notFound);

console.log(`[seo-build] ${Object.keys(PAGE_SEO).length} pages, ${announcements.length} announcements, ${news.length} news, ${events.length} festival events; sitemap has ${sitemapEntries.length} URLs`);
