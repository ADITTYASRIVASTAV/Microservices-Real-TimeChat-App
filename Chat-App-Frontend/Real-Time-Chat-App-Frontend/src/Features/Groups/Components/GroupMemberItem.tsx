import { motion } from 'framer-motion'
import { X, Crown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import OnlineStatusBadge from '@/shared/components/ui/OnlineStatusBadge'
import { Badge } from '@/components/ui/badge'
import type { GroupMember, UserStatus } from '@/types'

interface GroupMemberItemProps {
  member: GroupMember
  isCurrentUser: boolean
  isAdmin: boolean
  canRemove: boolean
  onRemove?: (email: string) => void
  presenceStatus?: UserStatus
}

const GroupMemberItem = ({
  member,
  isCurrentUser,
  isAdmin,
  canRemove,
  onRemove,
  presenceStatus = 'OFFLINE',
}: GroupMemberItemProps) => {
  console.log('GroupMemberItem rendered for member:', member)

  return (
    <motion.div
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={undefined} alt={member.userEmail} />
          <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-xs">
            {member.userEmail.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute bottom-0 right-0">
          <OnlineStatusBadge status={presenceStatus} size="sm" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {member.userEmail.includes('@') ? member.userEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : member.userEmail}
          </p>
          {isCurrentUser && (
            <span className="text-xs text-gray-400 dark:text-gray-500">(You)</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {isAdmin ? (
            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
              <Crown className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700">
              Member
            </Badge>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {presenceStatus === 'ONLINE' ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {canRemove && onRemove && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(member.userEmail)}
          className="p-1 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Remove ${member.userEmail}`}
        >
          <X className="h-4 w-4" />
        </motion.button>
      )}
    </motion.div>
  )
}

export default GroupMemberItem
