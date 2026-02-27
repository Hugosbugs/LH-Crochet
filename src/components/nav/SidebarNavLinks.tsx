'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Settings2 } from 'lucide-react'

type Props = {
  isAdmin: boolean
}

export default function SidebarNavLinks({ isAdmin }: Props) {
  const pathname = usePathname()

  if (!isAdmin) return null

  const isGallery = pathname.startsWith('/explore') || pathname.startsWith('/project')
  const isDashboard = pathname.startsWith('/admin')

  return (
    <div className="flex flex-col items-center gap-1">
      <NavTab href="/explore" label="Gallery" active={isGallery}>
        <LayoutGrid className="w-4 h-4" strokeWidth={2} />
      </NavTab>
      <NavTab href="/admin" label="Dashboard" active={isDashboard}>
        <Settings2 className="w-4 h-4" strokeWidth={2} />
      </NavTab>
    </div>
  )
}

function NavTab({
  href,
  label,
  active,
  children,
}: {
  href: string
  label: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative group flex items-center">
      <Link
        href={href}
        aria-label={label}
        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
          active
            ? 'bg-charcoal text-white'
            : 'text-charcoal/40 hover:text-charcoal hover:bg-gray-100'
        }`}
      >
        {children}
      </Link>
      <div className="pointer-events-none absolute left-full ml-2.5 px-2 py-1 rounded bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
        {label}
      </div>
    </div>
  )
}
