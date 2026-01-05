import { watch } from 'vue'

const REFRESH_INTERVAL_MS = 10 * 60 * 1000

export default defineNuxtPlugin((nuxtApp) => {
  const { loggedIn } = useUserSession()
  let intervalId: ReturnType<typeof setInterval> | null = null

  const refreshSession = async () => {
    if (!loggedIn.value) {
      return
    }

    try {
      await useRequestFetch()('/api/auth/refresh')
    } catch (error) {
      console.warn('[auth-refresh] Failed to refresh session', error)
    }
  }

  const startHeartbeat = () => {
    if (intervalId || !loggedIn.value) {
      return
    }

    intervalId = window.setInterval(refreshSession, REFRESH_INTERVAL_MS)
  }

  const stopHeartbeat = () => {
    if (!intervalId) {
      return
    }

    clearInterval(intervalId)
    intervalId = null
  }

  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      refreshSession()
    }
  }

  watch(
    loggedIn,
    (value) => {
      if (value) {
        refreshSession()
        startHeartbeat()
      } else {
        stopHeartbeat()
      }
    },
    { immediate: true }
  )

  window.addEventListener('focus', refreshSession)
  window.addEventListener('visibilitychange', handleVisibility)

  nuxtApp.hook('app:unmounted', () => {
    stopHeartbeat()
    window.removeEventListener('focus', refreshSession)
    window.removeEventListener('visibilitychange', handleVisibility)
  })
})
