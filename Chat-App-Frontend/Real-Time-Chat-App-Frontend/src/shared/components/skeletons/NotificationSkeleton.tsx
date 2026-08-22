import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

const NotificationSkeleton = () => {
  console.log('NotificationSkeleton rendered')

  return (
    <motion.div
      className="space-y-3 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex justify-between gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </motion.div>
  )
}

export default NotificationSkeleton