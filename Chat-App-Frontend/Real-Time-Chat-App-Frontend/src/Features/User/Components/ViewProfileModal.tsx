import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Ban, CheckCircle } from 'lucide-react'
import OnlineStatusBadge from '@/shared/components/ui/OnlineStatusBadge'
import { getUserByEmailApi, blockUserApi, unblockUserApi, checkIsBlockedApi } from '@/Features/User/Api/userApi'
import { showSuccess, showError } from '@/shared/components/Toast'
import type { UserProfile, UserStatus } from '@/types'

interface ViewProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  userName: string
  userStatus?: UserStatus
}

const ViewProfileModal = ({
  isOpen,
  onClose,
  userEmail,
  userName,
  userStatus = 'OFFLINE',
}: ViewProfileModalProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isBlockingLoading, setIsBlockingLoading] = useState(false)

  useEffect(() => {
    if (isOpen && userEmail) {
      getUserByEmailApi(userEmail)
        .then((data) => setProfile(data))
        .catch(() => setProfile(null))

      checkIsBlockedApi(userEmail)
        .then((blocked) => setIsBlocked(blocked))
        .catch(() => setIsBlocked(false))
    }
  }, [isOpen, userEmail])

  const handleToggleBlock = async () => {
    if (!userEmail) return
    setIsBlockingLoading(true)
    try {
      if (isBlocked) {
        await unblockUserApi(userEmail)
        setIsBlocked(false)
        showSuccess(`Unblocked ${userName || userEmail}`)
      } else {
        await blockUserApi(userEmail)
        setIsBlocked(true)
        showSuccess(`Blocked ${userName || userEmail}`)
      }
    } catch {
      showError('Failed to update block status')
    } finally {
      setIsBlockingLoading(false)
    }
  }

  const displayName = profile?.name || userName
  const phoneNumber = profile?.phoneNumber
  const bio = profile?.bio || 'No bio available'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">User Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center p-4">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.profilePicture} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold">
                {displayName ? displayName.charAt(0).toUpperCase() : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0">
              <OnlineStatusBadge status={(profile?.status || userStatus) as UserStatus} size="md" showTooltip />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{displayName}</h2>

          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            📱 {phoneNumber || 'Mobile Not Added'}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              Verified User
            </Badge>
            <span className={`text-xs font-semibold ${userStatus === 'ONLINE' ? 'text-green-500' : 'text-gray-400'}`}>
              {userStatus}
            </span>
          </div>

          <div className="w-full rounded-xl bg-gray-100 dark:bg-gray-800 p-4 text-center mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">{bio}</p>
          </div>

          <Button
            variant={isBlocked ? 'outline' : 'destructive'}
            className="w-full flex items-center justify-center gap-2 rounded-xl"
            onClick={handleToggleBlock}
            disabled={isBlockingLoading}
          >
            {isBlocked ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                Unblock User
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                Block User
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewProfileModal
