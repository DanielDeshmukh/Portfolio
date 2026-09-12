import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

export const metadata = {
  title: 'Daniel Shashank Deshmukh - Portfolio',
  description: 'Personal portfolio of Daniel Shashank Deshmukh',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⟨/⟩</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  )
}
