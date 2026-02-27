import SidebarNav from '@/components/nav/SidebarNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
