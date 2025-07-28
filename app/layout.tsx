import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LayoffLens - Layoff Data Analytics Platform',
  description: 'Comprehensive analysis and visualization of layoff data across industries and geographies. Track workforce trends and economic indicators.',
  keywords: 'layoffs, data analytics, workforce trends, economic indicators, job market analysis',
  authors: [{ name: 'LayoffLens Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'LayoffLens - Layoff Data Analytics Platform',
    description: 'Comprehensive analysis and visualization of layoff data across industries and geographies.',
    type: 'website',
    locale: 'en_US',
    siteName: 'LayoffLens',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LayoffLens - Layoff Data Analytics Platform',
    description: 'Comprehensive analysis and visualization of layoff data across industries and geographies.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 