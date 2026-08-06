import { requireUserAuth } from '~~/server/utils/user'

interface SearchResultFeed {
  name: string
  url: string
  siteUrl: string | null
  description: string | null
  subscribers: number
  iconUrl: string | null
}

export default defineEventHandler(async (event): Promise<SearchResultFeed[]> => {
  await requireUserAuth(event)
  const query = getQuery(event)
  const q = query.q ? String(query.q).trim() : ''

  if (!q) {
    return []
  }

  try {
    const data = await $fetch<any>(
      `https://cloud.feedly.com/v3/search/feeds?query=${encodeURIComponent(q)}&count=20`
    )

    if (data && data.results) {
      return data.results.map((item: any) => {
        // Strip the 'feed/' prefix from feedId to get the actual XML feed URL
        let url = item.feedId
        if (url && url.startsWith('feed/')) {
          url = url.substring(5)
        }

        return {
          name: item.title,
          url: url,
          siteUrl: item.website || null,
          description: item.description || null,
          subscribers: item.subscribers || 0,
          iconUrl: item.iconUrl || item.visualUrl || null
        }
      })
    }

    return []
  } catch (error) {
    console.error('Feedly search failed:', error)
    return []
  }
})
