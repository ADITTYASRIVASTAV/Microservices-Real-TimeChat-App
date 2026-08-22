import { motion } from 'framer-motion'
import { Zap, Users, CheckCheck, Activity, Bell, Shield } from 'lucide-react'

export const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Messaging',
      description: 'Send and receive messages instantly with real-time communication.',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Users,
      title: 'Group Chat',
      description: 'Create group conversations and stay connected with multiple people.',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: CheckCheck,
      title: 'Read Receipts',
      description: 'Know when your messages have been delivered and read.',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Activity,
      title: 'Online Presence',
      description: 'See who’s online and keep track of user activity.',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: Bell,
      title: 'Instant Notifications',
      description: 'Receive real-time notifications for new conversations and messages.',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: Shield,
      title: 'Secure Conversations',
      description: 'Built with secure authentication and protected communication.',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    },
  ]

  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Everything you need to stay connected.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Powerful communication features designed for fast, secure and effortless conversations.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800/80 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl border ${feature.color} mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
