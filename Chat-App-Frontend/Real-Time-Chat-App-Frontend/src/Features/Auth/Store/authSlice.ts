import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type {
  AuthState,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OtpResponse,
  User,
} from '@/types'
import {
  registerApi,
  loginApi,
  verifyOtpApi,
  resendOtpApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '@/Features/Auth/Api/authApi'
import { saveToken, saveUser, clearAll, getUser, getToken, isAuthenticated } from '@/shared/utils/tokenUtils'

const initialState: AuthState = {
  user: getUser(),
  token: getToken(),
  isLoggedIn: isAuthenticated(),
  isLoading: false,
  error: null,
  isOtpSent: false,
  otpEmail: null,
}

// FIXED: OtpResponse -> AuthResponse
export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  console.log('authSlice.registerThunk called with data:', data)
  try {
    const response = await registerApi(data)
    console.log('authSlice.registerThunk success:', response)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('authSlice.registerThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('authSlice.registerThunk unknown error')
    return rejectWithValue('Registration failed')
  }
})

export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>('auth/login', async (data, { rejectWithValue }) => {
  console.log('authSlice.loginThunk called with data:', data)
  try {
    const response = await loginApi(data)
    console.log('authSlice.loginThunk success:', response)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('authSlice.loginThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('authSlice.loginThunk unknown error')
    return rejectWithValue('Login failed')
  }
})

export const verifyOtpThunk = createAsyncThunk<
  AuthResponse,
  VerifyOtpRequest,
  { rejectValue: string }
>('auth/verifyOtp', async (data, { rejectWithValue }) => {
  console.log('authSlice.verifyOtpThunk called with data:', data)
  try {
    const response = await verifyOtpApi(data)
    console.log('authSlice.verifyOtpThunk success:', response)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('authSlice.verifyOtpThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('authSlice.verifyOtpThunk unknown error')
    return rejectWithValue('OTP verification failed')
  }
})

export const resendOtpThunk = createAsyncThunk<
  OtpResponse,
  ResendOtpRequest,
  { rejectValue: string }
>('auth/resendOtp', async (data, { rejectWithValue }) => {
  console.log('authSlice.resendOtpThunk called with data:', data)
  try {
    const response = await resendOtpApi(data)
    console.log('authSlice.resendOtpThunk success:', response)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('authSlice.resendOtpThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('authSlice.resendOtpThunk unknown error')
    return rejectWithValue('Failed to resend OTP')
  }
})

export const forgotPasswordThunk = createAsyncThunk<
  OtpResponse,
  ForgotPasswordRequest,
  { rejectValue: string }
>('auth/forgotPassword', async (data, { rejectWithValue }) => {
  console.log('authSlice.forgotPasswordThunk called with data:', data)
  try {
    const response = await forgotPasswordApi(data)
    console.log('authSlice.forgotPasswordThunk success:', response)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('authSlice.forgotPasswordThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('authSlice.forgotPasswordThunk unknown error')
    return rejectWithValue('Failed to send reset link')
  }
})

export const resetPasswordThunk = createAsyncThunk<
  { message: string; success: boolean },
  ResetPasswordRequest,
  { rejectValue: string }
>('auth/resetPassword', async (data, { rejectWithValue }) => {
  console.log('authSlice.resetPasswordThunk called with data:', data)
  try {
    const response = await resetPasswordApi(data)
    console.log('authSlice.resetPasswordThunk success:', response)
    return response
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('authSlice.resetPasswordThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('authSlice.resetPasswordThunk unknown error')
    return rejectWithValue('Failed to reset password')
  }
})

export const logoutThunk = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { dispatch }) => {
    console.log('authSlice.logoutThunk called')
    try {
      clearAll()
      dispatch(logout())
    } catch (error) {
      console.error('authSlice.logoutThunk error:', error)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      console.log('authSlice.setUser called with:', action.payload)
      state.user = action.payload
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      console.log('authSlice.setToken called with token:', action.payload)
      state.token = action.payload
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      console.log('authSlice.setLoggedIn called with:', action.payload)
      state.isLoggedIn = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('authSlice.setLoading called with:', action.payload)
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      console.log('authSlice.setError called with:', action.payload)
      state.error = action.payload
    },
    setOtpSent: (state, action: PayloadAction<boolean>) => {
      console.log('authSlice.setOtpSent called with:', action.payload)
      state.isOtpSent = action.payload
    },
    setOtpEmail: (state, action: PayloadAction<string | null>) => {
      console.log('authSlice.setOtpEmail called with:', action.payload)
      state.otpEmail = action.payload
    },
    logout: (state) => {
      console.log('authSlice.logout reducer called, resetting state to initial')
      state.user = null
      state.token = null
      state.isLoggedIn = false
      state.isLoading = false
      state.error = null
      state.isOtpSent = false
      state.otpEmail = null
    },
    clearError: (state) => {
      console.log('authSlice.clearError called')
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        console.log('authSlice.registerThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        console.log('authSlice.registerThunk.fulfilled with payload:', action.payload)
        state.isLoading = false
        state.isOtpSent = true
        state.otpEmail = action.payload.email
        state.error = null
      })
      .addCase(registerThunk.rejected, (state, action) => {
        console.log('authSlice.registerThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Registration failed'
      })

    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        console.log('authSlice.loginThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        console.log('authSlice.loginThunk.fulfilled with payload:', action.payload)
        state.isLoading = false
        const tokenValue = action.payload.token || action.payload.accessToken || ''
        const user: User = {
          id: action.payload.userId || 0,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
          isEmailVerified: true,
          isActive: true,
          provider: 'LOCAL',
          createdAt: new Date().toISOString(),
        }
        state.user = user
        state.token = tokenValue
        state.isLoggedIn = true
        state.error = null
        saveToken(tokenValue)
        saveUser(user)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        console.log('authSlice.loginThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Login failed'
      })

    // Verify OTP
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        console.log('authSlice.verifyOtpThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        console.log('authSlice.verifyOtpThunk.fulfilled with payload:', action.payload)
        state.isLoading = false
        const tokenValue = action.payload.token || action.payload.accessToken || ''
        const user: User = {
          id: action.payload.userId || 0,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
          isEmailVerified: true,
          isActive: true,
          provider: 'LOCAL',
          createdAt: new Date().toISOString(),
        }
        state.user = user
        state.token = tokenValue
        state.isLoggedIn = true
        state.isOtpSent = false
        state.otpEmail = null
        state.error = null
        saveToken(tokenValue)
        saveUser(user)
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        console.log('authSlice.verifyOtpThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'OTP verification failed'
      })

    // Resend OTP
    builder
      .addCase(resendOtpThunk.pending, (state) => {
        console.log('authSlice.resendOtpThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(resendOtpThunk.fulfilled, (state) => {
        console.log('authSlice.resendOtpThunk.fulfilled')
        state.isLoading = false
        state.error = null
      })
      .addCase(resendOtpThunk.rejected, (state, action) => {
        console.log('authSlice.resendOtpThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Failed to resend OTP'
      })

    // Forgot Password
    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        console.log('authSlice.forgotPasswordThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        console.log('authSlice.forgotPasswordThunk.fulfilled')
        state.isLoading = false
        state.error = null
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        console.log('authSlice.forgotPasswordThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Failed to send reset link'
      })

    // Reset Password
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        console.log('authSlice.resetPasswordThunk.pending')
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        console.log('authSlice.resetPasswordThunk.fulfilled')
        state.isLoading = false
        state.error = null
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        console.log('authSlice.resetPasswordThunk.rejected with payload:', action.payload)
        state.isLoading = false
        state.error = action.payload ?? 'Failed to reset password'
      })

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      console.log('authSlice.logoutThunk.fulfilled')
      state.user = null
      state.token = null
      state.isLoggedIn = false
      state.isLoading = false
      state.error = null
      state.isOtpSent = false
      state.otpEmail = null
    })
  },
})

export const {
  setUser,
  setToken,
  setLoggedIn,
  setLoading,
  setError,
  setOtpSent,
  setOtpEmail,
  logout,
  clearError,
} = authSlice.actions

import type { RootState } from '@/store/store'

// Selectors
export const selectUser = (state: RootState): User | null => state.auth.user
export const selectToken = (state: RootState): string | null => state.auth.token
export const selectIsLoggedIn = (state: RootState): boolean => state.auth.isLoggedIn
export const selectIsLoading = (state: RootState): boolean => state.auth.isLoading
export const selectError = (state: RootState): string | null => state.auth.error
export const selectIsOtpSent = (state: RootState): boolean => state.auth.isOtpSent
export const selectOtpEmail = (state: RootState): string | null => state.auth.otpEmail

export default authSlice.reducer
