import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  fetchChatRoomsThunk,
  selectRooms,
  selectIsLoading,
} from '@/Features/Chat/Store/chatSlice'
import { selectUser } from '@/Features/Auth/Store/authSlice'
import type { ChatRoom } from '@/types'

export const useChatList = () => {
  console.log('useChatList hook called')
  const dispatch = useAppDispatch()
  const rooms = useAppSelector(selectRooms)
  const isLoading = useAppSelector(selectIsLoading)
  const user = useAppSelector(selectUser)

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    console.log('useChatList useEffect: fetching rooms on mount')
    dispatch(fetchChatRoomsThunk())
  }, [dispatch])

  const refreshRooms = useCallback(() => {
    console.log('useChatList.refreshRooms called')
    dispatch(fetchChatRoomsThunk())
  }, [dispatch])

  const filteredRooms = useMemo(() => {
    console.log('useChatList: computing filtered rooms, query:', searchQuery)
    const currentUserEmail = user?.email || ''

    // Determine other user email and filter by search query
    const filtered = rooms.filter((room: ChatRoom) => {
      const otherEmail =
        room.senderEmail === currentUserEmail
          ? room.receiverEmail
          : room.senderEmail
      return otherEmail.toLowerCase().includes(searchQuery.toLowerCase())
    })

    // Sort by lastMessageAt descending (newest first)
    const sorted = filtered.sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
      return timeB - timeA
    })

    console.log('useChatList: filtered rooms count:', sorted.length)
    return sorted
  }, [rooms, searchQuery, user])

  return {
    rooms,
    isLoading,
    searchQuery,
    setSearchQuery,
    filteredRooms,
    refreshRooms,
  }
}