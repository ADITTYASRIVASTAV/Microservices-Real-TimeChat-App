import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type {
  UserState,
  UserProfile,
  PresenceResponse,
  CreateProfileRequest,
  UpdateProfileRequest,
  UserStatus,
  BulkPresenceResponse,
} from '@/types'
import {
  getMyProfileApi,
  getUserByIdApi,
  createProfileApi,
  updateProfileApi,
  deleteProfileApi,
  getOnlineUsersApi,
  markOnlineApi,
  markOfflineApi,
  updateStatusApi,
  getPresenceApi,
  getBulkPresenceApi,
} from '@/Features/User/Api/userApi'
import type { RootState } from '@/store/store'

const initialState: UserState = {
  profile: null,
  onlineUsers: [],
  presenceMap: {},
  isLoading: false,
  error: null,
  isUpdating: false,
  updateError: null,
}

export const fetchMyProfileThunk = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  'user/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await getMyProfileApi()
      return profile
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to fetch profile')
    }
  }
)

export const fetchUserByIdThunk = createAsyncThunk<UserProfile, number, { rejectValue: string }>(
  'user/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const profile = await getUserByIdApi(id)
      return profile
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to fetch user')
    }
  }
)

export const createProfileThunk = createAsyncThunk<UserProfile, CreateProfileRequest, { rejectValue: string }>(
  'user/createProfile',
  async (data, { rejectWithValue }) => {
    try {
      const profile = await createProfileApi(data)
      return profile
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to create profile')
    }
  }
)

export const updateProfileThunk = createAsyncThunk<UserProfile, UpdateProfileRequest, { rejectValue: string }>(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const updatedProfile = await updateProfileApi(data)
      return updatedProfile
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to update profile')
    }
  }
)

export const deleteProfileThunk = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      await deleteProfileApi()
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to delete account')
    }
  }
)

export const markOnlineThunk = createAsyncThunk<PresenceResponse, void, { rejectValue: string }>(
  'user/markOnline',
  async (_, { rejectWithValue }) => {
    try {
      const presence = await markOnlineApi()
      return presence
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to mark online')
    }
  }
)

export const markOfflineThunk = createAsyncThunk<PresenceResponse, void, { rejectValue: string }>(
  'user/markOffline',
  async (_, { rejectWithValue }) => {
    try {
      const presence = await markOfflineApi()
      return presence
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to mark offline')
    }
  }
)

export const updateStatusThunk = createAsyncThunk<PresenceResponse, UserStatus, { rejectValue: string }>(
  'user/updateStatus',
  async (status, { rejectWithValue }) => {
    try {
      const presence = await updateStatusApi(status)
      return presence
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to update status')
    }
  }
)

export const fetchOnlineUsersThunk = createAsyncThunk<UserProfile[], void, { rejectValue: string }>(
  'user/fetchOnlineUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await getOnlineUsersApi()
      return users
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to fetch online users')
    }
  }
)

export const fetchPresenceThunk = createAsyncThunk<PresenceResponse, string, { rejectValue: string }>(
  'user/fetchPresence',
  async (email, { rejectWithValue }) => {
    try {
      const presence = await getPresenceApi(email)
      return presence
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to fetch presence')
    }
  }
)

