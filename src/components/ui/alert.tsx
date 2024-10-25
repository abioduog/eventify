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