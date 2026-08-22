import { motion } from 'framer-motion'
import { Zap, ShieldCheck, Users, Bell } from 'lucide-react'

export const Highlights = () => {
  const items = [
    {
      icon: Zap,
      title: 'Real-Time',
      subtitle: 'Instant message delivery',
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      icon: ShieldCheck,
      title: 'Secure',
      subtitle: 'Authentication & encryption',
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      icon: Users,
      title: 'Group Chat',
      subtitle: 'Connect with multiple people',
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Stay updated instantly',
      color: 'text-purple-500 bg-purple-500/10',
    },
  ]

  return (
    <section className="py-10 border-y border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 backdrop-blur-sm"
              >
                <div className={`p-2.5 rounded-lg ${item.color} flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.subtitle}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Highlights
