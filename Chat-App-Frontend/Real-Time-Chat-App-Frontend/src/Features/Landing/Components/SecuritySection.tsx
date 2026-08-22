import { motion } from 'framer-motion'
import { ShieldCheck, Key, Lock, Fingerprint } from 'lucide-react'

export const SecuritySection = () => {
  const capabilities = [
    {
      icon: Key,
      title: 'JWT Authentication',
      description: 'Secure token-based authentication with auto-refresh and expiration handling.',
    },
    {
      icon: Fingerprint,
      title: 'OAuth2 Login',
      description: 'Simple and secure social authentication integrated with Google SSO.',
    },
    {
      icon: ShieldCheck,
      title: 'OTP Verification',
      description: 'Additional step-up verification for account activation and password resets.',
    },
    {
      icon: Lock,
      title: 'Message Encryption',
      description: 'Protect sensitive communication with client-side key generation and encryption.',
    },
  ]

  return (
    <section id="security" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Lock className="h-3.5 w-3.5" />
            Security & Privacy First
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Your conversations. Your privacy.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Security is built into every layer of the platform, from token validation to message encryption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50/70 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800/80 shadow-sm"
              >
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 inline-block mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SecuritySection
