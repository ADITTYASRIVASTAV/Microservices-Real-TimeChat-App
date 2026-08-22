import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Paperclip, Smile, Loader2 } from 'lucide-react'

interface MessageInputProps {
  onSend: (content: string) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
}

const MessageInput = ({
  onSend,
  isLoading = false,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageInputProps) => {
  console.log('MessageInput rendered')
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed || disabled || isLoading) return
    console.log('MessageInput.handleSend called with message:', trimmed)
    onSend(trimmed)
    setMessage('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    } else if (e.key === 'Escape') {
      console.log('MessageInput: Escape pressed, clearing input')
      setMessage('')
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      <div className="flex items-end gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          disabled
          title="Attachment (coming soon)"
        >
          <Paperclip className="h-5 w-5" />
        </motion.button>

        <motion.textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[120px] disabled:opacity-50"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          disabled
          title="Emoji (coming soon)"
        >
          <Smile className="h-5 w-5" />
        </motion.button>

        <motion.button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default MessageInput