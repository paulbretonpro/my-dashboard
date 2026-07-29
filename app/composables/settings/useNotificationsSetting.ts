export default function () {
  const state = reactive<{ [key: string]: boolean }>({
    email: true,
    desktop: false,
    product_updates: true,
    weekly_digest: false,
    important_updates: true
  })

  const sections = [
    {
      title: 'Notification channels',
      description: 'Where can we notify you?',
      fields: [
        {
          name: 'email',
          label: 'Email',
          description: 'Receive a daily email digest.'
        },
        {
          name: 'desktop',
          label: 'Desktop',
          description: 'Receive desktop notifications.'
        }
      ]
    }
  ]

  async function onChange() {
    // Do something with data
  }

  return {
    state,
    sections,
    onChange
  }
}
