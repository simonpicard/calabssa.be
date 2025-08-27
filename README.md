# CalABSSA.be

📅 **All ABSSA Saturday football schedules in one place** - Search, view, and sync match calendars with your favorite calendar app.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com/)

## 🌟 Features

- **🔍 Team Search**: Quickly find any ABSSA team from 200+ Saturday football teams across Brussels
- **📱 Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **🗺️ Interactive Maps**: View match locations with integrated Leaflet maps
- **📲 Calendar Integration**: Sync matches with Google Calendar, Apple Calendar, Outlook, and more
- **🌍 French**: Interface in French with clear, intuitive navigation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/simonpicard/calabssa.be.git
cd calabssa.be
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Maps**: [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/)
- **Analytics**: [Plausible](https://plausible.io/) (privacy-friendly)
- **Deployment**: [Vercel](https://vercel.com/)

## 📁 Project Structure

```
calabssa.be/
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   ├── data/              # JSON data files
│   ├── lib/               # Utilities and helpers
│   ├── c/[teamId]/        # Dynamic team pages
│   └── page.tsx           # Homepage
├── public/
│   ├── ics/               # Calendar files (.ics)
│   ├── icon/              # App icons
│   └── favicon/           # Favicon files
└── next.config.js         # Next.js configuration
```

## 📊 Data Sources

Calendar data is sourced from official ABSSA schedules and processed into iCalendar format. The data includes:

- 200+ teams across all divisions
- Match schedules for the entire season
- Venue information with GPS coordinates
- Match officials and contact information

## 🔐 Privacy

CalABSSA.be respects user privacy:

- No personal data collection
- Privacy-friendly analytics with Plausible
- No cookies or tracking
- All data is publicly available match information

## 📧 Contact

For questions, suggestions, or issues, please:

- Open an [issue on GitHub](https://github.com/simonpicard/calabssa.be/issues)
- Visit [www.calabssa.be](https://www.calabssa.be)

---

Made with ⚽ in Brussels
