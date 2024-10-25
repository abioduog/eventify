"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SearchAndFilter } from '@/components/events/SearchAndFilter'
import { useEventFilters } from '@/hooks/useEventFilters'
import Link from 'next/link'
import { sampleEvents } from '@/data/sampleEvents'

export default function EventsPage() {
  const { filteredEvents } = useEventFilters(sampleEvents)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-xl text-muted-foreground">
          Discover and book amazing events happening around you
        </p>
      </div>

      <div className="mb-8">
        <SearchAndFilter />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 animate-in fade-in-50">
          <p className="text-lg text-muted-foreground">
            No events found matching your criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id}>
              <Card className="flex flex-col animate-in fade-in-50 duration-500">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 right-4">
                    {event.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {formatDate(event.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    📍 {event.location}
                  </div>
                  <p className="text-sm">
                    {event.description}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto justify-between">
                  <div className="text-lg font-semibold">
                    ${event.price}
                  </div>
                  <Button>Book Now</Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
