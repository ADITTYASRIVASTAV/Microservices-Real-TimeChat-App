import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Trash2, Lock } from 'lucide-react'
import ReadReceiptIcon from '@/Features/Chat/Components/ReadReceiptIcon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatMessageTime } from '@/shared/utils/dateUtils'
import { decryptMessage, getPrivateKey } from '@/shared/utils/e2eeUtils'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
  isSent: boolean
  showAvatar?: boolean
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
}

const MessageBubble = ({
  message,
  isSent,
  showAvatar = false,
  isFirstInGroup = false,
  isLastInGroup = false,
}: MessageBubbleProps) => {
  console.log('MessageBubble rendered for message id:', message.id, 'isSent:', isSent)
  const [decryptedContent, setDecryptedContent] = useState<string>(() => {
    if (isSent && message.localContent) {
      return message.localContent
    }
    return message.content
  })
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    // If sent message has localContent, use it and skip decryption
    if (isSent && message.localContent) {
      setDecryptedContent(message.localContent)
      return
    }

    // For received encrypted messages, decrypt
    if (message.encrypted && !isSent) {
      const privateKey = getPrivateKey()
      if (privateKey) {
        setIsDecrypting(true)
        decryptMessage(message.content, privateKey)
          .then((plain) => {
            setDecryptedContent(plain)
          })
          .catch((error) => {
            console.error('MessageBubble: decryption failed:', error)
            setDecryptedContent('🔒 Could not decrypt')
          })
          .finally(() => setIsDecrypting(false))
      } else {
        setDecryptedContent('🔒 Encrypted Message')
      }
    } else {
      // Plain message or sent without local content (fallback)
      setDecryptedContent(message.content)
    }
  }, [message, isSent])

  const handleCopy = () => {
    console.log('MessageBubble: copy clicked for message:', message.id)
    navigator.clipboard.writeText(decryptedContent)
  }

  const handleDelete = () => {
    console.log('MessageBubble: delete clicked for message:', message.id)
  }

  return (
    <motion.div
      className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'} mb-1`}
      initial={{ opacity: 0, x: isSent ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`flex items-end gap-2 max-w-[70%] ${isSent ? 'flex-row-reverse' : ''}`}>
        {!isSent && showAvatar && isLastInGroup && (
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={undefined} alt="User" />
            <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-xs">
              {message.senderEmail.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={`relative px-4 py-2 text-sm break-words ${
            isFirstInGroup ? 'mt-2' : ''
          } ${
            isSent
              ? 'bg-blue-500 text-white rounded-2xl rounded-br-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-sm'
          }`}
        >
          {isDecrypting ? (
            <div className="flex items-center gap-1">
              <div className="animate-pulse">Decrypting...</div>
            </div>
          ) : (
            <span>{decryptedContent}</span>
          )}

          {message.encrypted && (
            <span className="ml-1 text-xs opacity-60">
              <Lock className="inline h-3 w-3" />
            </span>
          )}

          {hovered && (
            <motion.div
              className={`absolute top-0 ${isSent ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} flex gap-1 p-1`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <button onClick={handleCopy} className="p-1 rounded bg-white dark:bg-gray-700 shadow">
                <Copy className="h-3 w-3 text-gray-600 dark:text-gray-300" />
              </button>
              {isSent && (
                <button onClick={handleDelete} className="p-1 rounded bg-white dark:bg-gray-700 shadow">
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              )}
            </motion.div>
          )}

          <div
            className={`flex items-center justify-end gap-1 mt-1 text-xs ${
              isSent ? 'text-blue-100' : 'text-gray-400'
            }`}
          >
            {formatMessageTime(message.sentAt)}
            {isSent && <ReadReceiptIcon status={message.status} size={12} />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MessageBubble
