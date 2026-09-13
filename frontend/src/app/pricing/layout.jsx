export const metadata = {
  title: 'Pricing & Services',
  description:
    'Development and maintenance pricing for Daniel Shashank Deshmukh. Custom quotes for web apps, POS systems, and mobile applications. Transparent pricing with no hidden charges.',
  openGraph: {
    type: 'website',
    title: 'Pricing & Services | Daniel Deshmukh',
    description:
      'Development and maintenance pricing. Custom quotes for web apps, POS systems, and mobile applications.',
    url: 'https://danieldeshmukh-portfolio.vercel.app/pricing',
    images: [{ url: 'https://danieldeshmukh-portfolio.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Daniel Deshmukh - Pricing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Services | Daniel Deshmukh',
    description:
      'Development and maintenance pricing. Custom quotes for web apps, POS systems, and mobile applications.',
    images: ['https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
  },
}

export default function PricingLayout({ children }) {
  return children
}
