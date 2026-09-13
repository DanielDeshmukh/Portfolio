export const metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for Daniel Shashank Deshmukh. Learn how your data is collected, used, stored, and protected. Covers GDPR, Indian IT Act 2000, and DPDP Act 2023 compliance.',
  openGraph: {
    type: 'website',
    title: 'Privacy Policy | Daniel Deshmukh',
    description:
      'Privacy policy covering data collection, usage, storage, and your rights.',
    url: 'https://danieldeshmukh-portfolio.vercel.app/privacy',
    images: [{ url: 'https://danieldeshmukh-portfolio.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Daniel Deshmukh - Privacy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Daniel Deshmukh',
    description:
      'Privacy policy covering data collection, usage, storage, and your rights.',
    images: ['https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
  },
}

export default function PrivacyLayout({ children }) {
  return children
}
