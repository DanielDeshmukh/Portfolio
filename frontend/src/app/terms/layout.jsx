export const metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service for Daniel Shashank Deshmukh. Covers scope of work, intellectual property, payments, liability, confidentiality, and governing law under Indian legislation.',
  openGraph: {
    type: 'website',
    title: 'Terms of Service | Daniel Deshmukh',
    description:
      'Terms of service for development and maintenance engagements.',
    url: 'https://danieldeshmukh-portfolio.vercel.app/terms',
    images: [{ url: 'https://danieldeshmukh-portfolio.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Daniel Deshmukh - Terms' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Daniel Deshmukh',
    description:
      'Terms of service for development and maintenance engagements.',
    images: ['https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
  },
}

export default function TermsLayout({ children }) {
  return children
}
