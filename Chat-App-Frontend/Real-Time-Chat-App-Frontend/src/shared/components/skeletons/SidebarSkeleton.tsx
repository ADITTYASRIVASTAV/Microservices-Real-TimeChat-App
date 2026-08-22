import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

const SidebarSkeleton = () => {
  console.log('SidebarSkeleton rendered')

  return (
    <motion.div
      className="flex h-full flex-col p-3 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Tabs skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 flex-1 rounded-md" />
      </div>

      {/* Search bar skeleton */}
      <Skeleton className="h-10 w-full rounded-full" />

      {/* Chat list items */}
      <div className="flex-1 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="flex items-center gap-3 p-2 rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex justify-between gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default SidebarSkeleton