export const fetchBulkPresenceThunk = createAsyncThunk<BulkPresenceResponse, string[], { rejectValue: string }>(
  'user/fetchBulkPresence',
  async (emails, { rejectWithValue }) => {
    try {
      const response = await getBulkPresenceApi(emails)
      return response
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Failed to fetch bulk presence')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    clearProfile: (state) => {
      state.profile = null
      state.onlineUsers = []
      state.presenceMap = {}
    },
    setOnlineUsers: (state, action: PayloadAction<PresenceResponse[]>) => {
      state.onlineUsers = action.payload
    },
    updatePresence: (state, action: PayloadAction<PresenceResponse>) => {
      const index = state.onlineUsers.findIndex(
        (p) => p.userEmail === action.payload.userEmail
      )
      if (index !== -1) {
        state.onlineUsers[index] = action.payload
      } else {
        state.onlineUsers.push(action.payload)
      }
      state.presenceMap[action.payload.userEmail] = action.payload
    },
    setPresenceMap: (state, action: PayloadAction<Record<string, PresenceResponse>>) => {
      state.presenceMap = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload
    },
    setUpdateError: (state, action: PayloadAction<string | null>) => {
      state.updateError = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfileThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(fetchMyProfileThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch profile'
      })

    builder
      .addCase(fetchUserByIdThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(fetchUserByIdThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch user'
      })

    builder
      .addCase(createProfileThunk.pending, (state) => {
        state.isUpdating = true
        state.updateError = null
      })
      .addCase(createProfileThunk.fulfilled, (state, action) => {
        state.isUpdating = false
        state.profile = action.payload
      })
      .addCase(createProfileThunk.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload ?? 'Failed to create profile'
      })

    builder
      .addCase(updateProfileThunk.pending, (state) => {
        state.isUpdating = true
        state.updateError = null
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.isUpdating = false
        state.profile = action.payload
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload ?? 'Failed to update profile'
      })

    builder
      .addCase(deleteProfileThunk.pending, (state) => {
        state.isUpdating = true
        state.updateError = null
      })
      .addCase(deleteProfileThunk.fulfilled, (state) => {
        state.isUpdating = false
        state.profile = null
        state.onlineUsers = []
        state.presenceMap = {}
      })
      .addCase(deleteProfileThunk.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload ?? 'Failed to delete account'
      })

    builder
      .addCase(markOnlineThunk.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(markOnlineThunk.fulfilled, (state, action) => {
        state.isUpdating = false
        state.presenceMap[action.payload.userEmail] = action.payload
        const index = state.onlineUsers.findIndex((p) => p.userEmail === action.payload.userEmail)
        if (index !== -1) {
          state.onlineUsers[index] = action.payload
        } else {
          state.onlineUsers.push(action.payload)
        }
      })
      .addCase(markOnlineThunk.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload ?? 'Failed to mark online'
      })

    builder
      .addCase(markOfflineThunk.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(markOfflineThunk.fulfilled, (state, action) => {
        state.isUpdating = false
        state.presenceMap[action.payload.userEmail] = action.payload
        const index = state.onlineUsers.findIndex((p) => p.userEmail === action.payload.userEmail)
        if (index !== -1) {
          state.onlineUsers[index] = action.payload
        } else {
          state.onlineUsers.push(action.payload)
        }
      })
      .addCase(markOfflineThunk.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload ?? 'Failed to mark offline'
      })

    builder
      .addCase(updateStatusThunk.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(updateStatusThunk.fulfilled, (state, action) => {
        state.isUpdating = false
        state.presenceMap[action.payload.userEmail] = action.payload
        const index = state.onlineUsers.findIndex((p) => p.userEmail === action.payload.userEmail)
        if (index !== -1) {
          state.onlineUsers[index] = action.payload
        } else {
          state.onlineUsers.push(action.payload)
        }
      })
      .addCase(updateStatusThunk.rejected, (state, action) => {
        state.isUpdating = false
        state.updateError = action.payload ?? 'Failed to update status'
      })

    builder
      .addCase(fetchOnlineUsersThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOnlineUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false
        const presenceList: PresenceResponse[] = action.payload.map((user) => ({
          userEmail: user.email,
          status: user.status || 'ONLINE',
          lastSeen: user.updatedAt,
          updatedAt: new Date().toISOString(),
        }))
        state.onlineUsers = presenceList
      })
      .addCase(fetchOnlineUsersThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch online users'
      })

    builder
      .addCase(fetchPresenceThunk.pending, () => {})
      .addCase(fetchPresenceThunk.fulfilled, (state, action) => {
        state.presenceMap[action.payload.userEmail] = action.payload
        const index = state.onlineUsers.findIndex((p) => p.userEmail === action.payload.userEmail)
        if (index !== -1) {
          state.onlineUsers[index] = action.payload
        } else {
          state.onlineUsers.push(action.payload)
        }
      })
      .addCase(fetchPresenceThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to fetch presence'
      })

    builder
      .addCase(fetchBulkPresenceThunk.pending, () => {})
      .addCase(fetchBulkPresenceThunk.fulfilled, (state, action) => {
        state.presenceMap = { ...state.presenceMap, ...action.payload.presenceMap }
        const presenceList = Object.values(action.payload.presenceMap)
        presenceList.forEach((presence) => {
          const index = state.onlineUsers.findIndex((p) => p.userEmail === presence.userEmail)
          if (index !== -1) {
            state.onlineUsers[index] = presence
          } else {
            state.onlineUsers.push(presence)
          }
        })
      })
      .addCase(fetchBulkPresenceThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to fetch bulk presence'
      })
  },
})

export const {
  setProfile,
  updateProfile,
  clearProfile,
  setOnlineUsers,
  updatePresence,
  setPresenceMap,
  setLoading,
  setError,
  setUpdating,
  setUpdateError,
} = userSlice.actions

export const selectProfile = (state: RootState): UserProfile | null => state.user.profile
export const selectOnlineUsers = (state: RootState): PresenceResponse[] => state.user.onlineUsers
export const selectPresenceMap = (state: RootState): Record<string, PresenceResponse> => state.user.presenceMap
export const selectIsLoading = (state: RootState): boolean => state.user.isLoading
export const selectIsUpdating = (state: RootState): boolean => state.user.isUpdating
export const selectError = (state: RootState): string | null => state.user.error
export const selectUserPresence =
  (email: string) =>
  (state: RootState): PresenceResponse | undefined =>
    state.user.presenceMap[email]

export default userSlice.reducer
