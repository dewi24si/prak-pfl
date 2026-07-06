import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const HOME_BY_ROLE = { admin: '/admin/dashboard', dokter: '/dokter/dashboard', user: '/pasien/dashboard' }

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const allowedRoles = Array.isArray(role) ? role : [role]
  if (role && !allowedRoles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || '/pasien/dashboard'} replace />
  }
  return children
}
