import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import OtpInput from '@/Features/Auth/Components/OtpInput'
import { useAuth } from '@/Features/Auth/Hooks/useAuth'
import { ROUTES, OTP_TYPES } from '@/shared/utils/constants'
import { validateOtp } from '@/shared/utils/validationUtils'

const OtpVerifyPage = () => {
  console.log('OtpVerifyPage rendered')
  const navigate = useNavigate()
  const { otpEmail, verifyOtp, resendOtp, isLoading, error } = useAuth()
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    console.log('OtpVerifyPage useEffect: checking otpEmail')
    if (!otpEmail) {
      console.log('OtpVerifyPage: no otpEmail, redirecting to register')
      navigate(ROUTES.REGISTER, { replace: true })
    }
  }, [otpEmail, navigate])

  useEffect(() => {
    console.log('OtpVerifyPage useEffect: starting countdown timer')
    if (resendTimer > 0 && !canResend) {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer, canResend])

  const handleVerify = () => {
    console.log('OtpVerifyPage handleVerify called with otp:', otp)
    const validationError = validateOtp(otp)
    if (validationError) {
      setOtpError(validationError)
      return
    }
    setOtpError(null)
    if (otpEmail) {
      verifyOtp({ email: otpEmail, otp })
    }
  }

  const handleResend = () => {
    console.log('OtpVerifyPage handleResend called')
    if (otpEmail && canResend) {
      resendOtp(otpEmail, OTP_TYPES.REGISTRATION)
      setResendTimer(60)
      setCanResend(false)
    }
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
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter 6-digit OTP sent to {otpEmail}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
              error={otpError || error}
            />

            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>

            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={!canResend || isLoading}
                className="text-gray-600 dark:text-gray-400"
              >
                {canResend ? 'Resend OTP' : `Resend OTP (${resendTimer}s)`}
              </Button>
              <Link
                to={ROUTES.REGISTER}
                className="flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to register
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default OtpVerifyPage