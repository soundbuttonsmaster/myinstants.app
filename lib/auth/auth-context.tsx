"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

const AUTH_TOKEN_KEY = "sb_auth_token"
const AUTH_USER_KEY = "sb_auth_user"

export interface AuthUser {
  id: number
  username: string
  email: string
  full_name?: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isReady: boolean
  login: (token: string, user: AuthUser) => void
  logout: () => void
  setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadStoredAuth(): { token: string | null; user: AuthUser | null } {
  if (typeof window === "undefined") return { token: null, user: null }
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userStr = localStorage.getItem(AUTH_USER_KEY)
    const user = userStr ? (JSON.parse(userStr) as AuthUser) : null
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const { token: t, user: u } = loadStoredAuth()
    setToken(t)
    setUserState(u)
    setIsReady(true)
  }, [])

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    setToken(newToken)
    setUserState(newUser)
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser))
    } catch {}
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserState(null)
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    } catch {}
  }, [])

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u)
    if (u) {
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u))
      } catch {}
    } else {
      try {
        localStorage.removeItem(AUTH_USER_KEY)
      } catch {}
    }
  }, [])

  const value: AuthContextValue = {
    user,
    token,
    isReady,
    login,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
