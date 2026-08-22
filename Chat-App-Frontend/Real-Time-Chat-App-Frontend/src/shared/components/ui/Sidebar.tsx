import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { selectRooms, setActiveRoom } from '@/Features/Chat/Store/chatSlice'
import { selectGroups, setActiveGroup } from '@/Features/Groups/Store/groupSlice'
import ChatListItem from './ChatListItem'
import GroupListItem from './GroupListItem'
import SearchBar from './SearchBar'
import { toPrivacyRoomSlug } from '@/shared/utils/privacyUtils'
import CreateGroupModal from '@/Features/Groups/Components/CreateGroupModal'
import type { ChatRoom, Group } from '@/types'

const Sidebar = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const rooms = useAppSelector(selectRooms)
  const groups = useAppSelector(selectGroups)

  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)

  const handleChatClick = (room: ChatRoom) => {
    console.log('Sidebar.handleChatClick called with room:', room)
    dispatch(setActiveRoom(room.roomId))
    const privacySlug = toPrivacyRoomSlug(room.roomId, room.name)
    navigate(`/chat/${privacySlug}`)
  }

  const handleGroupClick = (group: Group) => {
    console.log('Sidebar.handleGroupClick called with group:', group)
    dispatch(setActiveGroup(group))
    navigate(`/groups/${group.id}`)
  }

  const handleNewGroup = () => {
    console.log('Sidebar.handleNewGroup clicked, opening modal')
    setIsCreateGroupOpen(true)
  }

  const filteredRooms = rooms.filter((room: ChatRoom) => {
    const otherEmail = room.senderEmail || room.receiverEmail
    return otherEmail.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const filteredGroups = groups.filter((group: Group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside
      className="flex h-full w-full flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800"
    >
      <div className="p-3 border-b dark:border-gray-800">
        <SearchBar
          placeholder="Search chats and groups..."
          onSearch={(query) => setSearchQuery(query)}
        />
      </div>

      <Tabs defaultValue="chats" className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="mx-3 mt-3 grid w-[calc(100%-24px)] grid-cols-2">
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="flex-1 h-full overflow-y-auto p-2">
          {filteredRooms.length > 0 ? (
            <motion.div
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {filteredRooms.map((room: ChatRoom) => (
                <motion.div
                  key={room.roomId}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <ChatListItem
                    room={room}
                    isActive={false}
                    onClick={() => handleChatClick(room)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-sm font-medium">No chats yet</p>
              <p className="text-xs text-gray-400">Search for users above to start chatting</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="flex-1 h-full overflow-y-auto p-2">
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewGroup}
              className="text-gray-600 dark:text-gray-300"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Group
            </Button>
          </div>
          {filteredGroups.length > 0 ? (
            <motion.div
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05 },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              {filteredGroups.map((group: Group) => (
                <motion.div
                  key={group.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <GroupListItem
                    group={group}
                    isActive={false}
                    onClick={() => handleGroupClick(group)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-sm font-medium">No groups yet</p>
              <button
                onClick={handleNewGroup}
                className="mt-1 text-xs text-blue-500 hover:underline cursor-pointer"
              >
                Create your first group
              </button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
      />
    </aside>
  )
}

export default Sidebar