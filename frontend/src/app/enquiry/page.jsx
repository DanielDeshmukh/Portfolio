import { Suspense } from 'react'
import Navbar from '../../components/Navbar'
import EnquiryForm from '../../components/EnquiryForm'

export const metadata = {
  title: 'Enquiry',
  description:
    'Get in touch with Daniel Shashank Deshmukh for web development, mobile apps, POS systems, and custom software solutions. Send your project details directly via WhatsApp.',
  openGraph: {
    type: 'website',
    title: 'Enquiry | Daniel Deshmukh',
    description:
      'Get in touch for web development, mobile apps, POS systems, and custom software solutions.',
    url: 'https://danieldeshmukh-portfolio.vercel.app/enquiry',
    images: [
      {
        url: 'https://danieldeshmukh-portfolio.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Daniel Shashank Deshmukh - Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enquiry | Daniel Deshmukh',
    description:
      'Get in touch for web development, mobile apps, POS systems, and custom software solutions.',
    images: ['https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
  },
}

export default function EnquiryPage() {
  return (
    <div className="min-h-screen bg-background text-gray-100">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-20">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400 flex items-center gap-3">
              <i className="fas fa-spinner fa-spin"></i> Loading...
            </div>
          </div>
        }>
          <EnquiryForm />
        </Suspense>
      </main>
    </div>
  )
}
