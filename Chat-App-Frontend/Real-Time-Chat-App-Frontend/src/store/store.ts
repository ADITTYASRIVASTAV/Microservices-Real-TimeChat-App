import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import authReducer from '@/Features/Auth/Store/authSlice'
import chatReducer from '@/Features/Chat/Store/chatSlice'
import groupReducer from '@/Features/Groups/Store/groupSlice'
import notificationReducer from '@/Features/Notifications/Store/notificationSlice'
import userReducer from '@/Features/User/Store/userSlice'
import e2eeReducer from '@/Features/E2EE/Store/e2eeSlice'
import uiReducer from './uiSlice'

console.log('store.ts: importing reducers and configuring store')

const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    group: groupReducer,
    notification: notificationReducer,
    user: userReducer,
    e2ee: e2eeReducer,
    ui: uiReducer
  }
})

console.log('store.ts: store configured successfully', store.getState())

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
