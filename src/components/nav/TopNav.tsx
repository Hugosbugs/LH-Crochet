import Link from 'next/link'
import Image from 'next/image'

export default function TopNav() {
  return (
    <header className="h-16 px-8 bg-white shadow-sm flex items-center justify-between">
      <Link href="/" aria-label="Stitchmark — Home">
        <Image
          src="/logos/png/StitchMark_Logo--Horizontal-1.png"
          alt="Stitchmark"
          width={154}
          height={32}
          priority
        />
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/explore"
          className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors"
        >
          Explore
        </Link>
      </nav>
    </header>
  )
}
