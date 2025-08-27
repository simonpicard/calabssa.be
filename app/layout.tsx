import './globals.css'
import { Metadata, Viewport } from 'next'
import PlausibleProvider from 'next-plausible'

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.calabssa.be'),
  title: {
    default: 'CalABSSA - Calendriers ABSSA | Football du samedi Bruxelles',
    template: '%s | CalABSSA - ABSSA Bruxelles'
  },
  description: 'Calendriers officiels ABSSA (Royale Association Belge des Sports du Samedi). Consultez les matchs de football du samedi à Bruxelles, horaires, terrains, cartes. 200+ équipes, toutes divisions.',
  keywords: ['ABSSA', 'football samedi', 'Bruxelles', 'calendrier', 'match', 'foot 11', 'football', 'équipe', 'division', 'horaire match', 'terrain football', 'sports samedi'],
  authors: [{ name: 'CalABSSA' }],
  creator: 'CalABSSA',
  publisher: 'CalABSSA',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_BE',
    url: 'https://www.calabssa.be',
    siteName: 'CalABSSA',
    title: 'CalABSSA - Tous les calendriers ABSSA en un clic',
    description: 'Consultez et synchronisez les calendriers de toutes les équipes ABSSA. Horaires, adresses, cartes interactives.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CalABSSA - Calendriers ABSSA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CalABSSA - Calendriers ABSSA Bruxelles',
    description: 'Tous les matchs ABSSA en un seul endroit. Synchronisez avec votre calendrier.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: '#5bbad5' }
    ]
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://www.calabssa.be',
  },
  other: {
    'msapplication-TileColor': '#da532c'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CalABSSA',
    alternateName: 'Calendriers ABSSA Bruxelles',
    url: 'https://www.calabssa.be',
    description: 'Calendriers officiels de toutes les équipes ABSSA (Royale Association Belge des Sports du Samedi)',
    publisher: {
      '@type': 'Organization',
      name: 'CalABSSA',
      url: 'https://www.calabssa.be',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.calabssa.be/c/{search_term}',
      },
      'query-input': 'required name=search_term',
    },
    inLanguage: 'fr-BE',
  }

  return (
    <html lang="fr">
      <head>
        <PlausibleProvider domain="calabssa.be" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}