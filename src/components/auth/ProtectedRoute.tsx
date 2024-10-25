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
