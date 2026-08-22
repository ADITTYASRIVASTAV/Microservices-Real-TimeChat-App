import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

const ChatSkeleton = () => {
  console.log('ChatSkeleton rendered')

  return (
    <motion.div
      className="flex h-full flex-col bg-gray-50 dark:bg-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header Skeleton */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 dark:border-gray-800 px-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 space-y-4 p-4 overflow-hidden">
        {/* Received message */}
        <div className="flex items-end gap-2 max-w-[70%]">
          <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-48 rounded-2xl rounded-bl-sm" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Sent message */}
        <div className="flex items-end gap-2 max-w-[70%] ml-auto flex-row-reverse">
          <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-40 rounded-2xl rounded-br-sm" />
            <Skeleton className="h-3 w-20 ml-auto" />
          </div>
        </div>

        {/* Received message */}
        <div className="flex items-end gap-2 max-w-[70%]">
          <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-14 w-56 rounded-2xl rounded-bl-sm" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Sent message */}
        <div className="flex items-end gap-2 max-w-[70%] ml-auto flex-row-reverse">
          <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-52 rounded-2xl rounded-br-sm" />
            <Skeleton className="h-3 w-20 ml-auto" />
          </div>
        </div>

        {/* Received message */}
        <div className="flex items-end gap-2 max-w-[70%]">
          <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-44 rounded-2xl rounded-bl-sm" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-11 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </motion.div>
  )
}

export default ChatSkeleton