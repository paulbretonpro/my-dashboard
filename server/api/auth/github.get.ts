export default defineOAuthGitHubEventHandler({
  async onSuccess(event, session) {
    const user = await createUserIfNotExists(event, session)
    if (!user) {
      return sendRedirect(event, '/login')
    }

    await setUserSession(event, { user })
    return sendRedirect(event, '/')
  }
})
