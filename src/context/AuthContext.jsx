import { useState } from 'react'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user') || sessionStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  // remember=true -> tetap login walau browser ditutup (localStorage).
  // remember=false -> logout otomatis begitu tab/browser ditutup (sessionStorage).
  const login = (userData, remember = false) => {
    const storage      = remember ? localStorage : sessionStorage
    const otherStorage = remember ? sessionStorage : localStorage
    otherStorage.removeItem('user')
    storage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    sessionStorage.removeItem('user')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
