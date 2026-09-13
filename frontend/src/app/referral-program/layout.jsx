export const metadata = {
  title: 'Referral Program',
  description:
    'Refer clients to Daniel Shashank Deshmukh and earn maintenance discounts. Get 50% off for 1st referral, 50% off for 2nd, and a free month for 3rd referral. Learn how the program works.',
  openGraph: {
    type: 'website',
    title: 'Referral Program | Daniel Deshmukh',
    description:
      'Refer clients and earn maintenance discounts. 50% off for 1st and 2nd referrals, free month for 3rd.',
    url: 'https://danieldeshmukh-portfolio.vercel.app/referral-program',
    images: [{ url: 'https://danieldeshmukh-portfolio.vercel.app/og-image.png', width: 1200, height: 630, alt: 'Daniel Deshmukh - Referral Program' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Referral Program | Daniel Deshmukh',
    description:
      'Refer clients and earn maintenance discounts. 50% off for 1st and 2nd referrals, free month for 3rd.',
    images: ['https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
  },
}

export default function ReferralProgramLayout({ children }) {
  return children
}
