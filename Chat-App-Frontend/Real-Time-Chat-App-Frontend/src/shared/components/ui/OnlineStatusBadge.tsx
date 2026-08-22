import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { UserStatus } from '@/types'
import { getStatusColor, getStatusText } from '@/shared/utils/presenceUtils'

interface OnlineStatusBadgeProps {
  status: UserStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showTooltip?: boolean
}

const OnlineStatusBadge = ({
  status,
  size = 'md',
  className = '',
  showTooltip = false,
}: OnlineStatusBadgeProps) => {

  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  }

  const statusColor = getStatusColor(status)
  const statusText = getStatusText(status)

  const badge = (
    <motion.span
      className={`inline-block rounded-full border-2 border-white dark:border-gray-900 ${sizeClasses[size]} ${statusColor} ${className}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
    />
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <p>{statusText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badge
}

export default OnlineStatusBadge