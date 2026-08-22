import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  fetchMyGroupsThunk,
  createGroupThunk,
  updateGroupThunk,
  deleteGroupThunk,
  addMembersThunk,
  removeMemberThunk,
  leaveGroupThunk,
  searchGroupsThunk,
  selectGroups,
  selectIsLoading,
  selectIsCreating,
  selectIsUpdating,
  selectIsDeleting,
  selectSearchResults,
  selectIsSearching,
  selectActiveGroup,
} from '@/Features/Groups/Store/groupSlice'
import { selectUser } from '@/Features/Auth/Store/authSlice'
import { showSuccess, showError } from '@/shared/components/Toast'
import { ROUTES } from '@/shared/utils/constants'
import { GroupRole, type GroupRequest } from '@/types'

export const useGroupManagement = () => {
  console.log('useGroupManagement hook called')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const groups = useAppSelector(selectGroups)
  const isLoading = useAppSelector(selectIsLoading)
  const isCreating = useAppSelector(selectIsCreating)
  const isUpdating = useAppSelector(selectIsUpdating)
  const isDeleting = useAppSelector(selectIsDeleting)
  const searchResults = useAppSelector(selectSearchResults)
  const isSearching = useAppSelector(selectIsSearching)
  const activeGroup = useAppSelector(selectActiveGroup)
  const currentUser = useAppSelector(selectUser)

  const fetchMyGroups = useCallback(async (): Promise<void> => {
    console.log('useGroupManagement.fetchMyGroups called')
    try {
      await dispatch(fetchMyGroupsThunk()).unwrap()
      console.log('useGroupManagement.fetchMyGroups success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch groups'
      showError(message)
    }
  }, [dispatch])

  const createGroup = useCallback(
    async (data: GroupRequest): Promise<void> => {
      console.log('useGroupManagement.createGroup called with data:', data)
      try {
        const group = await dispatch(createGroupThunk(data)).unwrap()
        showSuccess('Group created!')
        console.log('useGroupManagement.createGroup success:', group)
        navigate(`${ROUTES.GROUP}/${group.id}`)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create group'
        showError(message)
      }
    },
    [dispatch, navigate]
  )

  const updateGroup = useCallback(
    async (id: number, data: Partial<GroupRequest>): Promise<void> => {
      console.log('useGroupManagement.updateGroup called with id:', id, 'data:', data)
      try {
        await dispatch(updateGroupThunk({ id, data })).unwrap()
        showSuccess('Group updated!')
        console.log('useGroupManagement.updateGroup success')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update group'
        showError(message)
      }
    },
    [dispatch]
  )

  const deleteGroup = useCallback(
    async (id: number): Promise<void> => {
      console.log('useGroupManagement.deleteGroup called with id:', id)
      const confirmed = window.confirm('Are you sure you want to delete this group? This action cannot be undone.')
      if (!confirmed) return
      try {
        await dispatch(deleteGroupThunk(id)).unwrap()
        showSuccess('Group deleted!')
        console.log('useGroupManagement.deleteGroup success')
        navigate(ROUTES.DASHBOARD)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to delete group'
        showError(message)
      }
    },
    [dispatch, navigate]
  )

  const addMembers = useCallback(
    async (id: number, emails: string[]): Promise<void> => {
      console.log('useGroupManagement.addMembers called with id:', id, 'emails:', emails)
      try {
        await dispatch(addMembersThunk({ id, memberEmails: emails })).unwrap()
        showSuccess('Members added!')
        console.log('useGroupManagement.addMembers success')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to add members'
        showError(message)
      }
    },
    [dispatch]
  )

  const removeMember = useCallback(
    async (id: number, email: string): Promise<void> => {
      console.log('useGroupManagement.removeMember called with id:', id, 'email:', email)
      const confirmed = window.confirm(`Remove ${email} from group?`)
      if (!confirmed) return
      try {
        await dispatch(removeMemberThunk({ id, email })).unwrap()
        showSuccess('Member removed!')
        console.log('useGroupManagement.removeMember success')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to remove member'
        showError(message)
      }
    },
    [dispatch]
  )

  const leaveGroup = useCallback(
    async (id: number): Promise<void> => {
      console.log('useGroupManagement.leaveGroup called with id:', id)
      const confirmed = window.confirm('Are you sure you want to leave this group?')
      if (!confirmed) return
      try {
        await dispatch(leaveGroupThunk(id)).unwrap()
        showSuccess('Left group!')
        console.log('useGroupManagement.leaveGroup success')
        navigate(ROUTES.DASHBOARD)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to leave group'
        showError(message)
      }
    },
    [dispatch, navigate]
  )

  const searchGroups = useCallback(
    (name: string): void => {
      console.log('useGroupManagement.searchGroups called with name:', name)
      if (name.trim()) {
        dispatch(searchGroupsThunk(name))
      }
    },
    [dispatch]
  )

  const isAdmin = useCallback(
    (email: string): boolean => {
      if (!activeGroup) return false
      const member = activeGroup.members.find((m) => m.userEmail === email)
      return member?.role === GroupRole.ADMIN
    },
    [activeGroup]
  )

  useEffect(() => {
    console.log('useGroupManagement useEffect: fetching my groups on mount')
    if (groups.length === 0 && !isLoading) {
      dispatch(fetchMyGroupsThunk())
    }
  }, [groups.length, isLoading])

  return {
    groups,
    currentUser,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    searchResults,
    isSearching,
    createGroup,
    updateGroup,
    deleteGroup,
    addMembers,
    removeMember,
    leaveGroup,
    searchGroups,
    fetchMyGroups,
    isAdmin,
    activeGroup,
  }
}
