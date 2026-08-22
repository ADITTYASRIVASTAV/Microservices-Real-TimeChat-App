import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pencil, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import OnlineStatusBadge from '@/shared/components/ui/OnlineStatusBadge'
import { getStatusText } from '@/shared/utils/presenceUtils'
import type { UserProfile, UserStatus } from '@/types'

interface ProfileCardProps {
  profile: UserProfile
  isOwnProfile?: boolean
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
}

const ProfileCard = ({
  profile,
  isOwnProfile = false,
  onEdit,
  onDelete,
  showActions = true,
}: ProfileCardProps) => {
  console.log('ProfileCard rendered with profile:', profile)

  const statusText = getStatusText(profile.status)
  const memberSince = format(parseISO(profile.createdAt), 'MMM yyyy')

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="w-full max-w-md mx-auto rounded-2xl border-gray-200 dark:border-gray-800 shadow-sm">
        <CardContent className="flex flex-col items-center p-6">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.profilePicture} alt={profile.name} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0">
              <OnlineStatusBadge status={profile.status as UserStatus} size="md" showTooltip />
            </div>
          </motion.div>

          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {profile.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            📱 {profile.phoneNumber || 'Add Mobile Number'}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <Badge variant={profile.provider === 'GOOGLE' ? 'secondary' : 'default'}>
              {profile.provider === 'GOOGLE' ? 'Google Account' : 'Standard Account'}
            </Badge>
            <span className={`text-xs font-medium ${profile.status === 'ONLINE' ? 'text-green-500' : 'text-gray-400'}`}>
              {statusText}
            </span>
          </div>

          <div className="mt-4 w-full rounded-xl bg-gray-50 dark:bg-gray-800 p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
              {profile.bio || 'No bio yet'}
            </p>
          </div>

          <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Member since {memberSince}
          </p>

          {showActions && isOwnProfile && (
            <div className="mt-6 flex gap-3 w-full">
              <Button variant="outline" onClick={onEdit} className="flex-1">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="destructive" onClick={onDelete} className="flex-1">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProfileCard
