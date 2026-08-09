import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import '@/app/globals.css'
import { SITE_NAME } from '@/config/site'

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.rinconrealtycr.com'),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: 'Luxury real estate in Guanacaste & Rincón de la Vieja, Costa Rica.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning allows the locale layout to update lang via useEffect
    <html suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
