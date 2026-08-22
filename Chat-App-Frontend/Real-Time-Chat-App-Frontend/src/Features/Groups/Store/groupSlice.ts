import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type {
  GroupState,
  Group,
  GroupRequest,
  GroupMessage,
  GroupMessageRequest,
} from '@/types'
import {
  createGroupApi,
  getGroupByIdApi,
  updateGroupApi,
  deleteGroupApi,
  addMembersApi,
  removeMemberApi,
  leaveGroupApi,
  getMyGroupsApi,
  searchGroupsApi,
  sendGroupMessageApi,
  getGroupMessagesApi,
} from '@/Features/Groups/Api/groupApi'
import type { RootState } from '@/store/store'

const initialState: GroupState = {
  groups: [],
  activeGroup: null,
  groupMessages: [],
  isLoading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  searchResults: [],
  isSearching: false,
}

export const fetchMyGroupsThunk = createAsyncThunk<Group[], void, { rejectValue: string }>(
  'group/fetchMyGroups',
  async (_, { rejectWithValue }) => {
    console.log('groupSlice.fetchMyGroupsThunk called')
    try {
      const groups = await getMyGroupsApi()
      console.log('groupSlice.fetchMyGroupsThunk success:', groups)
      return groups
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('groupSlice.fetchMyGroupsThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('groupSlice.fetchMyGroupsThunk unknown error')
      return rejectWithValue('Failed to fetch groups')
    }
  }
)

export const fetchGroupByIdThunk = createAsyncThunk<Group, number, { rejectValue: string }>(
  'group/fetchGroupById',
  async (id, { rejectWithValue }) => {
    console.log('groupSlice.fetchGroupByIdThunk called with id:', id)
    try {
      const group = await getGroupByIdApi(id)
      console.log('groupSlice.fetchGroupByIdThunk success:', group)
      return group
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('groupSlice.fetchGroupByIdThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('groupSlice.fetchGroupByIdThunk unknown error')
      return rejectWithValue('Failed to fetch group')
    }
  }
)

export const createGroupThunk = createAsyncThunk<Group, GroupRequest, { rejectValue: string }>(
  'group/createGroup',
  async (data, { rejectWithValue }) => {
    console.log('groupSlice.createGroupThunk called with data:', data)
    try {
      const group = await createGroupApi(data)
      console.log('groupSlice.createGroupThunk success:', group)
      return group
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('groupSlice.createGroupThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('groupSlice.createGroupThunk unknown error')
      return rejectWithValue('Failed to create group')
    }
  }
)

export const updateGroupThunk = createAsyncThunk<
  Group,
  { id: number; data: Partial<GroupRequest> },
  { rejectValue: string }
>('group/updateGroup', async ({ id, data }, { rejectWithValue }) => {
  console.log('groupSlice.updateGroupThunk called with id:', id, 'data:', data)
  try {
    const group = await updateGroupApi(id, data)
    console.log('groupSlice.updateGroupThunk success:', group)
    return group
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('groupSlice.updateGroupThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('groupSlice.updateGroupThunk unknown error')
    return rejectWithValue('Failed to update group')
  }
})

export const deleteGroupThunk = createAsyncThunk<number, number, { rejectValue: string }>(
  'group/deleteGroup',
  async (id, { rejectWithValue }) => {
    console.log('groupSlice.deleteGroupThunk called with id:', id)
    try {
      await deleteGroupApi(id)
      console.log('groupSlice.deleteGroupThunk success')
      return id
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('groupSlice.deleteGroupThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('groupSlice.deleteGroupThunk unknown error')
      return rejectWithValue('Failed to delete group')
    }
  }
)

export const addMembersThunk = createAsyncThunk<
  Group,
  { id: number; memberEmails: string[] },
  { rejectValue: string }
>('group/addMembers', async ({ id, memberEmails }, { rejectWithValue }) => {
  console.log('groupSlice.addMembersThunk called with id:', id, 'memberEmails:', memberEmails)
  try {
    const group = await addMembersApi(id, memberEmails)
    console.log('groupSlice.addMembersThunk success:', group)
    return group
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('groupSlice.addMembersThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('groupSlice.addMembersThunk unknown error')
    return rejectWithValue('Failed to add members')
  }
})

export const removeMemberThunk = createAsyncThunk<
  Group,
  { id: number; email: string },
  { rejectValue: string }
>('group/removeMember', async ({ id, email }, { rejectWithValue }) => {
  console.log('groupSlice.removeMemberThunk called with id:', id, 'email:', email)
  try {
    const group = await removeMemberApi(id, email)
    console.log('groupSlice.removeMemberThunk success:', group)
    return group
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('groupSlice.removeMemberThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('groupSlice.removeMemberThunk unknown error')
    return rejectWithValue('Failed to remove member')
  }
})

export const leaveGroupThunk = createAsyncThunk<number, number, { rejectValue: string }>(
  'group/leaveGroup',
  async (id, { rejectWithValue }) => {
    console.log('groupSlice.leaveGroupThunk called with id:', id)
    try {
      await leaveGroupApi(id)
      console.log('groupSlice.leaveGroupThunk success')
      return id
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('groupSlice.leaveGroupThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('groupSlice.leaveGroupThunk unknown error')
      return rejectWithValue('Failed to leave group')
    }
  }
)

export const searchGroupsThunk = createAsyncThunk<Group[], string, { rejectValue: string }>(
  'group/searchGroups',
  async (name, { rejectWithValue }) => {
    console.log('groupSlice.searchGroupsThunk called with name:', name)
    try {
      const results = await searchGroupsApi(name)
      console.log('groupSlice.searchGroupsThunk success:', results)
      return results
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('groupSlice.searchGroupsThunk error:', error.message)
        return rejectWithValue(error.message)
      }
      console.error('groupSlice.searchGroupsThunk unknown error')
      return rejectWithValue('Failed to search groups')
    }
  }
)

export const fetchGroupMessagesThunk = createAsyncThunk<
  GroupMessage[],
  number,
  { rejectValue: string }
>('group/fetchGroupMessages', async (id, { rejectWithValue }) => {
  console.log('groupSlice.fetchGroupMessagesThunk called with id:', id)
  try {
    const messages = await getGroupMessagesApi(id)
    console.log('groupSlice.fetchGroupMessagesThunk success:', messages)
    return messages
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('groupSlice.fetchGroupMessagesThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('groupSlice.fetchGroupMessagesThunk unknown error')
    return rejectWithValue('Failed to fetch group messages')
  }
})

export const sendGroupMessageThunk = createAsyncThunk<
  GroupMessage,
  { id: number; data: GroupMessageRequest },
  { rejectValue: string }
>('group/sendGroupMessage', async ({ id, data }, { rejectWithValue }) => {
  console.log('groupSlice.sendGroupMessageThunk called with id:', id, 'data:', data)
  try {
    const message = await sendGroupMessageApi(id, data)
    console.log('groupSlice.sendGroupMessageThunk success:', message)
    return message
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('groupSlice.sendGroupMessageThunk error:', error.message)
      return rejectWithValue(error.message)
    }
    console.error('groupSlice.sendGroupMessageThunk unknown error')
    return rejectWithValue('Failed to send group message')
  }
})

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      console.log('groupSlice.setGroups called with:', action.payload)
      state.groups = action.payload
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      console.log('groupSlice.addGroup called with:', action.payload)
      const exists = state.groups.some((g) => g.id === action.payload.id)
      if (!exists) {
        state.groups.push(action.payload)
      }
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      console.log('groupSlice.updateGroup called with:', action.payload)
      const index = state.groups.findIndex((g) => g.id === action.payload.id)
      if (index !== -1) {
        state.groups[index] = action.payload
        if (state.activeGroup?.id === action.payload.id) {
          state.activeGroup = action.payload
        }
      } else {
        console.warn('groupSlice.updateGroup: group not found', action.payload.id)
      }
    },
    deleteGroup: (state, action: PayloadAction<number>) => {
      console.log('groupSlice.deleteGroup called with id:', action.payload)
      state.groups = state.groups.filter((g) => g.id !== action.payload)
      if (state.activeGroup?.id === action.payload) {
        state.activeGroup = null
        state.groupMessages = []
      }
    },
    setActiveGroup: (state, action: PayloadAction<Group | null>) => {
      console.log('groupSlice.setActiveGroup called with:', action.payload)
      state.activeGroup = action.payload
    },
    setGroupMessages: (state, action: PayloadAction<GroupMessage[]>) => {
      console.log('groupSlice.setGroupMessages called with:', action.payload)
      state.groupMessages = action.payload
    },
    addGroupMessage: (state, action: PayloadAction<GroupMessage>) => {
      console.log('groupSlice.addGroupMessage called with:', action.payload)
      const exists = state.groupMessages.some((m) => m.id === action.payload.id)
      if (!exists) {
        state.groupMessages.push(action.payload)
      }
    },
    clearGroupChat: (state) => {
      console.log('groupSlice.clearGroupChat called')
      state.groupMessages = []
      state.activeGroup = null
    },
    setSearchResults: (state, action: PayloadAction<Group[]>) => {
      console.log('groupSlice.setSearchResults called with:', action.payload)
      state.searchResults = action.payload
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      console.log('groupSlice.setSearching called with:', action.payload)
      state.isSearching = action.payload
    },
    setCreating: (state, action: PayloadAction<boolean>) => {
      console.log('groupSlice.setCreating called with:', action.payload)
      state.isCreating = action.payload
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      console.log('groupSlice.setUpdating called with:', action.payload)
      state.isUpdating = action.payload
    },
    setDeleting: (state, action: PayloadAction<boolean>) => {
      console.log('groupSlice.setDeleting called with:', action.payload)
      state.isDeleting = action.payload
    },
  },
  extraReducers: (builder) => {
    // fetchMyGroupsThunk
    builder
      .addCase(fetchMyGroupsThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyGroupsThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.groups = action.payload
      })
      .addCase(fetchMyGroupsThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch groups'
      })

    // fetchGroupByIdThunk
    builder
      .addCase(fetchGroupByIdThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchGroupByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.activeGroup = action.payload
      })
      .addCase(fetchGroupByIdThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch group'
      })

    // createGroupThunk
    builder
      .addCase(createGroupThunk.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createGroupThunk.fulfilled, (state, action) => {
        state.isCreating = false
        const exists = state.groups.some((g) => g.id === action.payload.id)
        if (!exists) {
          state.groups.push(action.payload)
        }
        state.activeGroup = action.payload
      })
      .addCase(createGroupThunk.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload ?? 'Failed to create group'
      })

    // updateGroupThunk
    builder
      .addCase(updateGroupThunk.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateGroupThunk.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.groups.findIndex((g) => g.id === action.payload.id)
        if (index !== -1) {
          state.groups[index] = action.payload
        }
        if (state.activeGroup?.id === action.payload.id) {
          state.activeGroup = action.payload
        }
      })
      .addCase(updateGroupThunk.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload ?? 'Failed to update group'
      })

    // deleteGroupThunk
    builder
      .addCase(deleteGroupThunk.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deleteGroupThunk.fulfilled, (state, action) => {
        state.isDeleting = false
        state.groups = state.groups.filter((g) => g.id !== action.payload)
        if (state.activeGroup?.id === action.payload) {
          state.activeGroup = null
          state.groupMessages = []
        }
      })
      .addCase(deleteGroupThunk.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload ?? 'Failed to delete group'
      })

    // addMembersThunk
    builder
      .addCase(addMembersThunk.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(addMembersThunk.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.groups.findIndex((g) => g.id === action.payload.id)
        if (index !== -1) {
          state.groups[index] = action.payload
        }
        if (state.activeGroup?.id === action.payload.id) {
          state.activeGroup = action.payload
        }
      })
      .addCase(addMembersThunk.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload ?? 'Failed to add members'
      })

    // removeMemberThunk
    builder
      .addCase(removeMemberThunk.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(removeMemberThunk.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.groups.findIndex((g) => g.id === action.payload.id)
        if (index !== -1) {
          state.groups[index] = action.payload
        }
        if (state.activeGroup?.id === action.payload.id) {
          state.activeGroup = action.payload
        }
      })
      .addCase(removeMemberThunk.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload ?? 'Failed to remove member'
      })

    // leaveGroupThunk
    builder
      .addCase(leaveGroupThunk.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(leaveGroupThunk.fulfilled, (state, action) => {
        state.isDeleting = false
        state.groups = state.groups.filter((g) => g.id !== action.payload)
        if (state.activeGroup?.id === action.payload) {
          state.activeGroup = null
          state.groupMessages = []
        }
      })
      .addCase(leaveGroupThunk.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload ?? 'Failed to leave group'
      })

    // searchGroupsThunk
    builder
      .addCase(searchGroupsThunk.pending, (state) => {
        state.isSearching = true
        state.error = null
      })
      .addCase(searchGroupsThunk.fulfilled, (state, action) => {
        state.isSearching = false
        state.searchResults = action.payload
      })
      .addCase(searchGroupsThunk.rejected, (state, action) => {
        state.isSearching = false
        state.error = action.payload ?? 'Failed to search groups'
      })

    // fetchGroupMessagesThunk
    builder
      .addCase(fetchGroupMessagesThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchGroupMessagesThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.groupMessages = action.payload
      })
      .addCase(fetchGroupMessagesThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch group messages'
      })

    // sendGroupMessageThunk
    builder
      .addCase(sendGroupMessageThunk.pending, () => {})
      .addCase(sendGroupMessageThunk.fulfilled, (state, action) => {
        const exists = state.groupMessages.some((m) => m.id === action.payload.id)
        if (!exists) {
          state.groupMessages.push(action.payload)
        }
      })
      .addCase(sendGroupMessageThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to send group message'
      })
  },
})

