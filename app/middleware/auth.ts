export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, clear } = useUserSession()

  if (!loggedIn.value) {
    await clear()
    return await navigateTo('/login')
  }
})
