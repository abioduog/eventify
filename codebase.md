# .aidigestignore

```
# Exclude build and dependency directories
.next/
node_modules/

# Exclude specific configuration files
.eslintrc.json
.gitignore
components.json
next.config.js
postcss.config.mjs
tailwind.config.ts
tsconfig.json

# Exclude miscellaneous files
README.md

# Exclude any other unwanted files or patterns
*.log

```

# docker-compose.yml

```yml
services:
  db:
    image: postgres:14
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: eventify
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    command: ["postgres", "-c", "listen_addresses=*"]

volumes:
  postgres_data:
```

# init.sql 

```sql 
-- init.sql
CREATE USER eventify_admin WITH PASSWORD 'eventify_password' SUPERUSER;
CREATE DATABASE eventify;
\c eventify;

-- Create schema and set permissions
CREATE SCHEMA IF NOT EXISTS public;
ALTER SCHEMA public OWNER TO eventify_admin;
GRANT ALL ON SCHEMA public TO eventify_admin;
```

# jsconfig/jsconfig.json

```json
{
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
```

# next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

```

# package.json

```json
{
  "name": "eventify",
  "version": "0.1.0",
  "private": true,
  "prisma": {
    "seed": "ts-node --transpile-only prisma/seed.ts"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "seed": "ts-node --transpile-only prisma/seed.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@prisma/client": "^5.21.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-icons": "^1.3.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.1",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "jose": "^5.9.6",
    "jsonwebtoken": "^9.0.0",
    "lucide-react": "^0.453.0",
    "next": "15.0.1",
    "next-themes": "^0.3.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.53.1",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.17.0",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "15.0.1",
    "postcss": "^8",
    "prisma": "^5.21.1",
    "tailwindcss": "^3.4.1",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.3"
  }
}

```

# prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ORGANIZER
  ADMIN
}

enum EventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
  COMPLETED
}

model User {
  id              String    @id @default(cuid())
  name            String
  email           String    @unique
  password        String
  role            Role      @default(USER)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  organizedEvents Event[]   @relation("OrganizedEvents")
  tickets         Ticket[]
  profile         Profile?
}

model Profile {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  bio       String?
  avatar    String?
  phone     String?
  website   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model Event {
  id          String      @id @default(cuid())
  title       String
  description String
  date        DateTime
  endDate     DateTime?
  location    String
  price       Float
  category    String
  image       String
  status      EventStatus @default(DRAFT)
  capacity    Int
  organizerId String
  organizer   User        @relation("OrganizedEvents", fields: [organizerId], references: [id])
  venue       Venue       @relation(fields: [venueId], references: [id])
  venueId     String
  ticketTypes TicketType[]
  tickets     Ticket[]
  schedule    Schedule[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([organizerId])
  @@index([venueId])
}

model Schedule {
  id          String   @id @default(cuid())
  eventId     String
  event       Event    @relation(fields: [eventId], references: [id])
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime
  speaker     String?
  location    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([eventId])
}

model Venue {
  id          String   @id @default(cuid())
  name        String
  address     String
  city        String
  state       String
  zip         String
  capacity    Int
  description String?
  amenities   String[] @default([])
  events      Event[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TicketType {
  id          String   @id @default(cuid())
  name        String
  price       Float
  description String
  available   Int
  benefits    String[]
  eventId     String
  event       Event    @relation(fields: [eventId], references: [id])
  tickets     Ticket[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([eventId])
}

model Ticket {
  id           String     @id @default(cuid())
  userId       String
  user         User       @relation(fields: [userId], references: [id])
  eventId      String
  event        Event      @relation(fields: [eventId], references: [id])
  ticketTypeId String
  ticketType   TicketType @relation(fields: [ticketTypeId], references: [id])
  status       String     @default("ACTIVE")
  qrCode       String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@index([userId])
  @@index([eventId])
  @@index([ticketTypeId])
}

```

# prisma/seed.ts

```ts
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
```

# public/file.svg

This is a file of the type: SVG Image

# public/globe.svg

This is a file of the type: SVG Image

# public/manifest.json

```json
{
    "name": "Eventify",
    "short_name": "Eventify",
    "display": "standalone",
    "start_url": "/",
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "icons": []
  }
```

