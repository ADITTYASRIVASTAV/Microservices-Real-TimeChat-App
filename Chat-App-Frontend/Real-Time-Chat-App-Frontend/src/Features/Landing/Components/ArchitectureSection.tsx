import { motion } from 'framer-motion'
import { Server, Cpu, Database, Bell, Shield, ArrowDown, ArrowRight } from 'lucide-react'

export const ArchitectureSection = () => {
  return (
    <section id="architecture" className="py-24 bg-slate-50/50 dark:bg-gray-900/40 border-y border-gray-200/80 dark:border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Cpu className="h-3.5 w-3.5" />
            Event-Driven Microservices
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Built for real-time communication.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            A scalable event-driven architecture designed for high availability and reliable messaging.
          </p>
        </div>

        {/* Architecture Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto p-6 md:p-10 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl space-y-8"
        >
          {/* Top Node: React Frontend */}
          <div className="flex justify-center">
            <div className="px-6 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center gap-3 shadow-md">
              <Cpu className="h-5 w-5" />
              <span>React 19 + Vite Frontend</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-blue-500 animate-bounce" />
          </div>

          {/* API Gateway */}
          <div className="flex justify-center">
            <div className="px-6 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-sm flex items-center gap-2 shadow-sm">
              <Server className="h-4 w-4" />
              <span>Spring Cloud API Gateway</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-indigo-500" />
          </div>

          {/* Microservices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center space-y-2">
              <Shield className="h-5 w-5 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Auth Service</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">JWT & OAuth2 SSO</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center space-y-2">
              <Database className="h-5 w-5 text-blue-500 mx-auto" />
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">User Service</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Profile & Presence</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center space-y-2">
              <Server className="h-5 w-5 text-purple-500 mx-auto" />
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Chat & Group Service</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">STOMP WebSockets</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-purple-500" />
          </div>

          {/* Kafka Event Bus */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 text-center space-y-1">
            <h4 className="text-sm font-extrabold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
              <Cpu className="h-4 w-4" />
              Apache Kafka Event Bus
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Asynchronous Message Queue & Event Streaming</p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-amber-500" />
          </div>

          {/* Notification Service */}
          <div className="flex justify-center">
            <div className="px-6 py-3 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold text-sm flex items-center gap-2 shadow-sm">
              <Bell className="h-4 w-4 text-purple-500" />
              <span>Notification Microservice</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ArchitectureSection
