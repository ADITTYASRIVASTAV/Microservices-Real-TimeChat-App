import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

const ProfileSkeleton = () => {
  console.log('ProfileSkeleton rendered')

  return (
    <motion.div
      className="flex flex-col items-center space-y-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Avatar and basic info */}
      <div className="flex flex-col items-center space-y-3 w-full max-w-md">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>

      {/* Bio card */}
      <div className="w-full max-w-md space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>

      {/* Info card */}
      <div className="w-full max-w-md space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>

      {/* Status card */}
      <div className="w-full max-w-md space-y-3">
        <Skeleton className="h-4 w-28" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full max-w-md">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </div>
    </motion.div>
  )
}

export default ProfileSkeleton