import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { showError, showSuccess } from '@/shared/components/Toast'

interface NetworkErrorPageProps {
  onRetry?: () => void
}

const NetworkErrorPage = ({ onRetry }: NetworkErrorPageProps) => {
  console.log('NetworkErrorPage rendered')
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)

  useEffect(() => {
    console.log('NetworkErrorPage useEffect: setting up online/offline listeners')
    const handleOnline = () => {
      console.log('NetworkErrorPage: online event detected')
      setIsOnline(true)
      showSuccess('Back online!')
      if (onRetry) {
        onRetry()
      } else {
        window.location.reload()
      }
    }
    const handleOffline = () => {
      console.log('NetworkErrorPage: offline event detected')
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      console.log('NetworkErrorPage cleanup: removing listeners')
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onRetry])

  const handleRetry = () => {
    console.log('NetworkErrorPage handleRetry called')
    if (navigator.onLine) {
      if (onRetry) {
        onRetry()
      } else {
        window.location.reload()
      }
    } else {
      showError('Still offline. Please check your connection.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 px-4">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <WifiOff className="h-16 w-16 text-gray-400 dark:text-gray-500" />
        </motion.div>

        {/* Heading */}
        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
          No Internet Connection
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please check your connection and try again.
        </p>

        {/* Status indicator */}
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className={isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Retry button */}
        <motion.div
          className="mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NetworkErrorPage