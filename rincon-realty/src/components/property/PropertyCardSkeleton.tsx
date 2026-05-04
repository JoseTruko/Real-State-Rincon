import Skeleton from '@/components/ui/Skeleton'

interface PropertyCardSkeletonProps {
  count?: number
}

function SingleSkeleton() {
  return (
    <div className="bg-surface border border-neutral-200 rounded-xl overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3 pt-3 border-t border-neutral-100">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default function PropertyCardSkeleton({ count = 1 }: PropertyCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SingleSkeleton key={i} />
      ))}
    </>
  )
}
