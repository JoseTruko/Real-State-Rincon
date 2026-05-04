'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, GitCompare } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-secondary text-white shadow-2xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          <GitCompare className="h-5 w-5 shrink-0 text-accent" />
          <span className="text-sm font-medium shrink-0">Compare ({compareList.length}/3):</span>
          <div className="flex gap-2">
            {compareList.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1 text-sm shrink-0"
              >
                <span className="max-w-[120px] truncate">{item.title}</span>
                <button
                  onClick={() => removeFromCompare(item.id)}
                  aria-label={`Remove ${item.title} from compare`}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="rounded-lg bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Compare now
          </Link>
        </div>
      </div>
    </div>
  )
}
