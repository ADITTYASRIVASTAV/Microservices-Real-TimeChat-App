import { motion } from 'framer-motion'
import { Send, ShieldCheck, CheckCheck } from 'lucide-react'

export const ChatPreview = () => {
  const messages = [
    { id: 1, sender: 'you', text: 'Hey! Are you free?', time: '10:42 AM' },
    { id: 2, sender: 'rahul', text: 'Yes! What’s up?', time: '10:43 AM' },
    { id: 3, sender: 'you', text: 'I’m working on the new real-time project.', time: '10:43 AM' },
    { id: 4, sender: 'rahul', text: 'Nice! Let me know if you need any help. 🚀', time: '10:44 AM' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="relative rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl shadow-2xl overflow-hidden max-w-xl mx-auto w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-gray-800/80 px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              R
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              Rahul Verma
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
            </h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online</p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50">
          E2EE Active
        </span>
      </div>

      {/* Messages Thread */}
      <div className="p-4 space-y-3 min-h-[260px] bg-slate-50/30 dark:bg-gray-900/30">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.4 }}
            className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm shadow-sm ${
                msg.sender === 'you'
                  ? 'bg-blue-600 text-white rounded-br-xs'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200/60 dark:border-gray-700/60 rounded-bl-xs'
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
              <div
                className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                  msg.sender === 'you' ? 'text-blue-100' : 'text-gray-400'
                }`}
              >
                <span>{msg.time}</span>
                {msg.sender === 'you' && <CheckCheck className="h-3 w-3 text-blue-200" />}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Animated Typing Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.4 }}
          className="flex items-center gap-2 pt-1"
        >
          <div className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/60 shadow-sm flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rahul is typing</span>
            <div className="flex gap-1 items-center">
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                className="h-1.5 w-1.5 rounded-full bg-blue-500"
              />
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                className="h-1.5 w-1.5 rounded-full bg-blue-500"
              />
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                className="h-1.5 w-1.5 rounded-full bg-blue-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Input Mockup */}
      <div className="border-t border-gray-200/80 dark:border-gray-800/80 p-3 bg-white/50 dark:bg-gray-950/50 flex items-center gap-2">
        <input
          type="text"
          readOnly
          value="Sounds great, let's connect!"
          className="flex-1 bg-gray-100 dark:bg-gray-900 border-none rounded-xl px-3.5 py-2 text-xs text-gray-600 dark:text-gray-300 focus:outline-none"
        />
        <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 cursor-pointer">
          <Send className="h-3.5 w-3.5" />
        </div>
      </div>
    </motion.div>
  )
}

export default ChatPreview
