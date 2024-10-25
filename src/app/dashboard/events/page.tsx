'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface DashboardEvent {
  id: string
  title: string
  date: string
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED'
  ticketsSold: number
  revenue: number
}

export default function DashboardEventsPage() {
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/dashboard/events')
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Events</h2>
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse">Loading events...</div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven't created any events yet
            </p>
            <Link href="/dashboard/events/new">
              <Button>Create Your First Event</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.date)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Tickets Sold</p>
                    <p className="text-2xl font-bold">{event.ticketsSold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Revenue</p>
                    <p className="text-2xl font-bold">${event.revenue}</p>
                  </div>
                  <Link href={`/dashboard/events/${event.id}`}>
                    <Button variant="outline">Manage</Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}