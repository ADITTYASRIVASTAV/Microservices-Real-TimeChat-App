import { motion } from 'framer-motion'
import { Check, CheckCheck, Radio, Sparkles } from 'lucide-react'

export const RealtimeSection = () => {
  const points = [
    'Instant message delivery',
    'Live typing indicators',
    'Online presence tracking',
    'Read receipts & timestamps',
  ]

  return (
    <section id="realtime" className="py-24 bg-slate-50/50 dark:bg-gray-900/40 border-y border-gray-200/80 dark:border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Radio className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
              WebSocket-Powered Speed
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Messages that move at the speed of conversation.
            </h2>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Experience instant communication with real-time messaging, presence updates and live notifications without page refreshes.
            </p>

            <div className="space-y-3 pt-2">
              {points.map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Live Animated Demo Card */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl space-y-6"
            >
              {/* Header Status Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      S
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">Sneha Sharma</h4>
                    <p className="text-xs text-emerald-500 font-medium">Active now</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
                  <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  <span>STOMP / SockJS</span>
                </div>
              </div>

              {/* Message Simulation Flow */}
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-xs text-sm max-w-[80%]">
                    Can you share the updated API specs?
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-br-xs text-sm max-w-[80%] space-y-1">
                    <p>Sure! Sending over the documentation link right now.</p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-blue-100">
                      <span>Just now</span>
                      <CheckCheck className="h-3 w-3 text-blue-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 font-medium">
                <span>Latency: &lt; 50ms</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RealtimeSection
