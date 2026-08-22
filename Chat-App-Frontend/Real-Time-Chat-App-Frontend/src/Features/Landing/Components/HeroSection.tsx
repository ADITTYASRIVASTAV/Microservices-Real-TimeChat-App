import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Users } from 'lucide-react'
import HeroChatIllustration from './HeroChatIllustration'
import { ROUTES } from '@/shared/utils/constants'

export const HeroSection = () => {
  const navigate = useNavigate()

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold text-blue-600 dark:text-blue-400"
            >
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Real-Time Messaging Platform
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.15]"
            >
              Connect. Chat.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                In Real Time.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Fast, secure and seamless messaging for modern conversations. Designed for instant delivery and group collaboration.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={() => navigate(ROUTES.REGISTER)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all transform active:scale-95"
              >
                Start Chatting
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Explore Features
              </button>
            </motion.div>

            {/* Capability Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-gray-200/60 dark:border-gray-800/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>Real-Time Messaging</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                <Shield className="h-4 w-4 text-indigo-500" />
                <span>Secure Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                <Users className="h-4 w-4 text-purple-500" />
                <span>Group Channels</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Chat Application UI Mockup + Floating User Message Cards */}
          <div className="lg:col-span-6">
            <HeroChatIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
