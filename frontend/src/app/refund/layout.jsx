export const metadata = {
  title: 'Refund & Cancellation Policy',
  description:
    'Refund and cancellation policy for Daniel Shashank Deshmukh. Learn about our terms for development advance payments, maintenance cancellations, and refund processing.',
  openGraph: {
    type: 'website',
    title: 'Refund & Cancellation Policy | Daniel Deshmukh',
    description:
      'Refund and cancellation policy for development and maintenance services.',
    url: 'https://danieldeshmukh-portfolio.vercel.app/refund',
    images: [{ url: 'https://danieldeshmukh-portfolio.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Daniel Deshmukh - Refund Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refund & Cancellation Policy | Daniel Deshmukh',
    description:
      'Refund and cancellation policy for development and maintenance services.',
    images: ['https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
  },
}

export default function RefundLayout({ children }) {
  return children
}
