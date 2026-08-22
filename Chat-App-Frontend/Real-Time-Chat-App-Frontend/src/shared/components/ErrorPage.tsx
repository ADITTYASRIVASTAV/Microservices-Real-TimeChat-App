import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  error?: string
  onRetry?: () => void
}

const ErrorPage = ({ error, onRetry }: ErrorPageProps) => {
  console.log('ErrorPage rendered with error:', error)
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)

  const handleRetry = () => {
    console.log('ErrorPage handleRetry called')
    if (onRetry) {
      onRetry()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 px-4">
      <motion.div
        className="flex flex-col items-center text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Alert Icon with shake */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.6 }}
        >
          <AlertTriangle className="h-16 w-16 text-red-400" />
        </motion.div>

        {/* Heading */}
        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
          Something went wrong
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          We encountered an unexpected error. Please try again.
        </p>

        {/* Error details collapsible */}
        {error && (
          <div className="w-full mt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              Error details
            </button>
            {showDetails && (
              <motion.pre
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded-md p-3 overflow-x-auto max-h-40 text-left"
              >
                {error}
              </motion.pre>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ErrorPage