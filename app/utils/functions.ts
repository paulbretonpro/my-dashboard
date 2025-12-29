export const isLoading = (status: string) => {
  return ['pending', 'idle'].includes(status)
}
