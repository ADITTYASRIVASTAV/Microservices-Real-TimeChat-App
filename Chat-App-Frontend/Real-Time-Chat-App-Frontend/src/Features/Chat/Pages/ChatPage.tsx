import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { setActiveRoom, selectRooms } from '@/Features/Chat/Store/chatSlice'
import { selectUser } from '@/Features/Auth/Store/authSlice'
import { getPresenceApi, getUserByEmailApi } from '@/Features/User/Api/userApi'
import ChatWindow from '@/Features/Chat/Components/ChatWindow'
import EmptyChatArea from '@/Features/Chat/Components/EmptyChatArea'
import Loader from '@/shared/components/Loader'
import { toPrivacyRoomSlug } from '@/shared/utils/privacyUtils'
import type { PresenceResponse, UserStatus } from '@/types'

const formatDisplayName = (input?: string | null): string => {
  if (!input) return 'User'
  const lower = input.toLowerCase()
  if (lower.includes('srivastavanurag')) return 'Anurag Srivastava'
  if (lower.includes('rajshrivastav')) return 'Raj Shrivastav'

  const cleanStr = input.includes('@') ? input.split('@')[0] : input
  const nameParts = cleanStr.replace(/[._-]/g, ' ').replace(/\d+/g, '').trim()
  const result = nameParts || cleanStr
  return result.replace(/\b\w/g, (c) => c.toUpperCase())
}
const ChatPage = () => {
  console.log('ChatPage rendered')
  const { roomId } = useParams<{ roomId: string }>()
  const location = useLocation()
  const state = location.state as { receiverEmail?: string; receiverName?: string } | null
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const rooms = useAppSelector(selectRooms)
  const user = useAppSelector(selectUser)

  const [receiverEmail, setReceiverEmail] = useState<string | null>(null)
  const [receiverName, setReceiverName] = useState<string | null>(null)
  const [receiverPresence, setReceiverPresence] = useState<PresenceResponse | null>(null)
  const [isLoadingPresence, setIsLoadingPresence] = useState(false)
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null)

  useEffect(() => {
    console.log('ChatPage useEffect: roomId changed to', roomId, 'state:', state)
    if (roomId) {
      const room = rooms.find((r) => r.roomId === roomId || toPrivacyRoomSlug(r.roomId) === roomId)
      const targetRoomId = room ? room.roomId : roomId
      setActiveRoomId(targetRoomId)
      dispatch(setActiveRoom(targetRoomId))
      if (room && user) {
        const otherEmail =
          room.senderEmail === user.email ? room.receiverEmail : room.senderEmail
        setReceiverEmail(otherEmail)
        setReceiverName(formatDisplayName(room.name || otherEmail))
        console.log('ChatPage: receiverEmail determined from room:', otherEmail)
      } else if (state?.receiverEmail) {
        setReceiverEmail(state.receiverEmail)
        setReceiverName(formatDisplayName(state.receiverName || state.receiverEmail))
        console.log('ChatPage: receiverEmail determined from location state:', state.receiverEmail)
      } else if (user?.email && roomId.includes('_') && !roomId.startsWith('group_')) {
        const parts = roomId.split('_')
        const myNameKey = user.name ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '') : user.email.split('@')[0]
        const otherKey = parts[0].includes(myNameKey.slice(0, 3)) ? parts[1] : parts[0]
        if (otherKey) {
          const rawName = otherKey.replace(/\d+/g, '')
          setReceiverName(formatDisplayName(rawName))
        }
      } else {
        setReceiverEmail(null)
        setReceiverName(null)
        console.warn('ChatPage: room not found and no state/fallback available')
      }
    } else {
      setReceiverEmail(null)
      setReceiverName(null)
    }
  }, [roomId, rooms, user, state, dispatch])

  useEffect(() => {
    if (receiverEmail) {
      setIsLoadingPresence(true)
      getPresenceApi(receiverEmail)
        .then((presence) => {
          setReceiverPresence(presence)
        })
        .catch((error) => {
          console.error('ChatPage: error fetching presence:', error)
          setReceiverPresence(null)
        })
        .finally(() => setIsLoadingPresence(false))

      getUserByEmailApi(receiverEmail)
        .then((profile) => {
          if (profile?.name) {
            setReceiverName(profile.name)
          }
        })
        .catch(() => {
          const formatted = receiverEmail
            .split('@')[0]
            .replace(/[._-]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
          setReceiverName(formatted)
        })
    } else {
      setReceiverPresence(null)
    }
  }, [receiverEmail])

  const handleBack = () => {
    console.log('ChatPage: back button clicked, navigating to /chat')
    navigate('/chat')
  }

  const status: UserStatus = receiverPresence?.status || 'OFFLINE'
  const lastSeen = receiverPresence?.lastSeen

  return (
    <div className="flex h-full flex-col">
      {roomId && receiverEmail ? (
        isLoadingPresence ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <ChatWindow
            roomId={activeRoomId || roomId}
            receiverEmail={receiverEmail}
            receiverName={receiverName || receiverEmail}
            receiverStatus={status}
            receiverLastSeen={lastSeen}
            onBack={handleBack}
          />
        )
      ) : (
        <EmptyChatArea />
      )}
    </div>
  )
}

export default ChatPage
