'use client'

import { useCompareStore } from '@/stores/compareStore'

export function useCompare() {
  return useCompareStore()
}