# public/next.svg

This is a file of the type: SVG Image

# public/service-worker.js

```js
// This is a minimal service worker that does nothing
self.addEventListener('fetch', function(event) {
    // Empty fetch handler
  });
```

# public/vercel.svg

This is a file of the type: SVG Image

# public/window.svg

This is a file of the type: SVG Image

# setup-db.sh

```sh
#!/bin/bash

# setup-db.sh
echo "Waiting for PostgreSQL to start..."
sleep 5

# Connect to PostgreSQL and set up the database
PGPASSWORD=eventify_password psql -h localhost -U postgres -d postgres -c "
DROP DATABASE IF EXISTS eventify;
DROP USER IF EXISTS eventify_admin;

CREATE USER eventify_admin WITH PASSWORD 'eventify_password';
CREATE DATABASE eventify OWNER eventify_admin;

\c eventify

CREATE SCHEMA IF NOT EXISTS public;
ALTER SCHEMA public OWNER TO eventify_admin;

GRANT ALL PRIVILEGES ON DATABASE eventify TO eventify_admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO eventify_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO eventify_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO eventify_admin;
"

echo "Database setup completed!"
```

# src/app/api/auth/login/route.ts

```ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth-utils'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export async function POST(request: Request) {
  try {
    console.log('Starting login process')
    const body = await request.json()
    console.log('Login attempt for:', body.email)

    // Validate input
    const validatedData = loginSchema.parse(body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    console.log('User found:', user ? 'Yes' : 'No')

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(validatedData.password, user.password)
    console.log('Password valid:', isValid)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken(user)

    // Create response
    const { password: _, ...userWithoutPassword } = user
    const response = NextResponse.json({ user: userWithoutPassword })

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    console.log('Login successful for:', user.email)
    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

```

# src/app/api/auth/logout/route.ts

```ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  cookies().delete('auth-token')
  return NextResponse.json({ success: true })
}
```

# src/app/api/auth/me/route.ts

```ts
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server-auth-utils'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    )
  }
}

```

# src/app/api/auth/register/route.ts

```ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/auth-utils'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['USER', 'ORGANIZER', 'SERVICE_PROVIDER'])
})

export async function POST(request: Request) {
  try {
    console.log('Starting registration process')
    
    const body = await request.json()
    console.log('Registration payload:', { ...body, password: '[REDACTED]' })

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      console.log('Registration failed: Email already exists')
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    console.log('User created successfully:', user)

    // Generate token
    const token = generateToken(user)

    // Set cookie
    const response = NextResponse.json({ user }, { status: 201 })
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}

```

# src/app/api/dashboard/events/route.ts

```ts
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

```

# src/app/api/dashboard/stats/route.ts

```ts
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
```

# src/app/api/test-db/route.ts

```ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Run a simple query
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connection successful',
      userCount 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ 
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
```

# src/app/api/user/profile/route.ts

```ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/server-auth-utils'
import { z } from 'zod'

const prisma = new PrismaClient()

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email } = profileSchema.parse(body)

    // Check if email is already taken by another user
    if (email !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already taken' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { name, email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

```

