import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import GroupChatWindow from '@/Features/Groups/Components/GroupChatWindow'
import CreateGroupModal from '@/Features/Groups/Components/CreateGroupModal'
import AddMemberModal from '@/Features/Groups/Components/AddMemberModal'
import { useGroupManagement } from '@/Features/Groups/Hooks/useGroupManagement'
import { useAppSelector } from '@/store/store'
import { selectActiveGroup, selectIsLoading } from '@/Features/Groups/Store/groupSlice'

const GroupChatPage = () => {
  console.log('GroupChatPage rendered')
  const { groupId: groupIdParam } = useParams<{ groupId: string }>()
  const groupId = Number(groupIdParam)
  const navigate = useNavigate()
  const { fetchMyGroups, deleteGroup, leaveGroup } = useGroupManagement()
  const activeGroup = useAppSelector(selectActiveGroup)
  const isLoading = useAppSelector(selectIsLoading)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [isLeaveAlertOpen, setIsLeaveAlertOpen] = useState(false)

  useEffect(() => {
    console.log('GroupChatPage useEffect: fetching group data for id:', groupId)
    if (groupId) {
      fetchMyGroups()
    }
  }, [groupId, fetchMyGroups])

  if (isLoading && !activeGroup) {
    console.log('GroupChatPage: showing loading skeleton')
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!activeGroup) {
    console.log('GroupChatPage: group not found, showing error state')
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Group not found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">This group may have been deleted or you do not have access.</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  const handleAddMembers = () => {
    console.log('GroupChatPage: open add member modal')
    setIsAddMemberModalOpen(true)
  }

  const handleEditGroup = () => {
    console.log('GroupChatPage: open edit group modal')
    setIsEditModalOpen(true)
  }

  const handleDeleteGroup = () => {
    console.log('GroupChatPage: open delete confirmation')
    setIsDeleteAlertOpen(true)
  }

  const handleLeaveGroup = () => {
    console.log('GroupChatPage: open leave confirmation')
    setIsLeaveAlertOpen(true)
  }

  const confirmDelete = async () => {
    console.log('GroupChatPage: delete confirmed')
    setIsDeleteAlertOpen(false)
    await deleteGroup(groupId)
    navigate('/dashboard')
  }

  const confirmLeave = async () => {
    console.log('GroupChatPage: leave confirmed')
    setIsLeaveAlertOpen(false)
    await leaveGroup(groupId)
    navigate('/dashboard')
  }

  return (
    <motion.div
      className="h-full bg-gray-50 dark:bg-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <GroupChatWindow
        groupId={groupId}
        onAddMembers={handleAddMembers}
        onEditGroup={handleEditGroup}
        onDeleteGroup={handleDeleteGroup}
        onLeaveGroup={handleLeaveGroup}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        groupId={groupId}
        existingMembers={activeGroup.members.map((m) => m.userEmail)}
      />

      <CreateGroupModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{activeGroup.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isLeaveAlertOpen} onOpenChange={setIsLeaveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave &quot;{activeGroup.name}&quot;? You will no longer receive messages from this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLeave} className="bg-red-500 hover:bg-red-600">
              Leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}

export default GroupChatPage
