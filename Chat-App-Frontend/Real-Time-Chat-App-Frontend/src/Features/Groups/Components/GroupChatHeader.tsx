import { motion } from 'framer-motion'
import { ArrowLeft, Info, MoreVertical, Users, Settings, Trash2, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Group } from '@/types'

interface GroupChatHeaderProps {
  group: Group
  onBack?: () => void
  onInfoClick: () => void
  isAdmin: boolean
  onAddMembers: () => void
  onEditGroup: () => void
  onDeleteGroup: () => void
  onLeaveGroup: () => void
}

const GroupChatHeader = ({
  group,
  onBack,
  onInfoClick,
  isAdmin,
  onAddMembers,
  onEditGroup,
  onDeleteGroup,
  onLeaveGroup,
}: GroupChatHeaderProps) => {
  console.log('GroupChatHeader rendered with group:', group, 'isAdmin:', isAdmin)

  const memberCount = group.memberCount || group.members?.length || 0
  const groupInitials = group.name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)

  return (
    <motion.div
      className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Left: back, avatar, name, member count */}
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={group.groupPicture} alt={group.name} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {groupInitials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {group.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {memberCount} members
          </p>
        </div>
      </div>

      {/* Right: info button and menu */}
      <div className="flex items-center gap-1">
        <button
          onClick={onInfoClick}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          aria-label="Group info"
        >
          <Info className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
            <MoreVertical className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onInfoClick}>
              <Users className="mr-2 h-4 w-4" />
              Group Info
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onEditGroup}>
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Group
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddMembers}>
                  <Users className="mr-2 h-4 w-4" />
                  Add Members
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={onDeleteGroup}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Group
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={onLeaveGroup}>
              <LogOut className="mr-2 h-4 w-4" />
              Leave Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}

export default GroupChatHeader
