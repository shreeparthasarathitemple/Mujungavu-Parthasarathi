// Shared SEO config: used by App.jsx at runtime and by scripts/seo-build.js at build time.
// Keep this file free of browser/React imports so Node can load it.

export const SITE_URL = 'https://www.mujungavuparthasarathi.in';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const SITE_NAME = {
  en: 'Sri Parthasarathi Temple Mujungavu',
  kn: 'ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನ ಮುಜುಂಗಾವು',
};

export const PAGE_SEO = {
  '/': {
    title: {
      en: 'Sri Parthasarathi Temple Mujungavu | Mujungavu Temple, Kumbla',
      kn: 'ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನ ಮುಜುಂಗಾವು | ಕುಂಬಳೆ',
    },
    description: {
      en: 'Official website of Sri Parthasarathi Temple, Mujungavu, Kumbla, Kasaragod. Temple timings, poojas, festivals, the sacred Kaveri Teertha lake, gallery and location.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್, ಕುಂಬಳೆ, ಕಾಸರಗೋಡು. ಪೂಜಾ ಸಮಯ, ಸೇವೆಗಳು, ಉತ್ಸವಗಳು, ಪವಿತ್ರ ಕಾವೇರಿ ತೀರ್ಥ, ಗ್ಯಾಲರಿ ಮತ್ತು ಸ್ಥಳದ ಮಾಹಿತಿ.',
    },
  },
  '/about': {
    title: { en: 'About the Temple', kn: 'ದೇವಸ್ಥಾನದ ಬಗ್ಗೆ' },
    description: {
      en: 'About Sri Parthasarathi Temple, Mujungavu near Kumbla, Kasaragod — the deity, temple traditions and daily pooja timings.',
      kn: 'ಕುಂಬಳೆ ಸಮೀಪದ ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಪರಿಚಯ — ದೇವರು, ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ದೈನಂದಿನ ಪೂಜಾ ಸಮಯ.',
    },
  },
  '/temple-timings': {
    title: { en: 'Temple & Pooja Timings', kn: 'ದೇವಸ್ಥಾನ ಮತ್ತು ಪೂಜಾ ಸಮಯ' },
    description: {
      en: 'Daily pooja timings at Sri Parthasarathi Temple, Mujungavu: morning 8:00 AM, noon 12:30 PM and night 7:00 PM.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ದೈನಂದಿನ ಪೂಜಾ ಸಮಯ: ಬೆಳಗ್ಗೆ 8:00, ಮಧ್ಯಾಹ್ನ 12:30 ಮತ್ತು ರಾತ್ರಿ 7:00.',
    },
  },
  '/history': {
    title: { en: 'Temple History', kn: 'ದೇವಸ್ಥಾನದ ಇತಿಹಾಸ' },
    description: {
      en: 'The history and legends of Sri Parthasarathi Temple, Mujungavu, Kumbla — its origins, Brahmakalasha and the sacred lake.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಇತಿಹಾಸ ಮತ್ತು ಐತಿಹ್ಯ — ಮೂಲ, ಬ್ರಹ್ಮಕಲಶ ಮತ್ತು ಪವಿತ್ರ ಸರೋವರ.',
    },
  },
  '/lake': {
    title: { en: 'Sacred Kaveri Teertha Lake', kn: 'ಪವಿತ್ರ ಕಾವೇರಿ ತೀರ್ಥ ಸರೋವರ' },
    description: {
      en: 'The sacred temple lake at Mujungavu, where devotees take a holy dip in the Kaveri Teertha on Tula Sankramana.',
      kn: 'ತುಲಾ ಸಂಕ್ರಮಣದಂದು ಭಕ್ತರು ಕಾವೇರಿ ತೀರ್ಥದಲ್ಲಿ ಪುಣ್ಯಸ್ನಾನ ಮಾಡುವ ಮುಜುಂಗಾವು ದೇವಸ್ಥಾನದ ಪವಿತ್ರ ಸರೋವರ.',
    },
  },
  '/poojas': {
    title: { en: 'Poojas & Sevas', kn: 'ಪೂಜೆಗಳು ಮತ್ತು ಸೇವೆಗಳು' },
    description: {
      en: 'Poojas and sevas at Sri Parthasarathi Temple, Mujungavu — Namakarana, Annaprashana, Vivaha, Tulabhara and Teerthasnana.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಪೂಜೆಗಳು ಮತ್ತು ಸೇವೆಗಳು — ನಾಮಕರಣ, ಅನ್ನಪ್ರಾಶನ, ವಿವಾಹ, ತುಲಾಭಾರ ಮತ್ತು ತೀರ್ಥಸ್ನಾನ.',
    },
  },
  '/services': {
    title: { en: 'Poojas & Sevas', kn: 'ಪೂಜೆಗಳು ಮತ್ತು ಸೇವೆಗಳು' },
    description: {
      en: 'Poojas and sevas at Sri Parthasarathi Temple, Mujungavu — Namakarana, Annaprashana, Vivaha, Tulabhara and Teerthasnana.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಪೂಜೆಗಳು ಮತ್ತು ಸೇವೆಗಳು — ನಾಮಕರಣ, ಅನ್ನಪ್ರಾಶನ, ವಿವಾಹ, ತುಲಾಭಾರ ಮತ್ತು ತೀರ್ಥಸ್ನಾನ.',
    },
  },
  '/festivals': {
    title: { en: 'Festivals & Utsavas', kn: 'ಉತ್ಸವಗಳು' },
    description: {
      en: 'Upcoming festivals at Sri Parthasarathi Temple, Mujungavu — Annual Utsava, Kaveri Teerthasnana on Tula Sankramana, Ashtami Rohini and more, with dates and countdown.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಮುಂಬರುವ ಉತ್ಸವಗಳು — ವಾರ್ಷಿಕ ಉತ್ಸವ, ತುಲಾ ಸಂಕ್ರಮಣದ ಕಾವೇರಿ ತೀರ್ಥಸ್ನಾನ, ಅಷ್ಟಮಿ ರೋಹಿಣಿ ಮತ್ತು ಇತರ ಉತ್ಸವಗಳ ದಿನಾಂಕಗಳು.',
    },
  },
  '/gallery': {
    title: { en: 'Photo Gallery', kn: 'ಗ್ಯಾಲರಿ' },
    description: {
      en: 'Photos and videos of Sri Parthasarathi Temple, Mujungavu — the deity, temple lake, festivals, Ranga Pooje and Brahmakalasha.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಫೋಟೋಗಳು ಮತ್ತು ವಿಡಿಯೋಗಳು — ದೇವರು, ಸರೋವರ, ಉತ್ಸವಗಳು, ರಂಗಪೂಜೆ ಮತ್ತು ಬ್ರಹ್ಮಕಲಶ.',
    },
  },
  '/announcements': {
    title: { en: 'Announcements', kn: 'ಪ್ರಕಟಣೆಗಳು' },
    description: {
      en: 'Latest announcements and greetings from Sri Parthasarathi Temple, Mujungavu, Kumbla.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಇತ್ತೀಚಿನ ಪ್ರಕಟಣೆಗಳು ಮತ್ತು ಶುಭಾಶಯಗಳು.',
    },
  },
  '/news': {
    title: { en: 'Temple News', kn: 'ದೇವಸ್ಥಾನದ ಸುದ್ದಿ' },
    description: {
      en: 'News and event updates from Sri Parthasarathi Temple, Mujungavu, Kumbla, Kasaragod.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಸುದ್ದಿ ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳ ಮಾಹಿತಿ.',
    },
  },
  '/contact': {
    title: { en: 'Contact & Location', kn: 'ಸಂಪರ್ಕ ಮತ್ತು ಸ್ಥಳ' },
    description: {
      en: 'How to reach Sri Parthasarathi Temple, Mujungavu, Kumbla, Kasaragod — phone, email, Google Maps directions.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನಕ್ಕೆ ತಲುಪುವ ದಾರಿ — ದೂರವಾಣಿ, ಇಮೇಲ್ ಮತ್ತು ಗೂಗಲ್ ಮ್ಯಾಪ್.',
    },
  },
  '/location': {
    title: { en: 'Contact & Location', kn: 'ಸಂಪರ್ಕ ಮತ್ತು ಸ್ಥಳ' },
    description: {
      en: 'How to reach Sri Parthasarathi Temple, Mujungavu, Kumbla, Kasaragod — phone, email, Google Maps directions.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನಕ್ಕೆ ತಲುಪುವ ದಾರಿ — ದೂರವಾಣಿ, ಇಮೇಲ್ ಮತ್ತು ಗೂಗಲ್ ಮ್ಯಾಪ್.',
    },
  },
  '/privacy-policy': {
    title: { en: 'Privacy Policy', kn: 'ಗೌಪ್ಯತಾ ನೀತಿ' },
    description: {
      en: 'Privacy policy of the Sri Parthasarathi Temple, Mujungavu website.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ವೆಬ್‌ಸೈಟ್‌ನ ಗೌಪ್ಯತಾ ನೀತಿ.',
    },
  },
  '/data-deletion': {
    title: { en: 'Data Deletion', kn: 'ಡೇಟಾ ಅಳಿಸುವಿಕೆ' },
    description: {
      en: 'How to request deletion of your data from the Sri Parthasarathi Temple, Mujungavu website.',
      kn: 'ಮುಜುಂಗಾವು ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ವೆಬ್‌ಸೈಟ್‌ನಿಂದ ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಅಳಿಸಲು ವಿನಂತಿಸುವ ವಿಧಾನ.',
    },
  },
};

