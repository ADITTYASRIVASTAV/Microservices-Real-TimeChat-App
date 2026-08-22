import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Search, Loader2, Plus } from 'lucide-react'
import AvatarUpload from '@/Features/User/Components/AvatarUpload'
import { useGroupManagement } from '@/Features/Groups/Hooks/useGroupManagement'
import { useOnlineUsers } from '@/Features/User/Hooks/useOnlineUsers'
import { useAppSelector } from '@/store/store'
import { selectUser } from '@/Features/Auth/Store/authSlice'
import { validateGroupName, validateBio } from '@/shared/utils/validationUtils'
import type { GroupRequest } from '@/types'

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateGroupModal = ({ isOpen, onClose }: CreateGroupModalProps) => {
  console.log('CreateGroupModal rendered with isOpen:', isOpen)
  const { createGroup, isCreating } = useGroupManagement()
  const { onlineUsers } = useOnlineUsers()
  const currentUser = useAppSelector(selectUser)

  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [groupPicture, setGroupPicture] = useState('')
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ groupName?: string; description?: string; members?: string }>({})
  const [avatarError, setAvatarError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      console.log('CreateGroupModal: resetting form state on open')
      setGroupName('')
      setDescription('')
      setGroupPicture('')
      setSelectedEmails([])
      setSearchQuery('')
      setFieldErrors({})
      setAvatarError(null)
    }
  }, [isOpen])

  const handleAvatarChange = (base64: string) => {
    setGroupPicture(base64)
    setAvatarError(null)
  }

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return onlineUsers.filter((u) => {
      const email = u.userEmail
      if (currentUser && email === currentUser.email) return false
      if (selectedEmails.includes(email)) return false
      if (!query) return true
      return email.toLowerCase().includes(query)
    })
  }, [onlineUsers, searchQuery, selectedEmails, currentUser])

  const handleAddMember = (email: string) => {
    console.log('CreateGroupModal handleAddMember called with email:', email)
    setSelectedEmails((prev) => [...prev, email])
    setSearchQuery('')
  }

  const handleRemoveMember = (email: string) => {
    console.log('CreateGroupModal handleRemoveMember called with email:', email)
    setSelectedEmails((prev) => prev.filter((e) => e !== email))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('CreateGroupModal handleSubmit called')

    const nameError = validateGroupName(groupName)
    const descriptionError = validateBio(description)
    if (nameError || descriptionError) {
      setFieldErrors({
        groupName: nameError || undefined,
        description: descriptionError || undefined,
      })
      return
    }

    if (selectedEmails.length === 0) {
      setFieldErrors((prev) => ({ ...prev, members: 'Add at least one member' }))
      return
    }

    const data: GroupRequest = {
      name: groupName,
      description: description || undefined,
      memberEmails: selectedEmails,
      groupPicture: groupPicture || undefined,
    }
    createGroup(data)
    onClose()
  }

  const handleClose = () => {
    console.log('CreateGroupModal handleClose called')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle>Create New Group</DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <AvatarUpload
              currentImage={groupPicture}
              name={groupName || 'G'}
              onChange={handleAvatarChange}
              size="lg"
            />
            {avatarError && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-red-500"
              >
                {avatarError}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name *</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGroupName(e.target.value)}
              placeholder="Dev Team"
              disabled={isCreating}
            />
            {fieldErrors.groupName && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-red-500"
              >
                {fieldErrors.groupName}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="What is this group about?"
              maxLength={500}
              rows={2}
              disabled={isCreating}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{description.length}/500</span>
              {fieldErrors.description && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-red-500"
                >
                  {fieldErrors.description}
                </motion.p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Add Members *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-9"
                disabled={isCreating}
              />
            </div>

            {fieldErrors.members && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-red-500"
              >
                {fieldErrors.members}
              </motion.p>
            )}

            {/* Selected tags */}
            <AnimatePresence>
              {selectedEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEmails.map((email) => (
                    <motion.span
                      key={email}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {email.includes('@') ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : email}
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(email)}
                        className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        aria-label={`Remove ${email}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Search results & online user list */}
          {(filteredUsers.length > 0 || searchQuery.trim().length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              {filteredUsers.length === 0 ? (
                <p className="p-3 text-sm text-gray-400 dark:text-gray-500">No users found</p>
              ) : (
                filteredUsers.map((presence) => (
                  <motion.button
                    key={presence.userEmail}
                    type="button"
                    onClick={() => handleAddMember(presence.userEmail)}
                    className="flex w-full items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    <div className="relative">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                        {presence.userEmail.charAt(0).toUpperCase()}
                      </span>
                      <span
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-900 ${
                          presence.status === 'ONLINE' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <span className="flex-1 truncate text-sm text-gray-900 dark:text-gray-100">
                      {presence.userEmail.includes('@') ? presence.userEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : presence.userEmail}
                    </span>
                    <Plus className="h-4 w-4 text-blue-500" />
                  </motion.button>
                ))
              )}
            </motion.div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Group'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateGroupModal
