import Link from 'next/link'
import TopNav from '@/components/nav/TopNav'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <>
      <TopNav />
      <main className="min-h-[calc(100vh-4rem)] bg-surface flex items-center justify-center px-8">
        <div className="text-center max-w-xl">
          <h1 className="text-5xl font-bold text-charcoal leading-tight mb-4">
            Discover handmade crochet creations
          </h1>
          <p className="text-charcoal/60 text-lg mb-8">
            A handcrafted collection of amigurumi, wearables, and home décor — made with love.
          </p>
          <Link href="/explore">
            <Button variant="primary" className="text-base px-8 py-3">
              Explore the gallery →
            </Button>
          </Link>
        </div>
      </main>
    </>
  )
}
