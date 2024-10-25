import { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { EventDetails } from '@/components/events/EventDetails'
import { EventSchedule } from '@/components/events/EventSchedule'
import { EventSpeakers } from '@/components/events/EventSpeakers'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { sampleEvents } from '@/data/sampleEvents'
import { EventDetailsSkeleton } from '@/components/events/EventDetailsSkeleton'

interface PageProps {
  params: { id: string }
}

async function getEvent(eventId: string) {
  try {
    const event = sampleEvents.find(e => e.id === parseInt(eventId))
    if (!event) return null
    
    // Ensure ticketTypes exists even if empty
    return {
      ...event,
      ticketTypes: event.ticketTypes || []
    }
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await getEvent(params.id)
  
  if (!event) {
    return { 
      title: 'Event Not Found | Eventify',
      description: 'The requested event could not be found.'
    }
  }

  return {
    title: `${event.title} | Eventify`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [event.image],
    },
  }
}

export default async function EventPage({ params }: PageProps) {
  const eventId = await params.id
  const event = await getEvent(eventId)

  if (!event) notFound()

  return (
    <div className="min-h-screen">
      <Breadcrumb 
        items={[
          { label: 'Events', href: '/events' },
          { label: event.title, href: `/events/${eventId}` },
        ]} 
      />
      
      <Suspense fallback={<EventDetailsSkeleton />}>
        <EventDetails event={event} />
      </Suspense>

      {event.schedule && (
        <Suspense fallback={<div className="animate-pulse">Loading schedule...</div>}>
          <EventSchedule schedule={event.schedule} />
        </Suspense>
      )}

      {event.speakers && event.speakers.length > 0 && (
        <Suspense fallback={<div className="animate-pulse">Loading speakers...</div>}>
          <EventSpeakers speakers={event.speakers} />
        </Suspense>
      )}
    </div>
  )
}
