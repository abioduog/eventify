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
