'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <ProtectedRoute allowedRoles={['ORGANIZER']}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Organizer Dashboard</h1>
        
        <Tabs value={pathname} className="mb-8">
          <TabsList>
            <Link href="/dashboard">
              <TabsTrigger value="/dashboard">Overview</TabsTrigger>
            </Link>
            <Link href="/dashboard/events">
              <TabsTrigger value="/dashboard/events">My Events</TabsTrigger>
            </Link>
            <Link href="/dashboard/tickets">
              <TabsTrigger value="/dashboard/tickets">Ticket Sales</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </ProtectedRoute>
  )
}