// Sitemap priority / change frequency for the static pages (aliases like /services, /location are left out)
export const SITEMAP_PAGES = [
  ['/', 'daily', '1.0'],
  ['/festivals', 'weekly', '0.9'],
  ['/announcements', 'daily', '0.9'],
  ['/temple-timings', 'monthly', '0.8'],
  ['/poojas', 'monthly', '0.8'],
  ['/about', 'monthly', '0.8'],
  ['/history', 'monthly', '0.8'],
  ['/lake', 'monthly', '0.7'],
  ['/gallery', 'weekly', '0.7'],
  ['/news', 'weekly', '0.7'],
  ['/contact', 'yearly', '0.7'],
  ['/privacy-policy', 'yearly', '0.3'],
];

export const getPageSeo = (pathname, language = 'kn') => {
  const page = PAGE_SEO[pathname] || PAGE_SEO['/'];
  const title = pathname === '/' || !PAGE_SEO[pathname]
    ? page.title[language]
    : `${page.title[language]} | ${SITE_NAME[language]}`;
  return { title, description: page.description[language] };
};

export const canonicalUrl = (pathname) => `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;

// Festival list from the API -> schema.org Event objects (only dated festivals)
export const festivalsToEvents = (festivals) =>
  (festivals || [])
    .filter(f => f.eventDate)
    .map(f => ({
      '@type': 'Event',
      name: f.titleEn || f.titleKn,
      description: f.descEn || f.descKn || undefined,
      startDate: f.eventDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      image: f.imageUrl ? [f.imageUrl] : [DEFAULT_IMAGE],
      location: {
        '@type': 'HinduTemple',
        name: SITE_NAME.en,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mujungavu, Kumbla',
          addressRegion: 'Kerala',
          postalCode: '671321',
          addressCountry: 'IN',
        },
      },
      organizer: { '@type': 'Organization', name: SITE_NAME.en, url: SITE_URL },
      url: `${SITE_URL}/festivals`,
    }));
