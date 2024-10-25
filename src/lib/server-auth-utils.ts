import { cookies } from 'next/headers'
import { prisma } from './db'
import { verifyToken } from './auth-utils'

export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value
    
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
