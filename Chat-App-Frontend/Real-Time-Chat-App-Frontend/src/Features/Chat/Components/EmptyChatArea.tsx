import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { useAppSelector } from '@/store/store'
import { selectOnlineUsers } from '@/Features/User/Store/userSlice'

const EmptyChatArea = () => {
  console.log('EmptyChatArea rendered')
  const onlineUsers = useAppSelector(selectOnlineUsers)

  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-4"
      >
        <MessageSquare className="h-20 w-20 text-gray-300 dark:text-gray-700" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
        Welcome to ChatApp
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </p>

      {onlineUsers.length > 0 && (
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          {onlineUsers.length} users online now
        </p>
      )}
    </motion.div>
  )
}

export default EmptyChatArea