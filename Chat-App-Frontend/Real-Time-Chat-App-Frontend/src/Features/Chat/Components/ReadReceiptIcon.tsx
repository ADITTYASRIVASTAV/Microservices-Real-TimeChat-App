import { motion } from 'framer-motion'
import { Check, CheckCheck } from 'lucide-react'
import type { MessageStatus } from '@/types'

interface ReadReceiptIconProps {
  status: MessageStatus
  size?: number
}

const ReadReceiptIcon = ({ status, size = 12 }: ReadReceiptIconProps) => {
  console.log('ReadReceiptIcon rendered with status:', status)

  // Single Gray Tick for SENT
  if (status === 'SENT') {
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center ml-1"
      >
        <Check size={size} className="text-gray-400" />
      </motion.span>
    )
  }

  // Double Gray Tick for DELIVERED
  if (status === 'DELIVERED') {
    return (
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center ml-1"
      >
        <CheckCheck size={size} className="text-gray-400" />
      </motion.span>
    )
  }

  // Double Blue Tick for READ
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="inline-flex items-center ml-1"
    >
      <CheckCheck size={size} className="text-blue-400" />
    </motion.span>
  )
}

export default ReadReceiptIcon
