import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, X } from 'lucide-react'
import AvatarUpload from '@/Features/User/Components/AvatarUpload'
import { validateName, validateBio } from '@/shared/utils/validationUtils'
import { useProfile } from '@/Features/User/Hooks/useProfile'
import type { UpdateProfileRequest, UserProfile } from '@/types'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: UserProfile
}

const EditProfileModal = ({ isOpen, onClose, profile }: EditProfileModalProps) => {
  console.log('EditProfileModal rendered with isOpen:', isOpen)
  const { updateProfile, isUpdating } = useProfile()
  const [name, setName] = useState(profile.name)
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [profilePicture, setProfilePicture] = useState(profile.profilePicture || '')
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; bio?: string }>({})
  const [avatarError, setAvatarError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setName(profile.name)
      setPhoneNumber(profile.phoneNumber || '')
      setBio(profile.bio || '')
      setProfilePicture(profile.profilePicture || '')
      setFieldErrors({})
      setAvatarError(null)
    }
  }, [isOpen, profile])

  const handleAvatarChange = (base64: string) => {
    setProfilePicture(base64)
    setAvatarError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('EditProfileModal handleSubmit called')

    const nameError = validateName(name)
    const bioError = validateBio(bio)
    if (nameError || bioError) {
      setFieldErrors({
        name: nameError || undefined,
        bio: bioError || undefined,
      })
      return
    }

    const data: UpdateProfileRequest = {
      name,
      phoneNumber: phoneNumber || undefined,
      bio: bio || undefined,
      profilePicture: profilePicture || undefined,
    }
    updateProfile(data)
    onClose()
  }

  const handleClose = () => {
    console.log('EditProfileModal handleClose called')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle>Edit Profile</DialogTitle>
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
              currentImage={profilePicture}
              name={name}
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
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={isUpdating}
            />
            {fieldErrors.name && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-red-500"
              >
                {fieldErrors.name}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Mobile Number</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. +91 9876543210"
              disabled={isUpdating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              maxLength={500}
              rows={3}
              disabled={isUpdating}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">{bio.length}/500</span>
              {fieldErrors.bio && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-red-500"
                >
                  {fieldErrors.bio}
                </motion.p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal
