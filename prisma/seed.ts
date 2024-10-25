import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Clean the database
    console.log('Cleaning database...')
    await prisma.ticket.deleteMany()
    await prisma.ticketType.deleteMany()
    await prisma.schedule.deleteMany()
    await prisma.event.deleteMany()
    await prisma.venue.deleteMany()
    await prisma.profile.deleteMany()
    await prisma.user.deleteMany()

    // Create users
    console.log('Creating users...')
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@eventify.com',
        password: 'admin123',
        role: 'ADMIN',
        profile: {
          create: {
            bio: 'System Administrator',
            phone: '123-456-7890'
          }
        }
      }
    })

    const organizer = await prisma.user.create({
      data: {
        name: 'Event Organizer',
        email: 'organizer@eventify.com',
        password: 'organizer123',
        role: 'ORGANIZER',
        profile: {
          create: {
            bio: 'Professional Event Organizer',
            phone: '123-456-7891'
          }
        }
      }
    })

    // Create venues
    console.log('Creating venues...')
    const venues = await Promise.all([
      prisma.venue.create({
        data: {
          name: 'Tech Conference Center',
          address: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          capacity: 1000,
          description: 'Modern conference center in the heart of the city',
          amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment']
        }
      }),
      prisma.venue.create({
        data: {
          name: 'Downtown Concert Hall',
          address: '456 Music Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90012',
          capacity: 2000,
          description: 'Premier music venue with state-of-the-art acoustics',
          amenities: ['Premium Sound System', 'VIP Lounge', 'Backstage Area']
        }
      }),
      prisma.venue.create({
        data: {
          name: 'Garden Exhibition Center',
          address: '789 Nature Blvd',
          city: 'Seattle',
          state: 'WA',
          zip: '98101',
          capacity: 1500,
          description: 'Beautiful exhibition space with indoor and outdoor areas',
          amenities: ['Indoor/Outdoor Space', 'Garden Access', 'Exhibition Halls']
        }
      })
    ])

    // Create events
    console.log('Creating events...')
    const eventData = [
      {
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring industry leaders',
        date: new Date('2024-06-15T09:00:00Z'),
        endDate: new Date('2024-06-17T17:00:00Z'),
        location: 'San Francisco, CA',
        price: 299.99,
        category: 'Technology',
        image: 'https://picsum.photos/seed/event1/800/600',
        venue: venues[0],
        ticketTypes: [
          {
            name: 'Early Bird',
            price: 199.99,
            description: 'Limited early bird tickets',
            available: 100,
            benefits: ['Priority Seating', 'Conference Swag']
          },
          {
            name: 'Regular',
            price: 299.99,
            description: 'Standard conference ticket',
            available: 300,
            benefits: ['Conference Access', 'Lunch Included']
          },
          {
            name: 'VIP',
            price: 499.99,
            description: 'VIP conference experience',
            available: 50,
            benefits: ['VIP Seating', 'Exclusive Workshop Access']
          }
        ]
      },
      {
        title: 'Summer Music Festival',
        description: 'A weekend of live music under the stars',
        date: new Date('2024-07-20T18:00:00Z'),
        endDate: new Date('2024-07-22T23:00:00Z'),
        location: 'Los Angeles, CA',
        price: 150.00,
        category: 'Music',
        image: 'https://picsum.photos/seed/event2/800/600',
        venue: venues[1],
        ticketTypes: [
          {
            name: 'General Admission',
            price: 150.00,
            description: 'Standard festival access',
            available: 1000,
            benefits: ['Festival Access', 'Food Court Access']
          },
          {
            name: 'VIP Pass',
            price: 350.00,
            description: 'VIP festival experience',
            available: 200,
            benefits: ['VIP Area Access', 'Meet & Greet', 'Premium Viewing']
          }
        ]
      },
      {
        title: 'Home & Garden Expo',
        description: 'Discover the latest in home and garden innovations',
        date: new Date('2024-08-10T10:00:00Z'),
        endDate: new Date('2024-08-12T18:00:00Z'),
        location: 'Seattle, WA',
        price: 25.00,
        category: 'Lifestyle',
        image: 'https://picsum.photos/seed/event3/800/600',
        venue: venues[2],
        ticketTypes: [
          {
            name: 'Single Day',
            price: 25.00,
            description: 'One day expo access',
            available: 500,
            benefits: ['Expo Access', 'Workshop Access']
          },
          {
            name: 'Weekend Pass',
            price: 45.00,
            description: 'Full weekend access',
            available: 300,
            benefits: ['Three Day Access', 'Expert Consultations']
          }
        ]
      }
    ]

    const events = await Promise.all(
      eventData.map(async (eventInfo) => {
        return prisma.event.create({
          data: {
            title: eventInfo.title,
            description: eventInfo.description,
            date: eventInfo.date,
            endDate: eventInfo.endDate,
            location: eventInfo.location,
            price: eventInfo.price,
            category: eventInfo.category,
            image: eventInfo.image,
            status: 'PUBLISHED',
            capacity: eventInfo.venue.capacity,
            organizerId: organizer.id,
            venueId: eventInfo.venue.id,
            ticketTypes: {
              create: eventInfo.ticketTypes
            },
            schedule: {
              create: [
                {
                  title: 'Registration',
                  description: 'Check-in and welcome',
                  startTime: eventInfo.date,
                  endTime: new Date(eventInfo.date.getTime() + 3600000)
                }
              ]
            }
          }
        })
      })
    )

    console.log('Seeding completed successfully')
    console.log({
      users: { admin, organizer },
      venues,
      events
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })