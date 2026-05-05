'use client'

import { GitCompare } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'
import { cn } from '@/lib/utils/cn'

interface CompareButtonProps {
  propertyId: string
  propertyTitle: string
  className?: string
  showLabel?: boolean
  locale?: 'en' | 'es'
}

export default function CompareButton({
  propertyId,
  propertyTitle,
  className,
  showLabel = false,
  locale = 'en',
}: CompareButtonProps) {
  const { isInCompare, addToCompare, removeFromCompare, isFull } = useCompare()
  const inCompare = isInCompare(propertyId)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      removeFromCompare(propertyId)
    } else {
      addToCompare({ id: propertyId, title: propertyTitle })
    }
  }

  if (showLabel) {
    return (
      <button
        onClick={handleClick}
        disabled={!inCompare && isFull}
        className={cn(
          'flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          inCompare
            ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
            : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200',
          className,
        )}
      >
        <GitCompare className="h-4 w-4 shrink-0" />
        {inCompare
          ? (locale === 'es' ? 'En comparación' : 'In comparison')
          : (locale === 'es' ? 'Comparar' : 'Compare')}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={!inCompare && isFull}
      aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
      className={cn(
        'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        'bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-200',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        inCompare
          ? 'text-primary ring-1 ring-primary/40'
          : 'text-neutral-600 hover:text-primary hover:ring-1 hover:ring-primary/30',
        className,
      )}
    >
      <GitCompare className="h-3.5 w-3.5 shrink-0" />
      <span>{locale === 'es' ? 'Comparar' : 'Compare'}</span>
    </button>
  )
}
