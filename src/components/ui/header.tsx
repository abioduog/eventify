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
