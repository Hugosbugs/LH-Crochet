import Image from 'next/image'
import { signIn } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Image
            src="/logos/png/StitchMark_Logo--Icon-1.png"
            alt="Stitchmark"
            width={48}
            height={48}
            priority
          />
        </div>
        <h1 className="text-2xl font-semibold text-charcoal mb-8 text-center">Sign in</h1>

        {error && (
          <p className="text-sm text-red-500 mb-6 text-center">
            Incorrect email or password.
          </p>
        )}

        <form action={signIn} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-charcoal/50 uppercase tracking-wide">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue="loveandhooks@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-charcoal/50 uppercase tracking-wide">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-lg bg-charcoal text-white text-sm font-medium hover:bg-charcoal/90 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
