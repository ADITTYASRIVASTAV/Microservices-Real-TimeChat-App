import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SearchX, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
  console.log('NotFoundPage rendered')
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 px-4">
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 404 Text */}
        <motion.h1
          className="text-9xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          404
        </motion.h1>

        {/* Illustration */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-4"
        >
          <SearchX className="h-20 w-20 text-gray-300 dark:text-gray-700" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="mt-6 text-2xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          The page you are looking for doesn&apos;t exist or has been moved.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="mt-8 flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => navigate('/dashboard')}>
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage