export default defineNuxtRouteMiddleware(() => {
  const { setLayout } = useLayoutStore()

  setLayout({
    actions: undefined
  })
})