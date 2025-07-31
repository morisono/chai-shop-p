import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { createAuthClient } from 'better-auth/react'

// Better Auth client configuration
const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://api.domain.com'
    : 'http://localhost:3001',
  credentials: 'include'
})

// Types
interface User {
  id: string
  email: string
  name: string
  role?: string
  mfaEnabled?: boolean
  lastLoginAt?: string
}

interface AuthState {
  user: User | null
  session: any | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  securityContext?: {
    deviceFingerprint?: string
    riskScore?: number
    mfaRequired?: boolean
  }
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_SESSION'; payload: any }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SECURITY_CONTEXT'; payload: any }
  | { type: 'CLEAR_AUTH' }

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null
}

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null
      }
    case 'SET_SESSION':
      return { ...state, session: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_SECURITY_CONTEXT':
      return { ...state, securityContext: action.payload }
    case 'CLEAR_AUTH':
      return {
        ...initialState,
        isLoading: false
      }
    default:
      return state
  }
}

// Auth context
interface AuthContextType extends AuthState {
  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>

  // OAuth methods
  signInWithGoogle: () => Promise<void>
  signInWithTwitter: () => Promise<void>

  // WebAuthn/Passkey methods
  registerPasskey: (name?: string) => Promise<void>
  authenticateWithPasskey: () => Promise<void>

  // MFA methods
  enableMFA: () => Promise<string> // Returns QR code or setup info
  verifyMFA: (code: string) => Promise<void>
  disableMFA: (code: string) => Promise<void>

  // Utility methods
  refreshSession: () => Promise<void>
  checkSecurityContext: () => Promise<void>

  // Development methods
  mockSignIn: (role?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // Check for existing session
      const session = await authClient.getSession()

      if (session.data) {
        dispatch({ type: 'SET_SESSION', payload: session.data })
        dispatch({ type: 'SET_USER', payload: session.data.user })

        // Get security context
        await checkSecurityContext()
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const result = await authClient.signIn.email({
        email,
        password
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      if (result.data) {
        dispatch({ type: 'SET_SESSION', payload: result.data })
        dispatch({ type: 'SET_USER', payload: result.data.user })
        await checkSecurityContext()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Sign up with email/password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const result = await authClient.signUp.email({
        email,
        password,
        name
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      if (result.data) {
        dispatch({ type: 'SET_SESSION', payload: result.data })
        dispatch({ type: 'SET_USER', payload: result.data.user })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await authClient.signOut()
      dispatch({ type: 'CLEAR_AUTH' })
    } catch (error) {
      console.error('Sign out failed:', error)
      // Clear local state even if server request fails
      dispatch({ type: 'CLEAR_AUTH' })
    }
  }

  // OAuth sign in methods
  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/auth/callback`
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'OAuth sign in failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    }
  }

  const signInWithTwitter = async () => {
    try {
      await authClient.signIn.social({
        provider: 'twitter',
        callbackURL: `${window.location.origin}/auth/callback`
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'OAuth sign in failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    }
  }

  // WebAuthn/Passkey methods
  const registerPasskey = async (name?: string) => {
    try {
      const result = await authClient.passkey.register({
        name: name || `${state.user?.name || 'User'}'s Device`
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Refresh user data to include new passkey
      await refreshSession()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Passkey registration failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    }
  }

  const authenticateWithPasskey = async () => {
    try {
      const result = await authClient.passkey.authenticate()

      if (result.error) {
        throw new Error(result.error.message)
      }

      if (result.data) {
        dispatch({ type: 'SET_SESSION', payload: result.data })
        dispatch({ type: 'SET_USER', payload: result.data.user })
        await checkSecurityContext()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Passkey authentication failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    }
  }

  // MFA methods
  const enableMFA = async (): Promise<string> => {
    try {
      const result = await authClient.twoFactor.enable()

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result.data.qrCode || result.data.secret
    } catch (error) {
      const message = error instanceof Error ? error.message : 'MFA setup failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    }
  }

  const verifyMFA = async (code: string) => {
    try {
      const result = await authClient.twoFactor.verify({ code })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Refresh user data
      await refreshSession()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'MFA verification failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    }
  }

  const disableMFA = async (code: string) => {
    try {
      const result = await authClient.twoFactor.disable({ code })

      if (result.error) {
        throw new Error(result.error.message)
      }

      // Refresh user data
      await refreshSession()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'MFA disable failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    }
  }

  // Utility methods
  const refreshSession = async () => {
    try {
      const session = await authClient.getSession()

      if (session.data) {
        dispatch({ type: 'SET_SESSION', payload: session.data })
        dispatch({ type: 'SET_USER', payload: session.data.user })
      } else {
        dispatch({ type: 'CLEAR_AUTH' })
      }
    } catch (error) {
      console.error('Session refresh failed:', error)
      dispatch({ type: 'CLEAR_AUTH' })
    }
  }

  const checkSecurityContext = async () => {
    try {
      // Get security context from server
      const response = await fetch('/api/user/security', {
        credentials: 'include'
      })

      if (response.ok) {
        const securityData = await response.json()
        dispatch({ type: 'SET_SECURITY_CONTEXT', payload: securityData })
      }
    } catch (error) {
      console.error('Failed to get security context:', error)
    }
  }

  // Development mock sign in
  const mockSignIn = async (role: string = 'user') => {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Mock authentication is only available in development')
    }

    try {
      const response = await fetch(`/api/dev/mock-login?role=${role}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Mock authentication failed')
      }

      const data = await response.json()

      dispatch({ type: 'SET_USER', payload: data.user })
      dispatch({ type: 'SET_SESSION', payload: { token: data.token } })

      // Set auth header for subsequent requests
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Mock sign in failed'
      dispatch({ type: 'SET_ERROR', payload: message })
      throw error
    }
  }

  // Context value
  const contextValue: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithTwitter,
    registerPasskey,
    authenticateWithPasskey,
    enableMFA,
    verifyMFA,
    disableMFA,
    refreshSession,
    checkSecurityContext,
    mockSignIn
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

// Higher-order component for protected routes
interface WithAuthProps {
  requiredRole?: string
  fallback?: ReactNode
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const { requiredRole, fallback } = options

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (!isAuthenticated) {
      return fallback || <div>Please sign in to access this page.</div>
    }

    if (requiredRole && user?.role !== requiredRole) {
      return <div>You don't have permission to access this page.</div>
    }

    return <WrappedComponent {...props} />
  }
}

// Protected route component
interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p>Please sign in to access this page.</p>
        </div>
      </div>
    )
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
