import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { E2EEState, KeyResponse } from '@/types'
import {
  uploadPublicKeyApi,
  getPublicKeyApi,
  getBulkPublicKeysApi,
  updatePublicKeyApi,
  checkKeyExistsApi,
} from '@/Features/E2EE/Api/keyApi'
import {
  generateRSAKeyPair,
  exportPublicKey,
  exportPrivateKey,
  encryptMessage,
  decryptMessage,
  getPrivateKey,
  savePrivateKey,
} from '@/shared/utils/e2eeUtils'
import type { RootState, AppDispatch } from '@/store/store'

const initialState: E2EEState = {
  publicKeys: {},
  hasKeys: false,
  isLoading: false,
  error: null,
  isInitializing: false,
  isRotating: false,
  keyVersion: 0,
}

export const initializeE2EEThunk = createAsyncThunk<
  { success: boolean; isNewKeys: boolean; keyVersion: number },
  string,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>('e2ee/initialize', async (userEmail, { rejectWithValue, dispatch }) => {
  console.log('e2eeSlice.initializeE2EEThunk called with userEmail:', userEmail)
  try {
    dispatch(setInitializing(true))

    // Step 1: Check localStorage for private key
    const storedPrivateKey = getPrivateKey()
    console.log('e2eeSlice.initialize: private key in localStorage:', storedPrivateKey ? 'present' : 'missing')

    // Step 2: Check backend for public key
    let backendHasKey = false
    try {
      backendHasKey = await checkKeyExistsApi(userEmail)
    } catch (error) {
      console.error('e2eeSlice.initialize: error checking backend key existence:', error)
      backendHasKey = false
    }
    console.log('e2eeSlice.initialize: backend key exists:', backendHasKey)

    // Case 1: Both keys exist -> ready
    if (storedPrivateKey && backendHasKey) {
      console.log('e2eeSlice.initialize: keys already exist, setting hasKeys true')
      dispatch(setHasKeys(true))
      dispatch(setInitializing(false))
      return { success: true, isNewKeys: false, keyVersion: 0 }
    }

    // Case 2 or 3: generate new key pair
    console.log('e2eeSlice.initialize: generating new RSA key pair')
    const keyPair = await generateRSAKeyPair()
    console.log('e2eeSlice.initialize: key pair generated')

    // Export keys
    const publicKeyBase64 = await exportPublicKey(keyPair.publicKey)
    const privateKeyBase64 = await exportPrivateKey(keyPair.privateKey)
    console.log('e2eeSlice.initialize: keys exported to base64')

    // Save private key to localStorage
    savePrivateKey(privateKeyBase64)
    console.log('e2eeSlice.initialize: private key saved to localStorage')

    // Upload public key to backend
    if (backendHasKey) {
      console.log('e2eeSlice.initialize: updating existing public key on backend')
      await updatePublicKeyApi({ publicKey: publicKeyBase64 })
    } else {
      console.log('e2eeSlice.initialize: uploading new public key to backend')
      await uploadPublicKeyApi({ publicKey: publicKeyBase64 })
    }

    dispatch(setHasKeys(true))
    dispatch(setInitializing(false))
    dispatch(setKeyVersion(1))
    console.log('e2eeSlice.initialize: keys initialized successfully')
    return { success: true, isNewKeys: true, keyVersion: 1 }
  } catch (error) {
    console.error('e2eeSlice.initializeE2EEThunk error:', error)
    dispatch(setInitializing(false))
    const message = error instanceof Error ? error.message : 'E2EE initialization failed'
    return rejectWithValue(message)
  }
})

