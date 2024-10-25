'use client'

import { Event } from '@/types/events'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Share2, MapPin, Calendar, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface EventDetailsProps {
  event: Event
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[400px] mb-8">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge className="mb-4">{event.category}</Badge>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {event.venue ? event.venue.name : 'Venue not available'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">About this event</h2>
              <p className="text-muted-foreground">{event.description}</p>
            </section>

            {/* Venue Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Venue</h2>
              <div className="bg-card rounded-lg p-4">
                <h3 className="font-semibold">{event.venue.name}</h3>
                <p className="text-muted-foreground">
                  {event.venue.address}<br />
                  {event.venue.city}, {event.venue.state} {event.venue.zip}
                </p>
              </div>
            </section>

            {/* Organizer Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Organizer</h2>
              <div className="bg-card rounded-lg p-4">
                <h3 className="font-semibold">{event.organizer.name}</h3>
                <p className="text-muted-foreground">{event.organizer.description}</p>
              </div>
            </section>
          </div>

          {/* Right Column - Ticket Types */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-card rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Tickets</h2>
              <div className="space-y-4">
                {event.ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{ticket.name}</h3>
                      <span className="text-xl font-bold">${ticket.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {ticket.description}
                    </p>
                    <Button className="w-full">Select</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <Button className="w-full">Book Now</Button>
      </div>
    </div>
  )
}
