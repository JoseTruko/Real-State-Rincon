import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

export default function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded bg-neutral-200', className)}
      {...props}
    />
  )
}
