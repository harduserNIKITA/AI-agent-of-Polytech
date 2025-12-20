// frontend/src/app/providers.tsx
'use client'

import React, { ReactNode, useEffect, useState } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  login: (token: string, refreshToken: string) => void
  logout: () => void
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function Providers({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)

  // Инициализация при загрузке страницы
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken)
      setRefreshToken(storedRefreshToken)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('accessToken', token)
    localStorage.setItem('refreshToken', refreshToken)
    setAccessToken(token)
    setRefreshToken(refreshToken)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setAccessToken(null)
    setRefreshToken(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}