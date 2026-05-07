# Daniel Shashank Deshmukh Portfolio

Professional portfolio website for Daniel Shashank Deshmukh, a full stack developer focused on scalable SaaS systems, automation workflows, and real-world product engineering.

This project presents a data-driven portfolio built with React, Vite, and TailwindCSS. Profile details, project entries, and supporting content are loaded from JSON files so the site can be updated without changing component logic.

## Overview

- Showcases Daniel's profile, education, technical skills, selected work, certifications, resume, and contact information
- Highlights a mix of deployed products and active in-progress systems across SaaS, healthcare, legal intelligence, trading, and operations
- Uses a clean frontend architecture with reusable React components and static JSON-backed content

## Profile

**Name:** Daniel Shashank Deshmukh

**Tagline:** Full Stack Developer building scalable SaaS systems and automation enthusiast

**Education:** Bachelor of Computer Science, Shree L. R. Tiwari Degree College, Mira Road (East), graduating in 2026

**Focus Areas:** Real-world SaaS systems, automation tools, backend architecture, Node.js systems, Supabase-backed applications, and product-oriented software development

## Tech Stack

- React
- Vite
- TailwindCSS
- Node.js
- PostgreSQL
- Supabase
- Python
- WebSockets
- LangChain
- Figma
- Netlify

## Featured Projects

### Babuji Chaay

Full-stack POS and inventory management system for cafes and tea stalls with real client deployment.

- Status: Deployed
- Stack: React, Node.js, Express, TailwindCSS
- Repository: [Babuji-Chaay](https://github.com/DanielDeshmukh/Babuji-Chaay)
- Live Site: [babujichaay.com](https://babujichaay.com/)

### Ella

AI-powered clinical receptionist designed to improve patient interaction flow, scheduling support, and operational efficiency.

- Status: Deployed
- Stack: Python, Groq API, Rich, LangChain, Tesseract OCR, RAG
- Repository: [ella](https://github.com/DanielDeshmukh/ella)

### Aether

Security-focused SaaS platform that simulates human-like decision-making to identify vulnerabilities, generate targeted exploits, and support remediation.

- Status: Under Development
- Progress: 70%
- Stack: React, Node.js, Express, WebSockets, Python, TailwindCSS
- Repository: [aether](https://github.com/DanielDeshmukh/aether)

### TradeX

Beginner-friendly trading platform for the Indian stock market using the Dhan API and an AI-assisted signal generation workflow for trader education.

- Status: Under Development
- Progress: 40%
- Stack: React, Node.js, Python, Supabase, TailwindCSS
- Repository: [TradeX](https://github.com/DanielDeshmukh/TradeX)

### Qure

Smart OPD queue management platform designed to support remote queue participation without depending on smartphone literacy.

- Status: Under Development
- Progress: 10%
- Stack: React, Node.js, Express, PostgreSQL, WebSockets
- Repository: [Qure](https://github.com/DanielDeshmukh/Qure)

### Hector

Hard-RAG legal intelligence system built to navigate the complexity of Indian law with precision-focused reasoning.

- Status: Under Development
- Progress: 20%
- Stack: React, Node.js, Express, WebSockets, Python, TailwindCSS, LangChain
- Repository: [Hector](https://github.com/DanielDeshmukh/Hector)

### Interior Design Portfolio

Responsive client portfolio website for showcasing interior design projects and service offerings.

- Status: Deployed
- Stack: React, TailwindCSS, Netlify, Figma, WhatsApp API
- Repository: [Interior-Designs-Template](https://github.com/DanielDeshmukh/Interior-Designs-Template)
- Live Site: [Netlify Demo](https://danieldeshmukh-webdesigns.netlify.app/)

## Project Structure

```text
Portfolio/
|-- README.md
`-- frontend/
    |-- public/
    |   `-- data/
    |       |-- profile.json
    |       |-- projects.json
    |       `-- certificates.json
    |-- src/
    |   |-- components/
    |   |-- utils/
    |   |-- App.jsx
    |   |-- main.jsx
    |   `-- index.css
    |-- package.json
    `-- vite.config.js
```

## Data-Driven Content

The portfolio content is managed from the JSON files inside `frontend/public/data`.

- `profile.json` stores bio, education, skills, and contact information
- `projects.json` stores project descriptions, status, progress, links, and media references
- `certificates.json` stores certification content shown in the portfolio

This structure makes it easy to keep the site current while preserving a stable frontend codebase.

## Running Locally

1. Open the project root.
2. Move into the frontend app:

```powershell
cd frontend
```

3. Install dependencies:

```powershell
npm install
```

4. Start the development server:

```powershell
npm run dev
```

5. Build for production:

```powershell
npm run build
```

## Contact

- Email: [deshmukhdaniel2005@gmail.com](mailto:deshmukhdaniel2005@gmail.com)
- GitHub: [DanielDeshmukh](https://github.com/DanielDeshmukh)
- LinkedIn: [daniel-deshmukh-7b08602b2](https://www.linkedin.com/in/daniel-deshmukh-7b08602b2)
- X: [@DeshmukhDa71837](https://x.com/DeshmukhDa71837)

## Notes

- The site uses static asset data from `frontend/public/data` and project images from `frontend/public`
- Project details in the UI are rendered from shared JSON content rather than hardcoded page copy
- The frontend is configured with Vite for fast local development and streamlined production builds
