import { motion } from 'framer-motion'
import ChatPreview from './ChatPreview'
import { Star } from 'lucide-react'

export const HeroChatIllustration = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto flex items-center justify-center py-4">
      {/* Background Decorative Accent Ring */}
      <div className="absolute inset-0 rounded-3xl border border-blue-500/20 dark:border-blue-400/10 scale-105 pointer-events-none -z-10" />

      {/* Vibrant Background Circle Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl -z-10" />

      {/* Central Chat Application UI Mockup */}
      <div className="relative z-10 w-full">
        <ChatPreview />
      </div>

      {/* Floating Card 1: Jenny Wilson (Top Right) */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.6 },
          x: { duration: 0.5, delay: 0.6 },
          y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
        }}
        className="absolute -top-6 -right-2 sm:-right-8 z-20 max-w-[220px] sm:max-w-[260px] p-3 rounded-2xl bg-white/95 dark:bg-gray-900/95 border border-gray-200/90 dark:border-gray-700/90 shadow-2xl backdrop-blur-md hidden sm:block"
      >
        <div className="flex items-start gap-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            JW
          </div>
          <div className="space-y-0.5 min-w-0">
            <h5 className="text-xs font-bold text-gray-900 dark:text-white truncate">Jenny Wilson</h5>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
              I commented on Figma, I want to add some fancy icons. Do you have any icon set?
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating Card 2: Ronald Richards (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, x: -40, y: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.8 },
          x: { duration: 0.5, delay: 0.8 },
          y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
        }}
        className="absolute -bottom-6 -left-2 sm:-left-8 z-20 max-w-[210px] sm:max-w-[250px] p-3 rounded-2xl bg-white/95 dark:bg-gray-900/95 border border-gray-200/90 dark:border-gray-700/90 shadow-2xl backdrop-blur-md hidden sm:block"
      >
        <div className="flex items-start gap-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            RR
          </div>
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1">
              <h5 className="text-xs font-bold text-gray-900 dark:text-white truncate">Ronald Richards</h5>
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
              One of the best chatting app I have ever used.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default HeroChatIllustration
