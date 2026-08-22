import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  registerThunk,
  loginThunk,
  verifyOtpThunk,
  resendOtpThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
  logoutThunk,
  selectUser,
  selectToken,
  selectIsLoggedIn,
  selectIsLoading,
  selectError,
  selectIsOtpSent,
  selectOtpEmail,
} from '@/Features/Auth/Store/authSlice'
import { showSuccess, showError } from '@/shared/components/Toast'
import { ROUTES } from '@/shared/utils/constants'
import { getGoogleLoginUrl } from '@/Features/Auth/Api/authApi'
import type {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types'

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'string' && error.trim() !== '') return error
  if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
    return (error as { message: string }).message
  }
  return fallback
}

export const useAuth = () => {
  console.log('useAuth hook called')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const user = useAppSelector(selectUser)
  const token = useAppSelector(selectToken)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const isLoading = useAppSelector(selectIsLoading)
  const error = useAppSelector(selectError)
  const isOtpSent = useAppSelector(selectIsOtpSent)
  const otpEmail = useAppSelector(selectOtpEmail)

  const register = useCallback(
    async (data: RegisterRequest) => {
      console.log('useAuth.register called with data:', data)
      try {
        await dispatch(registerThunk(data)).unwrap()
        showSuccess('OTP sent to email!')
        navigate(ROUTES.VERIFY_OTP)
      } catch (error: unknown) {
        const message = getErrorMessage(error, 'Registration failed')
        showError(message)
      }
    },
    [dispatch, navigate]
  )

  const login = useCallback(
    async (data: LoginRequest) => {
      console.log('useAuth.login called with data:', data)
      try {
        await dispatch(loginThunk(data)).unwrap()
        showSuccess('Welcome back!')
        navigate(ROUTES.DASHBOARD)
      } catch (error: unknown) {
        const message = getErrorMessage(error, 'Login failed')
        showError(message)
      }
    },
    [dispatch, navigate]
  )

  const verifyOtp = useCallback(
    async (data: VerifyOtpRequest) => {
      console.log('useAuth.verifyOtp called with data:', data)
      try {
        await dispatch(verifyOtpThunk(data)).unwrap()
        showSuccess('Email verified!')
        navigate(ROUTES.DASHBOARD)
      } catch (error: unknown) {
        const message = getErrorMessage(error, 'OTP verification failed')
        showError(message)
      }
    },
    [dispatch, navigate]
  )

  const resendOtp = useCallback(
    async (email: string, otpType: string) => {
      console.log('useAuth.resendOtp called with email:', email, 'otpType:', otpType)
      const data: ResendOtpRequest = { email, otpType }
      try {
        await dispatch(resendOtpThunk(data)).unwrap()
        showSuccess('OTP resent!')
      } catch (error: unknown) {
        const message = getErrorMessage(error, 'Failed to resend OTP')
        showError(message)
      }
    },
    [dispatch]
  )

  const forgotPassword = useCallback(
    async (email: string) => {
      console.log('useAuth.forgotPassword called with email:', email)
      const data: ForgotPasswordRequest = { email }
      try {
        await dispatch(forgotPasswordThunk(data)).unwrap()
        showSuccess('Reset link sent!')
      } catch (error: unknown) {
        const message = getErrorMessage(error, 'Failed to send reset link')
        showError(message)
      }
    },
    [dispatch]
  )

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest) => {
      console.log('useAuth.resetPassword called with data:', data)
      try {
        await dispatch(resetPasswordThunk(data)).unwrap()
        showSuccess('Password reset!')
        navigate(ROUTES.LOGIN)
      } catch (error: unknown) {
        const message = getErrorMessage(error, 'Failed to reset password')
        showError(message)
      }
    },
    [dispatch, navigate]
  )

  const logout = useCallback(async () => {
    console.log('useAuth.logout called')
    try {
      await dispatch(logoutThunk()).unwrap()
      showSuccess('Logged out!')
      navigate(ROUTES.LOGIN)
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Logout failed')
      showError(message)
    }
  }, [dispatch, navigate])

  const loginWithGoogle = useCallback(() => {
    console.log('useAuth.loginWithGoogle called')
    window.location.href = getGoogleLoginUrl()
  }, [])

  return {
    user,
    token,
    isLoggedIn,
    isLoading,
    error,
    isOtpSent,
    otpEmail,
    register,
    login,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
    loginWithGoogle,
  }
}