import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '@/shared/utils/tokenUtils'

interface PublicRouteProps {
  children?: React.ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuth = isAuthenticated()

  if (isAuth) {
    return <Navigate to="/dashboard" replace />
  }

  return children ? <>{children}</> : <Outlet />
}

export default PublicRoute