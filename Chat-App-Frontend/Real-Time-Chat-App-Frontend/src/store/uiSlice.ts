import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UIState } from '@/types'

const initialState: UIState = {
  isLoading: false,
  toastMessage: null,
  toastType: null,
  activeModal: null,
  sidebarOpen: true
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('uiSlice.setLoading called with:', action.payload)
      state.isLoading = action.payload
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>
    ) => {
      console.log('uiSlice.showToast called with:', action.payload)
      state.toastMessage = action.payload.message
      state.toastType = action.payload.type
    },
    hideToast: (state) => {
      console.log('uiSlice.hideToast called')
      state.toastMessage = null
      state.toastType = null
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      console.log('uiSlice.setActiveModal called with:', action.payload)
      state.activeModal = action.payload
    },
    toggleSidebar: (state) => {
      console.log('uiSlice.toggleSidebar called, current sidebarOpen:', state.sidebarOpen)
      state.sidebarOpen = !state.sidebarOpen
      console.log('uiSlice.toggleSidebar new sidebarOpen:', state.sidebarOpen)
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      console.log('uiSlice.setSidebarOpen called with:', action.payload)
      state.sidebarOpen = action.payload
    }
  }
})

export const {
  setLoading,
  showToast,
  hideToast,
  setActiveModal,
  toggleSidebar,
  setSidebarOpen
} = uiSlice.actions

import type { RootState } from '@/store/store'

export const selectSidebarOpen = (state: RootState): boolean => state.ui.sidebarOpen
export const selectIsLoading = (state: RootState): boolean => state.ui.isLoading
export const selectActiveModal = (state: RootState): string | null => state.ui.activeModal

export default uiSlice.reducer