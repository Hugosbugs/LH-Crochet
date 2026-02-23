import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'L&H Crochet',
  description: 'A handmade crochet project gallery.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface text-charcoal antialiased`}>
        <header className="px-8 py-4 bg-white shadow-sm">
          <p className="text-xl font-bold tracking-wide text-charcoal">L&amp;H Crochet</p>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
