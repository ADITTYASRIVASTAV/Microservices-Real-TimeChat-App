import apiClient from '@/shared/api/axiosConfig'
import { AUTH_ENDPOINTS, API_BASE_URL } from '@/shared/utils/constants'
import type {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OtpResponse,
  AuthResponse,
  ResetPasswordResponse,
} from '@/types'

export async function registerApi(data: RegisterRequest): Promise<AuthResponse>
 {
  console.log('authApi.registerApi called with data:', data)
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, data)
    console.log('authApi.registerApi response:', response.data)
    return response.data
  } 
  catch (error)
   {
    console.error('authApi.registerApi error:', error)
    throw error
  }
}

export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  console.log('authApi.loginApi called with data:', data)
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, data)
    console.log('authApi.loginApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('authApi.loginApi error:', error)
    throw error
  }
}

export async function verifyOtpApi(data: VerifyOtpRequest): Promise<AuthResponse> {
  console.log('authApi.verifyOtpApi called with data:', data)
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_OTP, data)
    console.log('authApi.verifyOtpApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('authApi.verifyOtpApi error:', error)
    throw error
  }
}

export async function resendOtpApi(data: ResendOtpRequest): Promise<OtpResponse> {
  console.log('authApi.resendOtpApi called with data:', data)
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.RESEND_OTP, data)
    console.log('authApi.resendOtpApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('authApi.resendOtpApi error:', error)
    throw error
  }
}

export async function forgotPasswordApi(
  data: ForgotPasswordRequest
): Promise<OtpResponse> {
  console.log('authApi.forgotPasswordApi called with data:', data)
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data)
    console.log('authApi.forgotPasswordApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('authApi.forgotPasswordApi error:', error)
    throw error
  }
}

export async function resetPasswordApi(
  data: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  console.log('authApi.resetPasswordApi called with data:', data)
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, data)
    console.log('authApi.resetPasswordApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('authApi.resetPasswordApi error:', error)
    throw error
  }
}

export async function validateResetTokenApi(token: string): Promise<boolean> {
  console.log('authApi.validateResetTokenApi called with token:', token)
  try {
    const response = await apiClient.get(AUTH_ENDPOINTS.VALIDATE_RESET_TOKEN, {
      params: { token },
    })
    console.log('authApi.validateResetTokenApi response:', response.data)
    return response.data
  } catch (error) {
    console.error('authApi.validateResetTokenApi error:', error)
    throw error
  }
}

export function getGoogleLoginUrl(): string {
  console.log('authApi.getGoogleLoginUrl called')
  const url = `${API_BASE_URL}${AUTH_ENDPOINTS.GOOGLE_LOGIN}`
  console.log('authApi.getGoogleLoginUrl result:', url)
  return url
}