import { useEffect, useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Loader2, Eye, EyeOff, XCircle } from 'lucide-react'
import { useAuth } from '@/Features/Auth/Hooks/useAuth'
import { validatePassword, validateConfirmPassword } from '@/shared/utils/validationUtils'
import { validateResetTokenApi } from '@/Features/Auth/Api/authApi'
import { ROUTES } from '@/shared/utils/constants'

const ResetPasswordPage = () => {
  console.log('ResetPasswordPage rendered')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { resetPassword, isLoading, error } = useAuth()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    newPassword?: string
    confirmPassword?: string
  }>({})
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenChecking, setTokenChecking] = useState(true)

  useEffect(() => {
    console.log('ResetPasswordPage useEffect: validating token')
    const validateToken = async () => {
      if (!token) {
        console.log('ResetPasswordPage: no token in URL')
        setTokenValid(false)
        setTokenChecking(false)
        return
      }
      try {
        const isValid = await validateResetTokenApi(token)
        console.log('ResetPasswordPage: token validity:', isValid)
        setTokenValid(isValid)
      } catch (error) {
        console.error('ResetPasswordPage: token validation error:', error)
        setTokenValid(false)
      } finally {
        setTokenChecking(false)
      }
    }
    validateToken()
  }, [token])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('ResetPasswordPage handleSubmit called')
    const passwordError = validatePassword(newPassword)
    const confirmError = validateConfirmPassword(newPassword, confirmPassword)

    if (passwordError || confirmError) {
      console.log('ResetPasswordPage validation errors:', { passwordError, confirmError })
      setFieldErrors({
        newPassword: passwordError || undefined,
        confirmPassword: confirmError || undefined,
      })
      return
    }

    setFieldErrors({})
  if (token) {
  resetPassword({
    token,
    password: newPassword,
    confirmPassword,
  })
}
  }

  if (tokenChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (tokenValid === false) {
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
          className="w-full max-w-md"
        >
          <Card className="border-gray-200 dark:border-gray-800">
            <CardContent className="flex flex-col items-center gap-4 py-8">
              <XCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Reset link invalid or expired
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                The password reset link is no longer valid. Please request a new one.
              </p>
              <Button onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}>
                Request new link
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    )
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
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your new password
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-9 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.newPassword && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.newPassword}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-9"
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-red-500"
                  >
                    {fieldErrors.confirmPassword}
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
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <div className="text-center">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default ResetPasswordPage
