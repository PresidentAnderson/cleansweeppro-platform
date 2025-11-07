import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthState {
  user: SupabaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      // Auto-login after registration
      if (data.user) {
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        })
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({
      user: null,
      isAuthenticated: false,
    })
  },

  loadUser: async () => {
    set({ isLoading: true })
    try {
      const { data: { user } } = await supabase.auth.getUser()

      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      })
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },
}))

// Listen to auth state changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
  })
})
