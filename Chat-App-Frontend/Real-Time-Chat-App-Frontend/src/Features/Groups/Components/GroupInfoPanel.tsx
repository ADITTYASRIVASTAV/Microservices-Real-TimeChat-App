import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Edit, Trash2, LogOut, Crown } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import GroupMemberItem from './GroupMemberItem'
import { format, parseISO } from 'date-fns'
import type { Group, GroupMember } from '@/types'

interface GroupInfoPanelProps {
  group: Group
  isOpen: boolean
  onClose: () => void
  currentUserEmail: string
  isAdmin: boolean
  onAddMembers: () => void
  onEditGroup: () => void
  onDeleteGroup: () => void
  onLeaveGroup: () => void
  onRemoveMember: (email: string) => void
}

const GroupInfoPanel = ({
  group,
  isOpen,
  onClose,
  currentUserEmail,
  isAdmin,
  onAddMembers,
  onEditGroup,
  onDeleteGroup,
  onLeaveGroup,
  onRemoveMember,
}: GroupInfoPanelProps) => {
  console.log('GroupInfoPanel rendered with group:', group, 'isOpen:', isOpen, 'isAdmin:', isAdmin)

  const groupInitials = group.name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)

  const createdAt = format(parseISO(group.createdAt), 'MMM d, yyyy')

  return (
    <AnimatePresence>
      {isOpen && (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <SheetContent side="right" className="w-full md:w-[320px] p-0 overflow-y-auto">
            <SheetHeader className="border-b border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-semibold">Group Info</SheetTitle>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </SheetHeader>

            <div className="p-4 space-y-4">
              {/* Group Avatar and name */}
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={group.groupPicture} alt={group.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                    {groupInitials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                  {group.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created by {group.createdBy}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{createdAt}</p>
              </div>

              {/* Description */}
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  {group.description || 'No description'}
                </p>
              </div>

              {/* Members Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Members ({group.members?.length || group.memberCount || 0})
                  </h3>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onAddMembers}
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>

                <motion.div
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
                >
                  {group.members?.map((member: GroupMember) => (
                    <motion.div
                      key={member.userEmail}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <GroupMemberItem
                        member={member}
                        isCurrentUser={member.userEmail === currentUserEmail}
                        isAdmin={member.role === 'ADMIN'}
                        canRemove={isAdmin && member.userEmail !== currentUserEmail}
                        onRemove={onRemoveMember}
                        presenceStatus="OFFLINE"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Admin Actions */}
              {isAdmin && (
                <div className="rounded-xl border border-yellow-200 dark:border-yellow-800 p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    Admin Controls
                  </h3>
                  <div className="mt-2 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={onEditGroup}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Group
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full justify-start"
                      onClick={onDeleteGroup}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Group
                    </Button>
                  </div>
                </div>
              )}

              {/* Leave Group */}
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={onLeaveGroup}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Leave Group
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </AnimatePresence>
  )
}

export default GroupInfoPanel