# src/app/auth/login/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { useAuth } from '@/context/auth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login, error: authError, loading: authLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const callbackUrl = searchParams.get('callbackUrl')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  async function onSubmit(data: LoginForm) {
    try {
      setError(null)
      await login(data.email, data.password)
      // Redirect is now handled by the auth context
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="container max-w-screen-sm mx-auto px-4 py-16">
      <AuthCard
        title="Welcome back"
        description="Sign in to your account"
      >
        {registered && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            Registration successful! Please sign in with your credentials.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting || authLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting || authLoading}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {(error || authError) && (
            <Alert variant="destructive">
              {error || authError}
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || authLoading}
          >
            {isSubmitting || authLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link 
            href="/auth/register" 
            className="text-primary hover:underline"
            tabIndex={0}
          >
            Sign up
          </Link>
        </div>
      </AuthCard>
    </div>
  )
}

```

# src/app/auth/register/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { useAuth } from '@/context/auth'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: z.enum(['USER', 'ORGANIZER', 'SERVICE_PROVIDER'], {
    required_error: 'Please select a role'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { error: authError, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'USER'
    }
  })

  async function onSubmit(data: RegisterForm) {
    try {
      setError(null)
      console.log('Submitting registration data:', { ...data, password: '[REDACTED]' })

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      router.push('/auth/login?registered=true')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="container max-w-screen-sm mx-auto px-4 py-8">
      <AuthCard
        title="Create an account"
        description="Sign up for Eventify"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {(error || authError) && (
            <Alert variant="destructive">{error || authError}</Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              disabled={isSubmitting || loading}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              disabled={isSubmitting || loading}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isSubmitting || loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Regular User</SelectItem>
                    <SelectItem value="ORGANIZER">Event Organizer</SelectItem>
                    <SelectItem value="SERVICE_PROVIDER">Service Provider</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              disabled={isSubmitting || loading}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              disabled={isSubmitting || loading}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </AuthCard>
    </div>
  )
}

```

# src/app/dashboard/events/new/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useFieldArray } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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

type EventForm = z.infer<typeof eventSchema>

// Extract unique categories from sample events
const categories = ['Technology', 'Music', 'Business', 'Food & Drink', 'Art', 'Sports']

export default function NewEventPage() {
  const [error, setError] = useState('')
  const router = useRouter()
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      ticketTypes: [{ name: '', price: 0, description: '', quantity: 100 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ticketTypes',
  })

  async function onSubmit(data: EventForm) {
    try {
      const response = await fetch('/api/dashboard/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      const { event } = await response.json()
      router.push(`/dashboard/events/${event.id}`)
    } catch (error) {
      setError('Failed to create event. Please try again.')
    }
  }

  return (
    <ProtectedRoute allowedRoles={['ORGANIZER']}>
      <div className="container max-w-screen-md mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                    placeholder="Enter event title"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    placeholder="Describe your event"
                    rows={4}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    {...form.register('date')}
                  />
                  {form.formState.errors.date && (
                    <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image URL</Label>
                  <Input
                    id="image"
                    {...form.register('image')}
                    placeholder="Enter image URL"
                  />
                  {form.formState.errors.image && (
                    <p className="text-sm text-destructive">{form.formState.errors.image.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => form.setValue('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...form.register('location')}
                    placeholder="e.g., San Francisco, CA"
                  />
                  {form.formState.errors.location && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Venue Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Venue Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="venue.name">Venue Name</Label>
                    <Input
                      id="venue.name"
                      {...form.register('venue.name')}
                      placeholder="Enter venue name"
                    />
                    {form.formState.errors.venue?.name && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="venue.address">Address</Label>
                    <Input
                      id="venue.address"
                      {...form.register('venue.address')}
                      placeholder="Enter street address"
                    />
                    {form.formState.errors.venue?.address && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.address.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue.city">City</Label>
                    <Input
                      id="venue.city"
                      {...form.register('venue.city')}
                      placeholder="Enter city"
                    />
                    {form.formState.errors.venue?.city && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue.state">State</Label>
                    <Input
                      id="venue.state"
                      {...form.register('venue.state')}
                      placeholder="Enter state"
                    />
                    {form.formState.errors.venue?.state && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.state.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue.zip">ZIP Code</Label>
                    <Input
                      id="venue.zip"
                      {...form.register('venue.zip')}
                      placeholder="Enter ZIP code"
                    />
                    {form.formState.errors.venue?.zip && (
                      <p className="text-sm text-destructive">{form.formState.errors.venue.zip.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Organizer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Organizer Information</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizer.name">Organizer Name</Label>
                    <Input
                      id="organizer.name"
                      {...form.register('organizer.name')}
                      placeholder="Enter organizer name"
                    />
                    {form.formState.errors.organizer?.name && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.organizer.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizer.description">Organizer Description</Label>
                    <Textarea
                      id="organizer.description"
                      {...form.register('organizer.description')}
                      placeholder="Brief description of the organizing entity"
                      rows={3}
                    />
                    {form.formState.errors.organizer?.description && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.organizer.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Types */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Ticket Types</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: '', price: 0, description: '', quantity: 1 })}
                  >
                    Add Ticket Type
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Ticket Type {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          {...form.register(`ticketTypes.${index}.name`)}
                          placeholder="e.g., General Admission"
                        />
                        {form.formState.errors.ticketTypes?.[index]?.name && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...form.register(`ticketTypes.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          placeholder="0.00"
                        />
                        {form.formState.errors.ticketTypes?.[index]?.price && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.price?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          {...form.register(`ticketTypes.${index}.description`)}
                          placeholder="What's included with this ticket type?"
                          rows={2}
                        />
                        {form.formState.errors.ticketTypes?.[index]?.description && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.description?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          step="1"
                          {...form.register(`ticketTypes.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                          placeholder="1"
                        />
                        {form.formState.errors.ticketTypes?.[index]?.quantity && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.quantity?.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity Available</Label>
                        <Input
                          type="number"
                          {...form.register(`ticketTypes.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                          placeholder="100"
                        />
                        {form.formState.errors.ticketTypes?.[index]?.quantity && (
                          <p className="text-sm text-destructive">
                            {form.formState.errors.ticketTypes[index]?.quantity?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/events')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

```

# src/app/dashboard/events/page.tsx

```tsx
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
```

# src/app/dashboard/layout.tsx

```tsx
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
```

# src/app/dashboard/page.tsx

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalEvents: number
  activeEvents: number
  totalTicketsSold: number
  totalRevenue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="animate-pulse">Loading dashboard...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activeEvents || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalTicketsSold || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats?.totalRevenue?.toLocaleString() || '0'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

# src/app/events/[id]/error.tsx

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}

```

# src/app/events/[id]/loading.tsx

```tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-[400px] bg-muted rounded-lg mb-8" />
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    </div>
  )
}

```

# src/app/events/[id]/page.tsx

```tsx
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

```

# src/app/events/page.tsx

```tsx
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

```

# src/app/favicon.ico

This is a binary file of the type: Binary

# src/app/fonts/GeistMonoVF.woff

This is a binary file of the type: Binary

# src/app/fonts/GeistVF.woff

This is a binary file of the type: Binary

# src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: Arial, Helvetica, sans-serif;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

```

# src/app/layout.tsx

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/ui/header"
import { AuthProvider } from "@/context/auth"

const inter = Inter({ subsets: ["latin"], display: 'swap' })

export const metadata: Metadata = {
  title: "Eventify - Event Management Made Simple",
  description: "Professional event management platform for modern businesses",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="border-t">
              <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Eventify. All rights reserved.
              </div>
            </footer>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

```

# src/app/page.tsx

```tsx
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-4 text-foreground">
          Welcome to Eventify
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Event Management Made Simple
        </p>
        <Button size="lg">
          Get Started
        </Button>
      </section>
    </div>
  )
}

```

# src/app/profile/page.tsx

```tsx
'use client'

import { useAuth } from '@/context/auth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  async function onSubmit(data: ProfileForm) {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setIsEditing(false)
    } catch (error) {
      setError('Failed to update profile')
    }
  }

  return (
    <ProtectedRoute>
      <div className="container max-w-screen-sm mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  disabled={!isEditing}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={!isEditing}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
```

# src/components/auth/AuthCard.tsx

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}
```

# src/components/auth/ProtectedRoute.tsx

```tsx
'use client'

import { useAuth } from '@/context/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }

    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role as string)) {
      router.push('/')
    }
  }, [user, loading, router, allowedRoles])

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!user) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role as string)) {
    return null
  }

  return <>{children}</>
}

```

# src/components/events/EventDetails.tsx

```tsx
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

```

# src/components/events/EventDetailsSkeleton.tsx

```tsx
export function EventDetailsSkeleton() {
    return (
      <div className="animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="relative h-[400px] mb-8">
          <div className="w-full h-full bg-muted rounded-lg" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="w-24 h-6 bg-muted rounded mb-4" />
            <div className="w-3/4 h-10 bg-muted rounded mb-4" />
            <div className="flex gap-4">
              <div className="w-32 h-5 bg-muted rounded" />
              <div className="w-32 h-5 bg-muted rounded" />
            </div>
          </div>
        </div>
  
        {/* Main Content Skeleton */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="w-48 h-8 bg-muted rounded mb-4" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-muted rounded" />
                  <div className="w-3/4 h-4 bg-muted rounded" />
                </div>
              </section>
  
              {/* Venue Section */}
              <section>
                <div className="w-32 h-8 bg-muted rounded mb-4" />
                <div className="bg-card rounded-lg p-4">
                  <div className="w-48 h-6 bg-muted rounded mb-2" />
                  <div className="w-64 h-4 bg-muted rounded" />
                </div>
              </section>
  
              {/* Organizer Section */}
              <section>
                <div className="w-40 h-8 bg-muted rounded mb-4" />
                <div className="bg-card rounded-lg p-4">
                  <div className="w-48 h-6 bg-muted rounded mb-2" />
                  <div className="w-full h-4 bg-muted rounded" />
                </div>
              </section>
            </div>
  
            {/* Right Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 bg-card rounded-lg p-6 shadow-lg">
                <div className="w-32 h-8 bg-muted rounded mb-4" />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-32 h-6 bg-muted rounded" />
                        <div className="w-24 h-6 bg-muted rounded" />
                      </div>
                      <div className="w-full h-4 bg-muted rounded mb-4" />
                      <div className="w-full h-10 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
```

# src/components/events/EventSchedule.tsx

```tsx
import { EventDay } from '@/types/events'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

interface EventScheduleProps {
  schedule: EventDay[]
}

export function EventSchedule({ schedule }: EventScheduleProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
      <Accordion type="single" collapsible>
        {schedule.map((day, index) => (
          <AccordionItem key={index} value={`day-${index}`}>
            <AccordionTrigger>
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-4">
                {day.items.map(item => (
                  <li key={item.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

```

# src/components/events/EventSpeakers.tsx

```tsx
import { EventSpeaker } from '@/types/events'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface EventSpeakersProps {
  speakers: EventSpeaker[]
}

export function EventSpeakers({ speakers }: EventSpeakersProps) {
  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Speakers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map(speaker => (
          <Card key={speaker.id} className="flex flex-col items-center text-center">
            <img src={speaker.photo} alt={speaker.name} className="w-24 h-24 rounded-full mb-4" />
            <CardHeader>
              <CardTitle>{speaker.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{speaker.title}</p>
              <p className="text-sm mt-2">{speaker.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
```

# src/components/events/SearchAndFilter.tsx

```tsx
"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

const filterCategories = [
  "All",
  "Conference",
  "Workshop",
  "Seminar",
  "Networking",
  "Concert",
  "Exhibition"
]

export function SearchAndFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    return params.toString()
  }

  const handleSearch = (value: string) => {
    router.push(`${pathname}?${createQueryString('search', value)}`)
  }

  const handleCategoryChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('category', value)}`)
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    router.push(`${pathname}?${createQueryString(`${type}Price`, value)}`)
  }

  const handleLocationChange = (value: string) => {
    router.push(`${pathname}?${createQueryString('location', value)}`)
  }

  const clearFilters = () => {
    router.push(pathname)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            defaultValue={searchParams.get('search') ?? ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select 
          defaultValue={searchParams.get('category') ?? 'All'}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {filterCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="number"
          placeholder="Min price"
          className="w-full sm:w-[150px]"
          defaultValue={searchParams.get('minPrice') ?? ''}
          onChange={(e) => handlePriceChange('min', e.target.value)}
        />
        <Input
          type="number"
          placeholder="Max price"
          className="w-full sm:w-[150px]"
          defaultValue={searchParams.get('maxPrice') ?? ''}
          onChange={(e) => handlePriceChange('max', e.target.value)}
        />
        <Input
          placeholder="Location"
          className="flex-grow"
          defaultValue={searchParams.get('location') ?? ''}
          onChange={(e) => handleLocationChange(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="w-full sm:w-auto">
          Clear Filters
        </Button>
      </div>
    </div>
  )
}

```

# src/components/theme-provider.tsx

```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

# src/components/ui/accordion.tsx

```tsx
import * as React from 'react'

interface AccordionProps {
  children: React.ReactNode
}

export function Accordion({ children }: AccordionProps) {
  return <div className="accordion">{children}</div>
}

interface AccordionItemProps {
  children: React.ReactNode
}

export function AccordionItem({ children }: AccordionItemProps) {
  return <div className="accordion-item">{children}</div>
}

interface AccordionTriggerProps {
  children: React.ReactNode
  onClick: () => void
}

export function AccordionTrigger({ children, onClick }: AccordionTriggerProps) {
  return (
    <button className="accordion-trigger" onClick={onClick}>
      {children}
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
}

export function AccordionContent({ children }: AccordionContentProps) {
  return <div className="accordion-content">{children}</div>
}
```

# src/components/ui/alert.tsx

```tsx
import React from 'react'

interface AlertProps {
  variant: 'destructive' | 'info' | 'success'
  children: React.ReactNode
}

export function Alert({ variant, children }: AlertProps) {
  const variantClasses = {
    destructive: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
  }

  return (
    <div className={`p-4 rounded ${variantClasses[variant]}`}>
      {children}
    </div>
  )
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>
}
```

# src/components/ui/badge.tsx

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

# src/components/ui/breadcrumb.tsx

```tsx
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="container mx-auto px-4 py-4">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link 
            href="/" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
            {index === items.length - 1 ? (
              <span className="font-medium">{item.label}</span>
            ) : (
              <Link 
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

# src/components/ui/button.tsx

```tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

# src/components/ui/card.tsx

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

# src/components/ui/dropdown-menu.tsx

```tsx
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

# src/components/ui/header.tsx

```tsx
'use client'

import Link from 'next/link'
import { Button } from './button'
import { ThemeToggle } from './theme-toggle'
import { useAuth } from '@/context/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Header() {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.refresh()
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Eventify
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Link href="/events" className="hover:text-primary">Events</Link>
          <Link href="/about" className="hover:text-primary">About</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'ORGANIZER' && (
                  <DropdownMenuItem>
                    <Link href="/dashboard">Organizer Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'SERVICE_PROVIDER' && (
                  <DropdownMenuItem>
                    <Link href="/provider/dashboard">Provider Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link href="/tickets">My Tickets</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

```

# src/components/ui/input.tsx

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

```

# src/components/ui/label.tsx

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

# src/components/ui/select.tsx

```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

const Select = SelectPrimitive.Root

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectValue = SelectPrimitive.Value

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
}

```

# src/components/ui/tabs.tsx

```tsx
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

# src/components/ui/textarea.tsx

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
```

# src/components/ui/theme-toggle.tsx

```tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

# src/context/auth.tsx

```tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { useRouter, usePathname } from 'next/navigation'
import { getRoleRedirectPath } from '@/lib/auth-utils'

interface AuthContextType {
  user: Partial<User> | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Partial<User> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [pathname])

  async function checkAuth() {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setUser(data.user)
      const redirectPath = getRoleRedirectPath(data.user.role)
      router.push(redirectPath)
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      setError(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      setError('Logout failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

```

# src/data/sampleEvents.ts

```ts
export const sampleEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    date: "2024-04-15T09:00:00",
    location: "San Francisco, CA",
    description: "Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.",
    price: 299,
    category: "Technology",
    image: "https://picsum.photos/seed/tech/400/200",
    venue: {
      name: "Tech Venue",
      address: "123 Tech St",
      city: "San Francisco",
      state: "CA",
      zip: "94103"
    },
    organizer: {
      name: "Tech Org",
      description: "Leading tech organization"
    },
    ticketTypes: [
      {
        id: 1,
        name: "General Admission",
        price: 299,
        description: "Standard entry ticket"
      }
    ]
  },
  {
    id: 2,
    title: "Music Festival",
    date: "2024-05-20T16:00:00",
    location: "Austin, TX",
    description: "Three days of non-stop music featuring top artists from around the world.",
    price: 199,
    category: "Music",
    image: "https://picsum.photos/seed/music/400/200",
    venue: {
      name: "Music Venue",
      address: "456 Music Ave",
      city: "Austin",
      state: "TX",
      zip: "73301"
    },
    organizer: {
      name: "Music Org",
      description: "Top music organization"
    },
    ticketTypes: [
      {
        id: 1,
        name: "General Admission",
        price: 299,
        description: "Standard entry ticket"
      }
    ]
  },
  {
    id: 3,
    title: "Food & Wine Expo",
    date: "2024-06-10T11:00:00",
    location: "New York, NY",
    description: "Experience culinary excellence with renowned chefs and wine experts.",
    price: 150,
    category: "Food & Drink",
    image: "https://picsum.photos/seed/food/400/200",
    venue: {
      name: "Food Venue",
      address: "789 Culinary Rd",
      city: "New York",
      state: "NY",
      zip: "10001"
    },
    organizer: {
      name: "Food Org",
      description: "Renowned culinary organization"
    },
    ticketTypes: [
      {
        id: 1,
        name: "General Admission",
        price: 299,
        description: "Standard entry ticket"
      }
    ]
  },
  {
    id: 4,
    title: "Business Summit",
    date: "2024-07-05T08:30:00",
    location: "Chicago, IL",
    description: "Network with industry leaders and learn about the latest business trends.",
    price: 399,
    category: "Business",
    image: "https://picsum.photos/seed/business/400/200",
    venue: {
      name: "Business Venue",
      address: "101 Business Blvd",
      city: "Chicago",
      state: "IL",
      zip: "60601"
    },
    organizer: {
      name: "Business Org",
      description: "Leading business organization"
    },
    ticketTypes: [
      {
        id: 1,
        name: "General Admission",
        price: 299,
        description: "Standard entry ticket"
      }
    ]
  },
  {
    id: 5,
    title: "Art Exhibition",
    date: "2024-08-15T10:00:00",
    location: "Los Angeles, CA",
    description: "Featuring contemporary works from emerging and established artists.",
    price: 25,
    category: "Art",
    image: "https://picsum.photos/seed/art/400/200",
    venue: {
      name: "Art Venue",
      address: "202 Art St",
      city: "Los Angeles",
      state: "CA",
      zip: "90001"
    },
    organizer: {
      name: "Art Org",
      description: "Prominent art organization"
    },
    ticketTypes: [
      {
        id: 1,
        name: "General Admission",
        price: 299,
        description: "Standard entry ticket"
      }
    ]
  },
  {
    id: 6,
    title: "Sports Convention",
    date: "2024-09-01T09:00:00",
    location: "Miami, FL",
    description: "Meet your favorite athletes and discover the latest in sports technology.",
    price: 75,
    category: "Sports",
    image: "https://picsum.photos/seed/sports/400/200",
    venue: {
      name: "Sports Venue",
      address: "303 Sports Ln",
      city: "Miami",
      state: "FL",
      zip: "33101"
    },
    organizer: {
      name: "Sports Org",
      description: "Leading sports organization"
    },
    ticketTypes: [
      {
        id: 1,
        name: "General Admission",
        price: 299,
        description: "Standard entry ticket"
      }
    ]
  }
];

```

# src/hooks/useEventFilters.ts

```ts
"use client"

import { useCallback, useMemo } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

interface Event {
  id: number
  title: string
  date: string
  location: string
  description: string
  price: number
  category: string
}

export function useEventFilters(events: Event[]) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const search = searchParams.get('search')?.toLowerCase()
      const category = searchParams.get('category')
      const minPrice = Number(searchParams.get('minPrice'))
      const maxPrice = Number(searchParams.get('maxPrice'))
      const location = searchParams.get('location')?.toLowerCase()

      if (search && !event.title.toLowerCase().includes(search) && 
          !event.description.toLowerCase().includes(search)) {
        return false
      }

      if (category && category !== 'All' && event.category !== category) {
        return false
      }

      if (minPrice && event.price < minPrice) {
        return false
      }

      if (maxPrice && event.price > maxPrice) {
        return false
      }

      if (location && !event.location.toLowerCase().includes(location)) {
        return false
      }

      return true
    })
  }, [events, searchParams])

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [pathname, router])

  return {
    filteredEvents,
    updateFilters,
    clearFilters,
  }
}

```

# src/lib/auth-utils.ts

```ts
import { hash, compare } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './db'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-development-secret'
)

export async function hashPassword(password: string): Promise<string> {
  try {
    return await hash(password, 12)
  } catch (error) {
    console.error('Password hashing error:', error)
    throw new Error('Password hashing failed')
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await compare(password, hashedPassword)
  } catch (error) {
    console.error('Password verification error:', error)
    throw new Error('Password verification failed')
  }
}

export async function generateToken(user: any): Promise<string> {
  try {
    return await new SignJWT({ 
      id: user.id,
      email: user.email,
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET)
  } catch (error) {
    console.error('Token generation error:', error)
    throw new Error('Token generation failed')
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export function getRoleRedirectPath(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'ORGANIZER':
      return '/dashboard'
    case 'SERVICE_PROVIDER':
      return '/provider/dashboard'
    default:
      return '/events'
  }
}

```

# src/lib/auth.ts

```ts
import { hash, compare } from 'bcryptjs'
import { prisma } from './db'
import { generateToken, verifyToken } from './auth-utils'

const JWT_SECRET = process.env.JWT_SECRET || 'your-development-secret'

export async function hashPassword(password: string): Promise<string> {
  try {
    return await hash(password, 12)
  } catch (error) {
    console.error('Password hashing error:', error)
    throw new Error('Password hashing failed')
  }
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await compare(password, hashedPassword)
  } catch (error) {
    console.error('Password verification error:', error)
    throw new Error('Password verification failed')
  }
}

// Re-export functions from auth-utils
export { generateToken, verifyToken } from './auth-utils'

export async function getCurrentUser(token?: string) {
  try {
    if (!token) return null
    
    const payload = await verifyToken(token)
    if (!payload?.id) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export function getUserRoleRedirectPath(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'ORGANIZER':
      return '/dashboard'
    case 'SERVICE_PROVIDER':
      return '/provider/dashboard'
    default:
      return '/events'
  }
}

```

# src/lib/db.ts

```ts
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
}

const prisma = global.prisma ?? prismaClientSingleton()

export { prisma }

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

```

# src/lib/server-auth-utils.ts

```ts
import { cookies } from 'next/headers'
import { prisma } from './db'
import { verifyToken } from './auth-utils'

export async function getCurrentUser() {
  try {
    const token = cookies().get('auth-token')?.value
    
    if (!token) {
      return null
    }
    
    const payload = await verifyToken(token)
    if (!payload?.id) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
    
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
```

# src/lib/utils.ts

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

```

# src/middleware.ts

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, getRoleRedirectPath } from './lib/auth-utils'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('auth-token')?.value

  const protectedPaths = ['/dashboard', '/profile', '/provider', '/admin']
  const authPaths = ['/auth/login', '/auth/register']
  
  const isAuthPath = authPaths.some(ap => path.startsWith(ap))
  const isProtectedPath = protectedPaths.some(pp => path.startsWith(pp))

  try {
    const payload = token ? await verifyToken(token) : null
    const isAuthenticated = !!payload

    if (isAuthenticated && isAuthPath) {
      const redirectPath = getRoleRedirectPath(payload.role as string)
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }

    if (!isAuthenticated && isProtectedPath) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }

    if (isAuthenticated && isProtectedPath) {
      const userRole = payload.role as string
      const allowedPath = getRoleRedirectPath(userRole)
      
      if (!path.startsWith(allowedPath)) {
        return NextResponse.redirect(new URL(allowedPath, request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/provider/:path*',
    '/admin/:path*',
    '/auth/:path*'
  ],
}

```

# src/types/events.ts

```ts
export interface EventSpeaker {
    id: number
    name: string
    title: string
    bio: string
    photo: string
  }
  
  export interface EventScheduleItem {
    id: number
    time: string
    title: string
    description: string
    speaker?: EventSpeaker
  }
  
  export interface EventDay {
    date: string
    items: EventScheduleItem[]
  }
  
  export interface EventTicketType {
    id: number
    name: string
    price: number
    description: string
    available: number
  }
  
  export interface Event {
    id: number
    title: string
    date: string
    endDate?: string
    location: string
    description: string
    price: number
    category: string
    image: string
    organizer: {
      name: string
      description: string
      logo?: string
    }
    schedule: EventDay[]
    speakers?: EventSpeaker[]
    ticketTypes: EventTicketType[]
    venue: {
      name: string
      address: string
      city: string
      state: string
      zip: string
      coordinates: {
        lat: number
        lng: number
      }
    }
  }
```

