import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isSeller: boolean
  isApproved: boolean
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      api.setToken(session?.access_token ?? null)

      if (session?.user) {
        checkSellerRole(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        api.setToken(session?.access_token ?? null)

        if (session?.user) {
          await checkSellerRole(session.user.id)
        } else {
          setIsSeller(false)
          setIsApproved(false)
          setIsLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkSellerRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, seller_status')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error checking seller role:', error)
        setIsSeller(false)
        setIsApproved(false)
      } else {
        const profile = data as { role: string; seller_status: string }
        setIsSeller(profile.role === 'seller' || profile.role === 'admin')
        setIsApproved(profile.seller_status === 'approved' || profile.role === 'admin')
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
          .select('role, seller_status')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          await supabase.auth.signOut()
          return { error: 'Access denied. Seller privileges required.' }
        }

        const p = profile as { role: string; seller_status: string }
        if (p.role !== 'seller' && p.role !== 'admin') {
          await supabase.auth.signOut()
          return { error: 'Access denied. Seller privileges required.' }
        }
      }

      return { error: null }
    } catch (err) {
      return { error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setIsSeller(false)
    setIsApproved(false)
    api.setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isSeller,
        isApproved,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
