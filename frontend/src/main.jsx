import React from 'react'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { IoTerminal } from 'react-icons/io5'
import App from './App'
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

function setFaviconFromIcon() {
  try {
    const svg = renderToStaticMarkup(
      <IoTerminal size={64}  color="#000000" />
    )

    const svgData = encodeURIComponent(svg)
    const url = `data:image/svg+xml;charset=utf-8,${svgData}`

    let link = document.querySelector("link[rel~='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    link.href = url
  } catch (e) {
    console.error('Error setting favicon:', e)
  }
}

setFaviconFromIcon()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