export const fetchPublicKeyThunk = createAsyncThunk<
  string,
  string,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>('e2ee/fetchPublicKey', async (email, { rejectWithValue, getState, dispatch }) => {
  console.log('e2eeSlice.fetchPublicKeyThunk called with email:', email)
  try {
    const state = getState()
    const cachedKey = state.e2ee.publicKeys[email]
    if (cachedKey) {
      console.log('e2eeSlice.fetchPublicKeyThunk: key found in cache, returning it')
      return cachedKey
    }

    const response: KeyResponse = await getPublicKeyApi(email)
    console.log('e2eeSlice.fetchPublicKeyThunk: fetched public key from API:', response)
    dispatch(addPublicKey({ email, key: response.publicKey }))
    return response.publicKey
  } catch (error) {
    console.error('e2eeSlice.fetchPublicKeyThunk error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch public key'
    return rejectWithValue(message)
  }
})

export const fetchBulkPublicKeysThunk = createAsyncThunk<
  Record<string, string>,
  string[],
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>('e2ee/fetchBulkPublicKeys', async (emails, { rejectWithValue, getState, dispatch }) => {
  console.log('e2eeSlice.fetchBulkPublicKeysThunk called with emails:', emails)
  try {
    const state = getState()
    const existingKeys = state.e2ee.publicKeys
    const needFetch: string[] = []
    const result: Record<string, string> = {}

    for (const email of emails) {
      if (existingKeys[email]) {
        result[email] = existingKeys[email]
      } else {
        needFetch.push(email)
      }
    }

    console.log('e2eeSlice.fetchBulkPublicKeysThunk: need to fetch:', needFetch)

    if (needFetch.length > 0) {
      const responseList = await getBulkPublicKeysApi(needFetch)
      const newKeys: Record<string, string> = {}
      responseList.forEach((item) => {
        newKeys[item.userEmail] = item.publicKey
        result[item.userEmail] = item.publicKey
      })
      dispatch(setPublicKeys({ ...existingKeys, ...newKeys }))
      console.log('e2eeSlice.fetchBulkPublicKeysThunk: fetched and cached new keys')
    }

    return result
  } catch (error) {
    console.error('e2eeSlice.fetchBulkPublicKeysThunk error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch bulk public keys'
    return rejectWithValue(message)
  }
})

export const rotateKeysThunk = createAsyncThunk<
  { success: boolean; newKeyVersion: number },
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>('e2ee/rotateKeys', async (_, { rejectWithValue, dispatch }) => {
  console.log('e2eeSlice.rotateKeysThunk called')
  try {
    dispatch(setRotating(true))

    const keyPair = await generateRSAKeyPair()
    const publicKeyBase64 = await exportPublicKey(keyPair.publicKey)
    const privateKeyBase64 = await exportPrivateKey(keyPair.privateKey)
    console.log('e2eeSlice.rotateKeys: new keys generated')

    savePrivateKey(privateKeyBase64)
    console.log('e2eeSlice.rotateKeys: new private key saved')

    const response: KeyResponse = await updatePublicKeyApi({ publicKey: publicKeyBase64 })
    console.log('e2eeSlice.rotateKeys: backend updated, new key version:', response.keyVersion)

    dispatch(clearPublicKeysCache())
    dispatch(setKeyVersion(response.keyVersion))
    dispatch(setHasKeys(true))
    dispatch(setRotating(false))

    return { success: true, newKeyVersion: response.keyVersion }
  } catch (error) {
    console.error('e2eeSlice.rotateKeysThunk error:', error)
    dispatch(setRotating(false))
    const message = error instanceof Error ? error.message : 'Key rotation failed'
    return rejectWithValue(message)
  }
})


export const encryptMessageThunk = createAsyncThunk<
  string,
  { content: string; receiverEmail: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>('e2ee/encryptMessage', async ({ content, receiverEmail }, { rejectWithValue, dispatch }) => {
  console.log('e2eeSlice.encryptMessageThunk called for receiver:', receiverEmail)
  try {
    const publicKeyBase64 = await dispatch(fetchPublicKeyThunk(receiverEmail)).unwrap()
    console.log('e2eeSlice.encryptMessageThunk: public key obtained')

    const encrypted = await encryptMessage(content, publicKeyBase64)
    console.log('e2eeSlice.encryptMessageThunk: encryption successful')
    return encrypted
  } catch (error) {
    console.error('e2eeSlice.encryptMessageThunk error:', error)
    const message = error instanceof Error ? error.message : 'Encryption failed'
    return rejectWithValue(message)
  }
})


export const decryptMessageThunk = createAsyncThunk<
  string,
  { encryptedContent: string },
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>('e2ee/decryptMessage', async ({ encryptedContent }) => {
  console.log('e2eeSlice.decryptMessageThunk called')
  try {
    const privateKeyBase64 = getPrivateKey()
    if (!privateKeyBase64) {
      console.warn('e2eeSlice.decryptMessageThunk: no private key found, returning placeholder')
      return 'Encrypted Message'
    }

    const decrypted = await decryptMessage(encryptedContent, privateKeyBase64)
    console.log('e2eeSlice.decryptMessageThunk: decryption successful')
    return decrypted
  } catch (error) {
    console.error('e2eeSlice.decryptMessageThunk error:', error)
    return 'Could not decrypt'
  }
})


const e2eeSlice = createSlice({
  name: 'e2ee',
  initialState,
  reducers: {
    setPublicKeys: (state, action: PayloadAction<Record<string, string>>) => {
      console.log('e2eeSlice.setPublicKeys called with:', action.payload)
      state.publicKeys = action.payload
    },
    addPublicKey: (state, action: PayloadAction<{ email: string; key: string }>) => {
      console.log('e2eeSlice.addPublicKey called with:', action.payload)
      state.publicKeys[action.payload.email] = action.payload.key
    },
    setHasKeys: (state, action: PayloadAction<boolean>) => {
      console.log('e2eeSlice.setHasKeys called with:', action.payload)
      state.hasKeys = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('e2eeSlice.setLoading called with:', action.payload)
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      console.log('e2eeSlice.setError called with:', action.payload)
      state.error = action.payload
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      console.log('e2eeSlice.setInitializing called with:', action.payload)
      state.isInitializing = action.payload
    },
    setRotating: (state, action: PayloadAction<boolean>) => {
      console.log('e2eeSlice.setRotating called with:', action.payload)
      state.isRotating = action.payload
    },
    setKeyVersion: (state, action: PayloadAction<number>) => {
      console.log('e2eeSlice.setKeyVersion called with:', action.payload)
      state.keyVersion = action.payload
    },
    clearPublicKeysCache: (state) => {
      console.log('e2eeSlice.clearPublicKeysCache called')
      state.publicKeys = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeE2EEThunk.pending, (state) => {
        state.isInitializing = true
        state.error = null
      })
      .addCase(initializeE2EEThunk.fulfilled, (state, action) => {
        state.isInitializing = false
        state.hasKeys = true
        state.keyVersion = action.payload.keyVersion
      })
      .addCase(initializeE2EEThunk.rejected, (state, action) => {
        state.isInitializing = false
        state.error = action.payload ?? 'E2EE initialization failed'
      })

    builder
      .addCase(fetchPublicKeyThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPublicKeyThunk.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(fetchPublicKeyThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch public key'
      })

    builder
      .addCase(fetchBulkPublicKeysThunk.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchBulkPublicKeysThunk.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(fetchBulkPublicKeysThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Failed to fetch bulk public keys'
      })

    builder
      .addCase(rotateKeysThunk.pending, (state) => {
        state.isRotating = true
        state.error = null
      })
      .addCase(rotateKeysThunk.fulfilled, (state, action) => {
        state.isRotating = false
        state.keyVersion = action.payload.newKeyVersion
        state.hasKeys = true
      })
      .addCase(rotateKeysThunk.rejected, (state, action) => {
        state.isRotating = false
        state.error = action.payload ?? 'Key rotation failed'
      })

    builder
      .addCase(encryptMessageThunk.pending, () => {})
      .addCase(encryptMessageThunk.fulfilled, () => {})
      .addCase(encryptMessageThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Encryption failed'
      })

    builder
      .addCase(decryptMessageThunk.pending, () => {})
      .addCase(decryptMessageThunk.fulfilled, () => {})
      .addCase(decryptMessageThunk.rejected, (state, action) => {
        state.error = action.payload ?? 'Decryption failed'
      })
  },
})

export const {
  setPublicKeys,
  addPublicKey,
  setHasKeys,
  setLoading,
  setError,
  setInitializing,
  setRotating,
  setKeyVersion,
  clearPublicKeysCache,
} = e2eeSlice.actions

// Selectors
export const selectPublicKeys = (state: RootState): Record<string, string> => state.e2ee.publicKeys
export const selectHasKeys = (state: RootState): boolean => state.e2ee.hasKeys
export const selectIsLoading = (state: RootState): boolean => state.e2ee.isLoading
export const selectError = (state: RootState): string | null => state.e2ee.error
export const selectIsInitializing = (state: RootState): boolean => state.e2ee.isInitializing
export const selectIsRotating = (state: RootState): boolean => state.e2ee.isRotating
export const selectKeyVersion = (state: RootState): number => state.e2ee.keyVersion
export const selectPublicKey = (email: string) => (state: RootState): string | undefined => state.e2ee.publicKeys[email]

export default e2eeSlice.reducer
