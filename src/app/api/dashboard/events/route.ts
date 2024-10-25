import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const prisma = new PrismaClient()

// Using the same schema as the frontend for validation
const eventSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  date: z.string(),
  image: z.string().url(),
  venue: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    zip: z.string().min(5),
  }),
  ticketTypes: z.array(z.object({
    name: z.string().min(2),
    price: z.number().min(0),
    description: z.string(),
  })).min(1),
})

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const events = await prisma.event.findMany({
      where: { organizerId: currentUser.id },
      include: {
        _count: {
          select: { tickets: true }
        },
        tickets: {
          select: {
            price: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      status: event.status,
      ticketsSold: event._count.tickets,
      revenue: event.tickets.reduce((sum, ticket) => sum + ticket.price, 0)
    }))

    return NextResponse.json({ events: formattedEvents })
  } catch (error) {
    console.error('Dashboard events error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        image: validatedData.image,
        status: 'PUBLISHED',
        organizerId: currentUser.id,
        venue: {
          create: {
            name: validatedData.venue.name,
            address: validatedData.venue.address,
            city: validatedData.venue.city,
            state: validatedData.venue.state,
            zip: validatedData.venue.zip,
          },
        },
        ticketTypes: {
          create: validatedData.ticketTypes.map(ticket => ({
            name: ticket.name,
            price: ticket.price,
            description: ticket.description,
            quantity: 100, // Default quantity, you might want to make this configurable
            availableQuantity: 100,
          })),
        },
      },
      include: {
        venue: true,
        ticketTypes: true,
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Event creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
