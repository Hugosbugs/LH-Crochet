import Link from 'next/link'
import Image from 'next/image'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'

export default async function SidebarNav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <aside className="w-16 min-h-screen bg-white border-r border-gray-200 flex flex-col items-center pt-4 gap-2 shrink-0">
      {/* Logo */}
      <div className="relative group flex items-center mb-4">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Stitchmark"
        >
          <Image
            src="/logos/png/StitchMark_Logo--Icon-1.png"
            alt="Stitchmark"
            width={34}
            height={34}
            priority
          />
        </Link>
        <div className="pointer-events-none absolute left-full ml-2.5 px-2 py-1 rounded bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
          Stitchmark
        </div>
      </div>

      {/* Sign out — admin only */}
      {user && (
        <div className="mt-auto mb-4 relative group flex items-center">
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sign out"
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-charcoal" strokeWidth={2.5} />
            </button>
          </form>
          <div className="pointer-events-none absolute left-full ml-2.5 px-2 py-1 rounded bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
            Sign out
          </div>
        </div>
      )}
    </aside>
  )
}
