# Eventify - Event Management Platform

## Overview

Eventify is a comprehensive event management platform built with Next.js, TypeScript, and Prisma. The platform connects event organizers, service providers, and attendees through a modern, feature-rich interface.

## Features

### User Management
- Multi-role authentication system (Admin, Organizer, Service Provider, Attendee)
- JWT-based authentication with secure cookie storage
- Protected routes based on user roles
- User profile management
- Password hashing and security measures

### Event Management
- Create and manage events with detailed information
- Multiple ticket types with pricing
- Event scheduling and timeline
- Venue management
- Image handling and display
- Rich event descriptions and categories

### Dashboard Features
- Role-specific dashboards (Organizer, Admin, Service Provider)
- Event analytics and statistics
- Ticket sales tracking
- Revenue monitoring
- User management tools

### Search and Discovery
- Advanced event search functionality
- Category-based filtering
- Price range filtering
- Location-based search
- Dynamic search results

### Design and UI
- Responsive design for all screen sizes
- Dark/Light theme support
- Modern UI components using shadcn/ui
- Consistent styling with Tailwind CSS
- Loading states and animations

## Technical Stack

### Frontend
- Next.js 15.0.1
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Context for state management

### Backend
- Next.js API routes
- Prisma ORM
- PostgreSQL database
- JWT authentication using jose
- Zod for validation

### Development Tools
- ESLint for code quality
- Prettier for code formatting
- TypeScript for type safety
- Docker for database containerization

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── events/            # Event pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── events/           # Event-specific components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose
- PostgreSQL (via Docker)
- npm or yarn

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd eventify
```

2. Create a `.env.local` file:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eventify"
JWT_SECRET="your-development-secret"
NEXTAUTH_URL="http://localhost:3000"
```

3. Install dependencies:
```bash
npm install
```

4. Start the database:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

6. Seed the database:
```bash
npm run seed
```

7. Start the development server:
```bash
npm run dev
```

### Default User Accounts

After seeding the database, you can use these accounts:

```
Admin User:
Email: admin@eventify.com
Password: admin123

Event Organizer:
Email: organizer@eventify.com
Password: organizer123
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/[id]` - Get event details
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/events` - Get organizer's events
- `POST /api/dashboard/events` - Create new event

## User Roles and Permissions

### Admin
- Access to admin dashboard
- Manage all users
- Manage all events
- System configuration

### Event Organizer
- Create and manage events
- Access to organizer dashboard
- View event statistics
- Manage ticket types

### Service Provider
- Create service listings
- Manage bookings
- Update availability
- View provider dashboard

### Attendee
- Browse events
- Purchase tickets
- View purchased tickets
- Update profile

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Follow component organization structure

### Component Creation
- Create reusable components in `components/ui`
- Use Tailwind CSS for styling
- Implement proper loading states
- Add proper TypeScript types

### API Development
- Use Next.js API routes
- Implement proper error handling
- Validate requests using Zod
- Follow RESTful conventions

## Deployment

### Production Requirements
- PostgreSQL database
- Node.js hosting environment
- Environment variables configuration
- SSL certificate for security

### Deployment Steps
1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Run database migrations
4. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## Troubleshooting

### Common Issues

1. Database Connection
- Verify PostgreSQL is running
- Check DATABASE_URL
- Ensure database exists

2. Authentication Issues
- Verify JWT_SECRET is set
- Check cookie settings
- Confirm user roles

3. Development Server
- Clear `.next` cache
- Verify node modules
- Check port availability

## License

MIT License - See LICENSE file for details

## Support

For support, please open an issue in the repository or contact the maintainers.

## Acknowledgments

- Next.js team for the framework
- Vercel for hosting solutions
- shadcn for UI components
- Contributors and maintainers