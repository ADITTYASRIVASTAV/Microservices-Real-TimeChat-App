import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import RegisterForm from '@/Features/Auth/Components/RegisterForm'
import { useAuth } from '@/Features/Auth/Hooks/useAuth'
import type { RegisterRequest } from '@/types'

const RegisterPage = () => {
  console.log('RegisterPage rendered')
  const { register, isLoading, error } = useAuth()

  const handleSubmit = (data: RegisterRequest) => {
    console.log('RegisterPage handleSubmit called with data:', data)
    register(data)
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 px-4 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 flex flex-col items-center gap-2"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-blue-500" />
          <span className="text-3xl font-bold text-gray-900 dark:text-white">ChatApp</span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Join us and start chatting</p>
      </motion.div>

      <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
    </motion.div>
  )
}

export default RegisterPage