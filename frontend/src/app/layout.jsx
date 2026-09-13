import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

const SITE_URL = 'https://danieldeshmukh-portfolio.vercel.app'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Daniel Shashank Deshmukh | Full-Stack Developer & Software Engineer',
    template: '%s | Daniel Deshmukh',
  },
  description:
    'Full-stack developer specializing in web apps, POS systems, and mobile applications. Building production-grade software for businesses across India.',
  keywords: [
    'Daniel Deshmukh',
    'full-stack developer',
    'web developer India',
    'React developer',
    'Next.js developer',
    'POS system',
    'freelance developer',
    'software engineer',
    'Node.js',
    'React Native',
    'portfolio',
  ],
  authors: [{ name: 'Daniel Shashank Deshmukh' }],
  creator: 'Daniel Shashank Deshmukh',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Daniel Deshmukh',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#c9a962',
}

export default function RootLayout({ children }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Daniel Shashank Deshmukh',
    url: SITE_URL,
    jobTitle: 'Full-Stack Developer',
    description:
      'Full-stack developer specializing in web apps, POS systems, and mobile applications.',
    sameAs: [
      'https://github.com/DanielDeshmukh',
      'https://linkedin.com/in/daniel-deshmukh',
    ],
    knowsAbout: [
      'React',
      'Next.js',
      'Node.js',
      'React Native',
      'JavaScript',
      'TypeScript',
      'Python',
      'PostgreSQL',
      'MongoDB',
      'Tailwind CSS',
      'REST APIs',
      'Web Development',
      'Mobile App Development',
      'POS Systems',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Development',
            description: 'Custom web applications built with modern frameworks',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mobile App Development',
            description: 'Cross-platform mobile applications',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'POS & Billing Systems',
            description: 'Point-of-sale and inventory management systems',
          },
        },
      ],
    },
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
