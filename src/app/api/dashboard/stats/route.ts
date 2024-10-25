import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [totalEvents, activeEvents, ticketStats] = await Promise.all([
      prisma.event.count({
        where: { organizerId: currentUser.id },
      }),
      prisma.event.count({
        where: {
          organizerId: currentUser.id,
          date: { gte: new Date() },
        },
      }),
      prisma.ticket.aggregate({
        where: {
          event: { organizerId: currentUser.id },
          status: 'ACTIVE',
        },
        _count: true,
        _sum: {
          price: true,
        },
      }),
    ])

    return NextResponse.json({
      totalEvents,
      activeEvents,
      totalTicketsSold: ticketStats._count,
      totalRevenue: ticketStats._sum.price || 0,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}