'use client'

import { GitCompare } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'
import { cn } from '@/lib/utils/cn'

interface CompareButtonProps {
  propertyId: string
  propertyTitle: string
  className?: string
}

export default function CompareButton({ propertyId, propertyTitle, className }: CompareButtonProps) {
  const { isInCompare, addToCompare, removeFromCompare, isFull } = useCompare()
  const inCompare = isInCompare(propertyId)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      removeFromCompare(propertyId)
    } else {
      const added = addToCompare({ id: propertyId, title: propertyTitle })
      if (!added) {
        // Could show a toast here — limit reached
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!inCompare && isFull}
      aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
      title={!inCompare && isFull ? 'Compare limit reached (max 3)' : undefined}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm',
        'shadow-sm transition-all duration-200 hover:scale-110',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100',
        className,
      )}
    >
      <GitCompare
        className={cn(
          'h-4 w-4 transition-colors duration-200',
          inCompare ? 'text-primary' : 'text-neutral-500',
        )}
      />
    </button>
  )
}
