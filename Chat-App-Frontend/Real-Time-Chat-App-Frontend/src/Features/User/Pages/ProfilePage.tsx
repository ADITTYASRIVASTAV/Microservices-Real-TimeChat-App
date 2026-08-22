import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trash2, Check, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import ProfileCard from '@/Features/User/Components/ProfileCard'
import EditProfileModal from '@/Features/User/Components/EditProfileModal'
import { useProfile } from '@/Features/User/Hooks/useProfile'
import { usePresence } from '@/Features/User/Hooks/usePresence'
import { useAppSelector } from '@/store/store'
import { selectProfile } from '@/Features/User/Store/userSlice'
import { selectUser } from '@/Features/Auth/Store/authSlice'
import type { UserStatus } from '@/types'

const STATUS_OPTIONS: { status: UserStatus; color: string; label: string }[] = [
  { status: 'ONLINE', color: 'bg-green-500', label: 'Online' },
  { status: 'BUSY', color: 'bg-yellow-500', label: 'Busy' },
  { status: 'OFFLINE', color: 'bg-gray-400', label: 'Appear Offline' },
]

const ProfilePage = () => {
  console.log('ProfilePage rendered')
  const navigate = useNavigate()
  const { fetchProfile, deleteProfile, isLoading, isUpdating } = useProfile()
  const { updateStatus } = usePresence()
  const profile = useAppSelector(selectProfile)
  const authUser = useAppSelector(selectUser)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [status, setStatus] = useState<UserStatus>('ONLINE')

  useEffect(() => {
    console.log('ProfilePage useEffect: fetching profile on mount')
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (profile) {
      console.log('ProfilePage: profile loaded, setting status from profile')
      setStatus(profile.status)
    }
  }, [profile])

  const handleStatusChange = async (newStatus: UserStatus) => {
    console.log('ProfilePage handleStatusChange called with:', newStatus)
    setStatus(newStatus)
    await updateStatus(newStatus)
  }

  const handleDelete = async () => {
    console.log('ProfilePage handleDelete confirmed')
    await deleteProfile()
  }

  if (isLoading && !profile) {
    console.log('ProfilePage: showing skeleton loader')
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-40" />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!profile) {
    console.log('ProfilePage: profile not loaded, showing error state')
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <p className="text-lg text-gray-500 dark:text-gray-400">Failed to load profile</p>
        <Button onClick={fetchProfile} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-6"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">My Profile</h1>
        </div>
      </div>

      {/* Profile Card */}
      <ProfileCard
        profile={profile}
        isOwnProfile={authUser?.email === profile.email}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={() => {
          console.log('ProfilePage: delete button clicked')
        }}
      />

      {/* Account Information Card */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="mt-6 rounded-2xl border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Name</span>
              <span className="font-medium text-gray-900 dark:text-white">{profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Mobile Number</span>
              <span className="font-medium text-gray-900 dark:text-white">{profile.phoneNumber || 'Not Added'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Account Type</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {profile.provider === 'GOOGLE' ? 'Google Account' : 'Standard Account'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Member Since</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className="font-medium text-gray-900 dark:text-white">{profile.status}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Status Card */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="mt-6 rounded-2xl border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Change Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {STATUS_OPTIONS.map((option) => (
              <motion.button
                key={option.status}
                onClick={() => handleStatusChange(option.status)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-colors ${
                  status === option.status
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`h-3 w-3 rounded-full ${option.color}`} />
                <span className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </span>
                {status === option.status && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <Check className="h-4 w-4 text-blue-500" />
                  </motion.span>
                )}
              </motion.button>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="mt-6 rounded-2xl border-red-200 dark:border-red-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-500 dark:text-red-400">
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Deleting your account is permanent and cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your account and all data will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
      />
    </motion.div>
  )
}

export default ProfilePage
