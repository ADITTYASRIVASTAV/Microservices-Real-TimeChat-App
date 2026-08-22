import { Component, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
    console.log('ErrorBoundary constructor called')
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('ErrorBoundary.getDerivedStateFromError called with error:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary.componentDidCatch caught error:', error)
    console.error('ErrorBoundary.componentDidCatch error info:', errorInfo)
  }

  handleRefresh = () => {
    console.log('ErrorBoundary: refresh button clicked, reloading page')
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      console.log('ErrorBoundary: rendering fallback UI')
      return (
        <motion.div
          className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-white p-8 shadow-lg dark:bg-gray-900 dark:border-gray-800">
            <div className="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.28 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
            <p className="text-gray-600 dark:text-gray-300">Please refresh the page to continue</p>
            <p className="text-sm text-red-500">{this.state.error?.message}</p>
            <button
              onClick={this.handleRefresh}
              className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary