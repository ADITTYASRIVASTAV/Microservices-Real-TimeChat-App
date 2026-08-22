import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  initializeE2EEThunk,
  fetchPublicKeyThunk,
  fetchBulkPublicKeysThunk,
  rotateKeysThunk,
  encryptMessageThunk,
  decryptMessageThunk,
  selectHasKeys,
  selectIsInitializing,
  selectIsRotating,
  selectKeyVersion,
  selectPublicKeys,
} from '@/Features/E2EE/Store/e2eeSlice'
import { showSuccess, showError, showWarning } from '@/shared/components/Toast'
import type { EncryptedMessage } from '@/types'

export const useE2EE = () => {
  const dispatch = useAppDispatch()
  const hasKeys = useAppSelector(selectHasKeys)
  const isInitializing = useAppSelector(selectIsInitializing)
  const isRotating = useAppSelector(selectIsRotating)
  const keyVersion = useAppSelector(selectKeyVersion)
  const publicKeys = useAppSelector(selectPublicKeys)

  const initializeE2EE = useCallback(
    async (userEmail: string): Promise<void> => {
      console.log('useE2EE.initializeE2EE called with email:', userEmail)
      try {
        const result = await dispatch(initializeE2EEThunk(userEmail)).unwrap()
        if (result.isNewKeys) {
          showWarning('New encryption keys generated. Previous messages may not be readable.')
        } else {
          console.log('useE2EE.initializeE2EE: keys already existed, no warning')
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'E2EE setup failed'
        showError(`${message}. Messages may not be encrypted.`)
      }
    },
    [dispatch]
  )

  const encryptForUser = useCallback(
    async (
      content: string,
      receiverEmail: string
    ): Promise<EncryptedMessage> => {
      console.log(`useE2EE.encryptForUser called for receiver: ${receiverEmail}`)
      try {
        // Check if receiver has public key
        const publicKey = await dispatch(fetchPublicKeyThunk(receiverEmail)).unwrap()
        if (!publicKey) {
          console.warn('useE2EE.encryptForUser: no public key found, sending plain')
          return { content, encrypted: false }
        }

        const encryptedContent = await dispatch(
          encryptMessageThunk({ content, receiverEmail })
        ).unwrap()
        console.log('useE2EE.encryptForUser: encryption successful')
        return { content: encryptedContent, encrypted: true }
      } catch (error) {
        console.error('useE2EE.encryptForUser error:', error)
        // Fallback to plain text
        return { content, encrypted: false }
      }
    },
    [dispatch]
  )

  const encryptForGroup = useCallback(
    async (
      content: string,
      memberEmails: string[]
    ): Promise<EncryptedMessage> => {
      console.log(`useE2EE.encryptForGroup called with ${memberEmails.length} members`)
      try {
        if (memberEmails.length === 0) {
          return { content, encrypted: false }
        }
        if (memberEmails.length > 20) {
          console.warn('useE2EE.encryptForGroup: too many members, sending plain')
          return { content, encrypted: false }
        }
        // Fetch bulk keys
        const keys = await dispatch(fetchBulkPublicKeysThunk(memberEmails)).unwrap()
        // Pick first available key
        const firstEmail = memberEmails.find((email) => keys[email])
        if (!firstEmail || !keys[firstEmail]) {
          console.warn('useE2EE.encryptForGroup: no keys available, sending plain')
          return { content, encrypted: false }
        }
        // Encrypt with first available public key (simplified)
        const encryptedContent = await dispatch(
          encryptMessageThunk({ content, receiverEmail: firstEmail })
        ).unwrap()
        return { content: encryptedContent, encrypted: true }
      } catch (error) {
        console.error('useE2EE.encryptForGroup error:', error)
        return { content, encrypted: false }
      }
    },
    [dispatch]
  )

  const decryptMessage = useCallback(
    async (content: string, isEncrypted: boolean): Promise<string> => {
      console.log(`useE2EE.decryptMessage called with isEncrypted: ${isEncrypted}`)
      if (!isEncrypted) {
        return content
      }
      try {
        const plainText = await dispatch(
          decryptMessageThunk({ encryptedContent: content })
        ).unwrap()
        return plainText
      } catch (error) {
        console.error('useE2EE.decryptMessage error:', error)
        return '🔒 Could not decrypt'
      }
    },
    [dispatch]
  )

  const rotateKeys = useCallback(async (): Promise<void> => {
    console.log('useE2EE.rotateKeys called')
    const confirmed = window.confirm(
      'Rotating keys will make old messages unreadable. Continue?'
    )
    if (!confirmed) return
    try {
      await dispatch(rotateKeysThunk()).unwrap()
      showSuccess('Keys rotated successfully! Old messages may be unreadable.')
      console.log('useE2EE.rotateKeys success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Key rotation failed'
      showError(message)
    }
  }, [dispatch])

  const getPublicKey = useCallback(
    async (email: string): Promise<string | null> => {
      console.log(`useE2EE.getPublicKey called for ${email}`)
      try {
        const key = await dispatch(fetchPublicKeyThunk(email)).unwrap()
        return key || null
      } catch (error) {
        console.error('useE2EE.getPublicKey error:', error)
        return null
      }
    },
    [dispatch]
  )

  const hasPublicKey = useCallback(
    (email: string): boolean => {
      return publicKeys[email] !== undefined
    },
    [publicKeys]
  )

  return {
    hasKeys,
    isInitializing,
    isRotating,
    keyVersion,
    initializeE2EE,
    encryptForUser,
    encryptForGroup,
    decryptMessage,
    rotateKeys,
    getPublicKey,
    hasPublicKey,
  }
}
