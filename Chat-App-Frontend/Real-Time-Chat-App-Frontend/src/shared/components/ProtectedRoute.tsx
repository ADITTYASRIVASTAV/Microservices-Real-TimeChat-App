import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '@/shared/utils/tokenUtils'

interface ProtectedRouteProps {
  children?: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuth = isAuthenticated()

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute