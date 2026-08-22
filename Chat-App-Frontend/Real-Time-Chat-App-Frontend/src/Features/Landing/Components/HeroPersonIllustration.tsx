import { motion } from 'framer-motion'
import { MessageCircle, Star } from 'lucide-react'

export const HeroPersonIllustration = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center py-6">
      {/* Curved Outline Accent */}
      <div className="absolute inset-0 rounded-full border border-gray-300 dark:border-gray-700/50 scale-105 pointer-events-none -z-10" />

      {/* Yellow Circular Backdrop Accent */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-amber-400 dark:bg-amber-500/90 shadow-xl -z-10 translate-y-4"
      />

      {/* Hero Person Image */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative z-10 w-full flex justify-center"
      >
        <img
          src="/hero_person.png"
          onError={(e) => {
            // High-quality fallback portrait if local file copy is pending
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
          }}
          alt="Happy user chatting on smartphone"
          className="w-72 sm:w-84 h-auto object-cover drop-shadow-2xl rounded-b-3xl"
        />
      </motion.div>

      {/* Floating Card 1: Jenny Wilson (Top Right) */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.5 },
          x: { duration: 0.5, delay: 0.5 },
          y: { repeat: Infinity, duration: 4, ease: 'easeInOut' },
        }}
        className="absolute top-8 -right-2 sm:-right-8 z-20 max-w-[240px] sm:max-w-[270px] p-3 sm:p-3.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-700/80 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-start gap-2.5">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm">
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
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.7 },
          x: { duration: 0.5, delay: 0.7 },
          y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut' },
        }}
        className="absolute bottom-6 -left-2 sm:-left-8 z-20 max-w-[220px] sm:max-w-[250px] p-3 sm:p-3.5 rounded-2xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-700/80 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-start gap-2.5">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm">
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

      {/* Active Live Indicator Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9, type: 'spring' }}
        className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg"
      >
        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
        Live Chat Active
      </motion.div>
    </div>
  )
}

export default HeroPersonIllustration
