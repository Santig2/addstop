import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ADDSPOT - El Futuro del Valet Parking',
  description: 'Sistema de gestión operativa premium para servicios de Valet Parking. Control total de vehículos, reportes en tiempo real y máxima seguridad.',
  generator: 'Next.js',
  applicationName: 'ADDSPOT',
  keywords: ['Valet Parking', 'Gestión de Parqueaderos', 'Control de Vehículos', 'Software Valet', 'ADDSPOT', 'Parking Management'],
  authors: [{ name: 'ADDSPOT Team' }],
  metadataBase: new URL('https://addspot.vercel.app'),
  openGraph: {
    title: 'ADDSPOT | El Futuro del Valet Parking',
    description: 'Sistema de gestión operativa premium para servicios de Valet Parking. Control total, eficiencia y métricas en tiempo real.',
    url: 'https://addspot.vercel.app',
    siteName: 'ADDSPOT',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'ADDSPOT - El Futuro del Valet Parking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADDSPOT | El Futuro del Valet Parking',
    description: 'Sistema de gestión operativa premium para servicios de Valet Parking.',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0B0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className="font-sans antialiased min-h-screen text-foreground relative">
        {/* Global animated background */}
        <div className="fixed inset-0 z-[-1] gradient-bg overflow-hidden pointer-events-none">
          <div className="blob blob-1 opacity-80"></div>
          <div className="blob blob-2 opacity-80"></div>
        </div>
        
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
