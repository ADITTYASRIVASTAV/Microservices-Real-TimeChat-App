import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AvatarUploadProps {
  currentImage?: string
  name: string
  onChange: (base64: string) => void
  size?: 'sm' | 'md' | 'lg'
}

const AvatarUpload = ({ currentImage, name, onChange, size = 'md' }: AvatarUploadProps) => {
  console.log('AvatarUpload rendered with currentImage:', currentImage, 'name:', name, 'size:', size)
  const [preview, setPreview] = useState<string | undefined>(currentImage)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-24 w-24',
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('AvatarUpload handleFileChange: file selected:', file.name, file.type, file.size)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.error('AvatarUpload: invalid file type')
      setError('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      console.error('AvatarUpload: file too large')
      setError('File too large (max 2MB)')
      return
    }

    setError(null)

    // Convert to base64
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      console.log('AvatarUpload: file converted to base64')
      setPreview(base64)
      onChange(base64)
    }
    reader.onerror = (error) => {
      console.error('AvatarUpload: FileReader error:', error)
      setError('Failed to read file')
    }
    reader.readAsDataURL(file)
  }

  const handleClick = () => {
    console.log('AvatarUpload: clicked, opening file input')
    fileInputRef.current?.click()
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('AvatarUpload: clear button clicked')
    setPreview(undefined)
    setError(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" onClick={handleClick}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`relative cursor-pointer rounded-full ${sizeClasses[size]}`}
        >
          <Avatar className={`${sizeClasses[size]}`}>
            <AvatarImage src={preview} alt={name} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <Camera className="h-6 w-6 text-white" />
            <span className="mt-1 text-xs text-white">Change</span>
          </motion.div>
        </motion.div>

        {preview && (
          <button
            onClick={handleClear}
            className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 text-white shadow-md"
            aria-label="Remove avatar"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleClick}
        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
      >
        Upload Photo
      </button>

      {error && (
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default AvatarUpload
