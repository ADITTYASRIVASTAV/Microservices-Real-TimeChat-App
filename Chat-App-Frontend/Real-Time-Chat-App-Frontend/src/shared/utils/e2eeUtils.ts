import { STORAGE_KEYS } from './constants'

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  console.log('e2eeUtils.arrayBufferToBase64 called')
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  console.log('e2eeUtils.arrayBufferToBase64 result length:', base64.length)
  return base64
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  console.log('e2eeUtils.base64ToArrayBuffer called with base64 length:', base64.length)
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  console.log('e2eeUtils.base64ToArrayBuffer result length:', bytes.length)
  return bytes.buffer
}

export async function generateRSAKeyPair(): Promise<CryptoKeyPair> {
  console.log('e2eeUtils.generateRSAKeyPair called')
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    )
    console.log('e2eeUtils.generateRSAKeyPair: key pair generated successfully')
    return keyPair
  } catch (error) {
    console.error('e2eeUtils.generateRSAKeyPair error:', error)
    throw error
  }
}

export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  console.log('e2eeUtils.exportPublicKey called')
  try {
    const exported = await window.crypto.subtle.exportKey('spki', publicKey)
    const base64 = arrayBufferToBase64(exported)
    console.log('e2eeUtils.exportPublicKey result length:', base64.length)
    return base64
  } catch (error) {
    console.error('e2eeUtils.exportPublicKey error:', error)
    throw error
  }
}

export async function exportPrivateKey(privateKey: CryptoKey): Promise<string> {
  console.log('e2eeUtils.exportPrivateKey called')
  try {
    const exported = await window.crypto.subtle.exportKey('pkcs8', privateKey)
    const base64 = arrayBufferToBase64(exported)
    console.log('e2eeUtils.exportPrivateKey result (hidden for security)')
    return base64
  } catch (error) {
    console.error('e2eeUtils.exportPrivateKey error:', error)
    throw error
  }
}

export async function importPublicKey(base64Key: string): Promise<CryptoKey> {
  console.log('e2eeUtils.importPublicKey called with base64Key length:', base64Key.length)
  try {
    const buffer = base64ToArrayBuffer(base64Key)
    const key = await window.crypto.subtle.importKey(
      'spki',
      buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['encrypt']
    )
    console.log('e2eeUtils.importPublicKey: public key imported successfully')
    return key
  } catch (error) {
    console.error('e2eeUtils.importPublicKey error:', error)
    throw error
  }
}

export async function importPrivateKey(base64Key: string): Promise<CryptoKey> {
  console.log('e2eeUtils.importPrivateKey called with base64Key (hidden)')
  try {
    const buffer = base64ToArrayBuffer(base64Key)
    const key = await window.crypto.subtle.importKey(
      'pkcs8',
      buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['decrypt']
    )
    console.log('e2eeUtils.importPrivateKey: private key imported successfully')
    return key
  } catch (error) {
    console.error('e2eeUtils.importPrivateKey error:', error)
    throw error
  }
}

export async function encryptMessage(
  message: string,
  publicKeyBase64: string
): Promise<string> {
  console.log('e2eeUtils.encryptMessage called with message length:', message.length)
  try {
    const publicKey = await importPublicKey(publicKeyBase64)
    const encoded = new TextEncoder().encode(message)
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      encoded
    )
    const encryptedBase64 = arrayBufferToBase64(encrypted)
    console.log('e2eeUtils.encryptMessage: encryption successful')
    return encryptedBase64
  } catch (error) {
    console.error('e2eeUtils.encryptMessage error:', error)
    throw error
  }
}

export async function decryptMessage(
  encryptedBase64: string,
  privateKeyBase64: string
): Promise<string> {
  console.log('e2eeUtils.decryptMessage called with encryptedBase64 length:', encryptedBase64.length)
  try {
    const privateKey = await importPrivateKey(privateKeyBase64)
    const encryptedBuffer = base64ToArrayBuffer(encryptedBase64)
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      encryptedBuffer
    )
    const decoded = new TextDecoder().decode(decrypted)
    console.log('e2eeUtils.decryptMessage: decryption successful')
    return decoded
  } catch (error) {
    console.error('e2eeUtils.decryptMessage error:', error)
    throw error
  }
}

export function savePrivateKey(privateKey: string): void {
  console.log('e2eeUtils.savePrivateKey called, key length:', privateKey.length)
  localStorage.setItem(STORAGE_KEYS.PRIVATE_KEY, privateKey)
}

export function getPrivateKey(): string | null {
  const key = localStorage.getItem(STORAGE_KEYS.PRIVATE_KEY)
  console.log('e2eeUtils.getPrivateKey called, key exists:', key !== null)
  return key
}

export function removePrivateKey(): void {
  console.log('e2eeUtils.removePrivateKey called')
  localStorage.removeItem(STORAGE_KEYS.PRIVATE_KEY)
}