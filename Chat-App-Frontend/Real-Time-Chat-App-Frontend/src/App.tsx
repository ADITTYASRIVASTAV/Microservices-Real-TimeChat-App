import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@/store/store'
import ErrorBoundary from '@/shared/components/ErrorBoundary'
import ProtectedRoute from '@/shared/components/ProtectedRoute'
import PublicRoute from '@/shared/components/PublicRoute'
import Loader from '@/shared/components/Loader'
import Toast from '@/shared/components/Toast'
import NotFoundPage from '@/shared/components/NotFoundPage'
import ErrorPage from '@/shared/components/ErrorPage'
import NetworkErrorPage from '@/shared/components/NetworkErrorPage'
import { ROUTES } from '@/shared/utils/constants'

console.log('App.tsx: importing lazy loaded pages')

const LandingPage = lazy(() => import('@/Features/Landing/Pages/LandingPage'))
const LoginPage = lazy(() => import('@/Features/Auth/Pages/LoginPage'))
const RegisterPage = lazy(() => import('@/Features/Auth/Pages/RegisterPage'))
const OtpVerifyPage = lazy(() => import('@/Features/Auth/Pages/OtpVerifyPage'))
const ForgotPasswordPage = lazy(() => import('@/Features/Auth/Pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/Features/Auth/Pages/ResetPasswordPage'))
const OAuth2CallbackPage = lazy(() => import('@/Features/Auth/Pages/OAuth2CallbackPage'))
const DashboardPage = lazy(() => import('@/Features/Chat/Pages/DashboardPage'))
const ChatPage = lazy(() => import('@/Features/Chat/Pages/ChatPage'))
const GroupChatPage = lazy(() => import('@/Features/Groups/Pages/GroupChatPage'))
const NotificationsPage = lazy(() => import('@/Features/Notifications/Pages/NotificationsPage'))
const ProfilePage = lazy(() => import('@/Features/User/Pages/ProfilePage'))

const App = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline) {
    return <NetworkErrorPage onRetry={() => setIsOnline(navigator.onLine)} />
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<Loader fullScreen />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.VERIFY_OTP} element={<OtpVerifyPage />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
                <Route path={ROUTES.OAUTH2_CALLBACK} element={<OAuth2CallbackPage />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardPage />}>
                  <Route path={ROUTES.DASHBOARD} element={<ChatPage />} />
                  <Route path={ROUTES.CHAT} element={<ChatPage />} />
                  <Route path={ROUTES.CHAT_ROOM} element={<ChatPage />} />
                  <Route path={ROUTES.GROUP} element={<GroupChatPage />} />
                  <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
                  <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                </Route>
              </Route>

              {/* Error page */}
              <Route path="/error" element={<ErrorPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toast />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  )
}

export default App