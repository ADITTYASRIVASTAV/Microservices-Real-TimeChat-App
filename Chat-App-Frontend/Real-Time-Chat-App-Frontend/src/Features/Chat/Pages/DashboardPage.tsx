import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/shared/components/ui/Navbar'
import Sidebar from '@/shared/components/ui/Sidebar'
import Loader from '@/shared/components/Loader'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { selectSidebarOpen } from '@/store/uiSlice'
import { getMyProfileApi } from '@/Features/User/Api/userApi'
import {
  setProfile,
  markOnlineThunk,
  markOfflineThunk,
} from '@/Features/User/Store/userSlice'
import { setRooms } from '@/Features/Chat/Store/chatSlice'
import { setGroups } from '@/Features/Groups/Store/groupSlice'
import { setUnreadCount } from '@/Features/Notifications/Store/notificationSlice'
import apiClient from '@/shared/api/axiosConfig'
import { CHAT_ENDPOINTS, GROUP_ENDPOINTS, NOTIFICATION_ENDPOINTS } from '@/shared/utils/constants'

const DashboardPage = () => {
  console.log('DashboardPage component rendered')

  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector(selectSidebarOpen)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    console.log('DashboardPage useEffect: initializing dashboard data')

    const initialize = async () => {
      try {
        console.log('DashboardPage: fetching all initial dashboard data in parallel')
        
        const [profileRes, roomsRes, groupsRes, unreadRes] = await Promise.allSettled([
          getMyProfileApi(),
          apiClient.get(CHAT_ENDPOINTS.ROOMS),
          apiClient.get(GROUP_ENDPOINTS.MY_GROUPS),
          apiClient.get(NOTIFICATION_ENDPOINTS.UNREAD_COUNT),
        ])

        if (profileRes.status === 'fulfilled') {
          dispatch(setProfile(profileRes.value))
        }
        if (roomsRes.status === 'fulfilled') {
          dispatch(setRooms(roomsRes.value.data))
        }
        if (groupsRes.status === 'fulfilled') {
          dispatch(setGroups(groupsRes.value.data))
        }
        if (unreadRes.status === 'fulfilled') {
          dispatch(setUnreadCount(unreadRes.value.data.count))
        }

        // Mark user online asynchronously without blocking render
        dispatch(markOnlineThunk())
      } catch (error) {
        console.error('DashboardPage initialization error:', error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    initialize()

    // Mark offline on page close/refresh
    const handleBeforeUnload = () => {
      console.log('DashboardPage: beforeunload event, marking offline')
      dispatch(markOfflineThunk()).catch((error) => {
        console.error('DashboardPage: error marking offline on unload', error)
      })
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup on unmount
    return () => {
      console.log('DashboardPage cleanup: marking offline')
      dispatch(markOfflineThunk()).catch((error) => {
        console.error('DashboardPage: error marking offline on unmount', error)
      })
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [dispatch])

  if (isInitialLoading) {
    console.log('DashboardPage: showing initial Loader')
    return <Loader fullScreen />
  }

  console.log('DashboardPage: rendering main layout')
  return (
    <motion.div
      className="flex h-screen flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div
          className={`${sidebarOpen ? 'block' : 'hidden'} h-full w-full md:block md:w-80 md:flex-shrink-0`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Sidebar />
        </motion.div>

        {/* Main Chat Area */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </motion.div>
  )
}

export default DashboardPage