export const {
  setGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  setActiveGroup,
  setGroupMessages,
  addGroupMessage,
  clearGroupChat,
  setSearchResults,
  setSearching,
  setCreating,
  setUpdating,
  setDeleting,
} = groupSlice.actions

// Selectors
export const selectGroups = (state: RootState): Group[] => state.group.groups
export const selectActiveGroup = (state: RootState): Group | null => state.group.activeGroup
export const selectGroupMessages = (state: RootState): GroupMessage[] => state.group.groupMessages
export const selectIsLoading = (state: RootState): boolean => state.group.isLoading
export const selectIsCreating = (state: RootState): boolean => state.group.isCreating
export const selectIsUpdating = (state: RootState): boolean => state.group.isUpdating
export const selectIsDeleting = (state: RootState): boolean => state.group.isDeleting
export const selectSearchResults = (state: RootState): Group[] => state.group.searchResults
export const selectIsSearching = (state: RootState): boolean => state.group.isSearching

export const selectIsAdmin = (groupId: number, email: string) => (state: RootState): boolean => {
  const group = state.group.groups.find((g) => g.id === groupId) || state.group.activeGroup
  if (!group) return false
  const member = group.members?.find((m) => m.userEmail === email)
  return member?.role === 'ADMIN'
}

export default groupSlice.reducer
