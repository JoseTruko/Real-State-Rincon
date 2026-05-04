import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_COMPARE = 3

interface CompareItem {
  id: string
  title: string
}

interface CompareStore {
  compareList: CompareItem[]
  addToCompare: (item: CompareItem) => boolean
  removeFromCompare: (id: string) => void
  clearCompare: () => void
  isInCompare: (id: string) => boolean
  isFull: boolean
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compareList: [],

      addToCompare: (item) => {
        const { compareList } = get()
        if (compareList.length >= MAX_COMPARE) return false
        if (compareList.some((p) => p.id === item.id)) return true
        set({ compareList: [...compareList, item] })
        return true
      },

      removeFromCompare: (id) => {
        set((state) => ({
          compareList: state.compareList.filter((p) => p.id !== id),
        }))
      },

      clearCompare: () => set({ compareList: [] }),

      isInCompare: (id) => get().compareList.some((p) => p.id === id),

      get isFull() {
        return get().compareList.length >= MAX_COMPARE
      },
    }),
    {
      name: 'rr_compare',
    }
  )
)
