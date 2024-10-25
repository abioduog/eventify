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
