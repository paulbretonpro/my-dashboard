export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()

  // Écouter tous les changements d'état d'authentification
  supabase.auth.onAuthStateChange(async (event, session) => {
    // Mettre à jour la date de dernière connexion lors d'une connexion ou d'un refresh token
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      if (session?.user) {
        try {
          $fetch('/api/user/last-connection', { method: 'POST' })
        } catch (error) {
          console.error('Failed to update last connection:', error)
        }
      }
    }
  })
})
