import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '@/Features/Auth/Hooks/useAuth'
import { validateEmail } from '@/shared/utils/validationUtils'
import { ROUTES } from '@/shared/utils/constants'

const ForgotPasswordPage = () => {
  console.log('ForgotPasswordPage rendered')
  const { forgotPassword, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('ForgotPasswordPage handleSubmit called with email:', email)
    const validationError = validateEmail(email)
    if (validationError) {
      setEmailError(validationError)
      return
    }
    setEmailError(null)
    forgotPassword(email)
    setIsSubmitted(true)
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 px-4 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email to reset password
            </p>
          </CardHeader>
          <CardContent>
            {isSubmitted && !error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-6"
              >
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  Reset link sent to {email}
                </p>
                <Link
                  to={ROUTES.LOGIN}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Back to Login
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-red-500"
                    >
                      {emailError}
                    </motion.p>
                  )}
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to={ROUTES.LOGIN}
                    className="flex items-center justify-center text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default ForgotPasswordPage