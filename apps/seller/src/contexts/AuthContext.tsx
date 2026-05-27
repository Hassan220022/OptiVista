import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isSeller: boolean
  isApproved: boolean
  storeName: string | null
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeller, setIsSeller] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [storeName, setStoreName] = useState<string | null>(null)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (!session?.user) {
          setIsSeller(false)
          setIsApproved(false)
          setStoreName(null)
          setIsLoading(false)
          return
        }

        setIsLoading(true)
        window.setTimeout(() => {
          void checkSellerRole(session.user.id)
        }, 0)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkSellerRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, is_seller_approved, store_name')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error checking seller role:', error)
        setIsSeller(false)
        setIsApproved(false)
      } else {
        const profile = data as { role: string; is_seller_approved: boolean | null; store_name: string | null }
        setIsSeller(profile.role === 'seller' || profile.role === 'admin')
        setIsApproved(Boolean(profile.is_seller_approved) || profile.role === 'admin')
        setStoreName(profile.store_name)
      }
    } catch (err) {
      console.error('Error checking seller role:', err)
      setIsSeller(false)
      setIsApproved(false)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, is_seller_approved, store_name')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          await supabase.auth.signOut()
          return { error: 'Access denied. Seller privileges required.' }
        }

        const p = profile as { role: string; is_seller_approved: boolean | null; store_name: string | null }
        if (p.role !== 'seller' && p.role !== 'admin') {
          await supabase.auth.signOut()
          return { error: 'Access denied. Seller privileges required.' }
        }
      }

      return { error: null }
    } catch {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsSeller(false)
    setIsApproved(false)
    setStoreName(null)
    setIsLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isSeller,
        isApproved,
        storeName,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
