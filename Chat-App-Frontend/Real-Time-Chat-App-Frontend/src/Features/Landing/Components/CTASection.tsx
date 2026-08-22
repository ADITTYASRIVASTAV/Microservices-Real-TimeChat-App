import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ROUTES } from '@/shared/utils/constants'

export const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50/50 to-blue-50/40 dark:from-gray-900/40 dark:to-blue-950/20 border-t border-gray-200/80 dark:border-gray-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6 p-10 md:p-14 rounded-3xl bg-white dark:bg-gray-950 border border-gray-200/80 dark:border-gray-800/80 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            Start Chatting In Seconds
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Ready to start a conversation?
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto font-normal">
            Experience fast, secure and real-time messaging with instant notifications and group channels.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate(ROUTES.REGISTER)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all transform active:scale-95 text-sm"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              Explore Features
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
