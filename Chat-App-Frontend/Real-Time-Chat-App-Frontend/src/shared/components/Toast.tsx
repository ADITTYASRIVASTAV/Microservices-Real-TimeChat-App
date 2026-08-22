import { Toaster, toast } from 'sonner'

export function showSuccess(message: string): void {
  console.log('Toast.showSuccess called with message:', message)
  toast.success(message, {
    duration: 3000,
    position: 'top-right'
  })
}

export function showError(message: string): void {
  console.log('Toast.showError called with message:', message)
  toast.error(message, {
    duration: 3000,
    position: 'top-right'
  })
}

export function showInfo(message: string): void {
  console.log('Toast.showInfo called with message:', message)
  toast.info(message, {
    duration: 3000,
    position: 'top-right'
  })
}

export function showWarning(message: string): void {
  console.log('Toast.showWarning called with message:', message)
  toast.warning(message, {
    duration: 3000,
    position: 'top-right'
  })
}

const Toast = () => {
  console.log('Toast component rendered, rendering Toaster')
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        classNames: {
          toast: 'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
          title: 'text-sm font-medium',
          description: 'text-sm text-gray-500 dark:text-gray-400'
        }
      }}
    />
  )
}

export default Toast