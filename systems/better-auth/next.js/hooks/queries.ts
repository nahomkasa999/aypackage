import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { isAdmin, isEditor } from '@/types/auth'

// Auth session hook
export const useAuth = () => {
  const { data: session, isPending, error } = authClient.useSession()
  
  return {
    session,
    user: session?.user,
    isPending,
    error,
    isAuthenticated: !!session,
    isAdmin: isAdmin(session?.user),
    isEditor: isEditor(session?.user),
  }
}

// Prefetch auth session for instant loading
export const usePrefetchAuth = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['auth-session'],
      queryFn: async () => {
        const { data } = await authClient.getSession()
        return data
      },
    })
  }
}

// Auth utilities
export const useAuthActions = () => {
  const signIn = async (credentials: { email: string; password: string }) => {
    return await authClient.signIn.email(credentials)
  }
  
  const signUp = async (credentials: { email: string; password: string; name?: string }) => {
    return await authClient.signUp.email(credentials)
  }
  
  const signOut = async () => {
    return await authClient.signOut()
  }
  
  const signInWithGoogle = async () => {
    return await authClient.signIn.social({ provider: 'google' })
  }
  
  const signUpWithGoogle = async () => {
    return await authClient.signUp.social({ provider: 'google' })
  }
  
  return {
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signUpWithGoogle,
  }
}
