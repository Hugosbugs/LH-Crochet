import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stitchmark',
  description: 'A handmade crochet project gallery.',
  icons: {
    icon: '/logos/png/StitchMark_Logo--Icon-1.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface text-charcoal antialiased`}>
        {children}
      </body>
    </html>
  )
}
