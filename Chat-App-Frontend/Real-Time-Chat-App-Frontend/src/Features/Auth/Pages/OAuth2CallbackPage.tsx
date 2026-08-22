import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useAppDispatch } from '@/store/store'
import { setToken, setLoggedIn, setUser } from '@/Features/Auth/Store/authSlice'
import { showSuccess, showError } from '@/shared/components/Toast'
import { saveToken, saveUser, getEmailFromToken } from '@/shared/utils/tokenUtils'
import { ROUTES } from '@/shared/utils/constants'

const OAuth2CallbackPage = () => {
  console.log('OAuth2CallbackPage rendered')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log('OAuth2CallbackPage useEffect: processing OAuth2 callback')
    const token = searchParams.get('token')

    if (!token) {
      console.error('OAuth2CallbackPage: no token found in URL')
      showError('Login failed')
      navigate(ROUTES.LOGIN, { replace: true })
      return
    }

    console.log('OAuth2CallbackPage: token extracted:', token)
    try {
      // Save token to localStorage
      saveToken(token)
      console.log('OAuth2CallbackPage: token saved to localStorage')

      // Get email from token
      const email = getEmailFromToken(token)
      console.log('OAuth2CallbackPage: email extracted from token:', email)

      if (email) {
        const localPart = email.includes('@') ? email.substring(0, email.indexOf('@')) : email
        const user = {
          id: 0,
          name: localPart,
          email: email,
          role: 'USER',
          isEmailVerified: true,
          isActive: true,
          provider: 'GOOGLE',
          createdAt: new Date().toISOString()
        }
        saveUser(user)
        dispatch(setUser(user))
      }

      // Update Redux state
      dispatch(setToken(token))
      dispatch(setLoggedIn(true))
      console.log('OAuth2CallbackPage: Redux state updated (token, user, isLoggedIn)')

      showSuccess('Logged in with Google!')
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (error) {
      console.error('OAuth2CallbackPage: error during OAuth2 processing:', error)
      showError('Login failed')
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [searchParams, navigate, dispatch])

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 px-4 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-600 dark:text-gray-300">Completing login...</p>
      </div>
    </motion.div>
  )
}

export default OAuth2CallbackPage