import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface TypingIndicatorProps {
  userName: string
  isVisible: boolean
}

const TypingIndicator = ({ userName, isVisible }: TypingIndicatorProps) => {
  console.log('TypingIndicator rendered, isVisible:', isVisible)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="flex items-end gap-2 mb-2"
        >
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-xs">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: index * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </div>

          <span className="text-xs text-gray-400 dark:text-gray-500">
            {userName} is typing...
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TypingIndicator