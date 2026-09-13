import { readFileSync } from 'fs'
import { join } from 'path'
import HomeClient from '../components/HomeClient'

export const metadata = {
  title: 'Daniel Shashank Deshmukh | Full-Stack Developer & Software Engineer',
  description:
    'Full-stack developer specializing in web apps, POS systems, and mobile applications. Building production-grade software for businesses across India.',
  openGraph: {
    type: 'website',
    title: 'Daniel Shashank Deshmukh | Full-Stack Developer',
    description:
      'Full-stack developer specializing in web apps, POS systems, and mobile applications.',
    url: 'https://danieldeshmukh-portfolio.vercel.app',
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
    title: 'Daniel Shashank Deshmukh | Full-Stack Developer',
    description:
      'Full-stack developer specializing in web apps, POS systems, and mobile applications.',
    images: ['https://danieldeshmukh-portfolio.vercel.app/og-image.png'],
  },
}

function getProfile() {
  try {
    const data = readFileSync(join(process.cwd(), 'public', 'data', 'profile.json'), 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

export default function HomePage() {
  const profile = getProfile()
  return <HomeClient initialProfile={profile} />
}
