export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const { id, ...sessionData } = session

  await setUserSession(event, {
    ...sessionData,
    refreshedAt: new Date().toISOString()
  })

  return { refreshed: true }
})
