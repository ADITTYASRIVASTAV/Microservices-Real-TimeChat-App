import { motion } from 'framer-motion'

interface LoaderProps {
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const Loader = ({ fullScreen = false, size = 'md', text }: LoaderProps) => {
  console.log(`Loader rendered with fullScreen=${fullScreen}, size=${size}, text=${text}`)

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const spinner = (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 ${sizeClasses[size]}`} />
  )

  const content = text ? (
    <div className="flex flex-col items-center gap-3">
      {spinner}
      <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  ) : (
    spinner
  )

  if (fullScreen) {
    console.log('Loader: rendering full screen loader')
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    )
  }

  console.log('Loader: rendering inline loader')
  return (
    <motion.div
      className="flex items-center justify-center py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {content}
    </motion.div>
  )
}

export default Loader