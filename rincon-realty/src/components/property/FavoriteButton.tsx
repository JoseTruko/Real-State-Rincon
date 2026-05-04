'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils/cn'

interface FavoriteButtonProps {
  slug: string
  className?: string
}

export default function FavoriteButton({ slug, className }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const saved = isFavorite(slug)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (saved) {
      removeFavorite(slug)
    } else {
      addFavorite(slug)
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm',
        'shadow-sm transition-all duration-200 hover:scale-110',
        className,
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors duration-200',
          saved ? 'fill-accent text-accent' : 'text-neutral-500',
        )}
      />
    </button>
  )
}
