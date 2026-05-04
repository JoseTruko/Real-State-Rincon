import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import type { PropertyType, PropertyStatus } from '@/types'

type BadgeVariant = PropertyType | PropertyStatus | 'featured' | 'default'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  house:     'bg-amber-100 text-amber-800',
  land:      'bg-green-100 text-green-800',
  farm:      'bg-lime-100 text-lime-800',
  published: 'bg-blue-100 text-blue-800',
  draft:     'bg-yellow-100 text-yellow-800',
  featured:  'bg-primary/10 text-primary',
  default:   'bg-neutral-100 text-neutral-700',
}

export default function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
