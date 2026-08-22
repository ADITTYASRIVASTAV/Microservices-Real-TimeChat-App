import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  fetchMyProfileThunk,
  fetchUserByIdThunk,
  updateProfileThunk,
  deleteProfileThunk,
  selectProfile,
  selectIsLoading,
  selectIsUpdating,
  selectError,
} from '@/Features/User/Store/userSlice'
import { showSuccess, showError } from '@/shared/components/Toast'
import { ROUTES } from '@/shared/utils/constants'
import type { UpdateProfileRequest, UserProfile } from '@/types'

export const useProfile = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const profile = useAppSelector(selectProfile)
  const isLoading = useAppSelector(selectIsLoading)
  const isUpdating = useAppSelector(selectIsUpdating)
  const error = useAppSelector(selectError)

  const fetchProfile = useCallback(async (): Promise<void> => {
    console.log('useProfile.fetchProfile called')
    try {
      await dispatch(fetchMyProfileThunk()).unwrap()
      console.log('useProfile.fetchProfile success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile'
      showError(message)
    }
  }, [dispatch])

  const updateProfile = useCallback(
    async (data: UpdateProfileRequest): Promise<void> => {
      console.log('useProfile.updateProfile called with data:', data)
      try {
        await dispatch(updateProfileThunk(data)).unwrap()
        showSuccess('Profile updated!')
        console.log('useProfile.updateProfile success')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update profile'
        showError(message)
      }
    },
    [dispatch]
  )

  const deleteProfile = useCallback(async (): Promise<void> => {
    console.log('useProfile.deleteProfile called')
    try {
      await dispatch(deleteProfileThunk()).unwrap()
      showSuccess('Account deleted')
      navigate(ROUTES.LOGIN)
      console.log('useProfile.deleteProfile success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete account'
      showError(message)
    }
  }, [dispatch, navigate])

  const getUserById = useCallback(
    async (id: number): Promise<UserProfile | null> => {
      console.log('useProfile.getUserById called with id:', id)
      try {
        const result = await dispatch(fetchUserByIdThunk(id)).unwrap()
        console.log('useProfile.getUserById success:', result)
        return result
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch user'
        showError(message)
        return null
      }
    },
    [dispatch]
  )

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    fetchProfile,
    updateProfile,
    deleteProfile,
    getUserById,
  }
}