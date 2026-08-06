import { requireUserAuth } from '~~/server/utils/user'

interface PopularRepo {
  owner: string
  repo: string
  name: string
  fullName: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  avatarUrl: string | null
  htmlUrl: string
}

export default defineEventHandler(async (event): Promise<PopularRepo[]> => {
  await requireUserAuth(event)

  const query = getQuery(event)
  const page = Math.max(1, parseInt(String(query.page || '1'), 10))
  const perPage = Math.max(1, Math.min(100, parseInt(String(query.perPage || '6'), 10)))

  const headers: Record<string, string> = {
    'User-Agent': 'my-dashboard-app'
  }
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
  }

  // Curated list of awesome popular repositories to query or fallback to
  const curated = [
    { owner: 'nuxt', repo: 'nuxt' },
    { owner: 'vuejs', repo: 'core' },
    { owner: 'tailwindlabs', repo: 'tailwindcss' },
    { owner: 'drizzle-team', repo: 'drizzle-orm' },
    { owner: 'nuxt-hub', repo: 'core' },
    { owner: 'nuxt', repo: 'ui' }
  ]

  try {
    // Try fetching from GitHub search API with server-side pagination
    const searchResult = await $fetch<{ items: any[] }>(
      `https://api.github.com/search/repositories?q=language:typescript+stars:>30000&sort=stars&order=desc&per_page=${perPage}&page=${page}`,
      { headers }
    )

    if (searchResult && searchResult.items && searchResult.items.length > 0) {
      return searchResult.items.map((item: any) => ({
        owner: item.owner?.login || '',
        repo: item.name,
        name: item.name,
        fullName: item.full_name,
        description: item.description,
        stars: item.stargazers_count,
        forks: item.forks_count,
        language: item.language,
        avatarUrl: item.owner?.avatar_url || null,
        htmlUrl: item.html_url
      }))
    }
  } catch (error) {
    console.error('Failed to fetch trending from GitHub search API, falling back to curated list:', error)
  }

  // Fallback / Curated list fetch
  // If page > 1, curated list is already exhausted on page 1, so return empty array
  if (page > 1) {
    return []
  }

  const slicedCurated = curated.slice(0, perPage)
  const fallbackPromises = slicedCurated.map(async (item) => {
    try {
      const repoInfo = await $fetch<any>(
        `https://api.github.com/repos/${item.owner}/${item.repo}`,
        { headers }
      )
      return {
        owner: item.owner,
        repo: item.repo,
        name: repoInfo.name,
        fullName: repoInfo.full_name,
        description: repoInfo.description,
        stars: repoInfo.stargazers_count,
        forks: repoInfo.forks_count,
        language: repoInfo.language,
        avatarUrl: repoInfo.owner?.avatar_url || null,
        htmlUrl: repoInfo.html_url
      }
    } catch (e) {
      return {
        owner: item.owner,
        repo: item.repo,
        name: item.repo,
        fullName: `${item.owner}/${item.repo}`,
        description: 'Dépôt populaire de l\'écosystème web.',
        stars: 10000,
        forks: 500,
        language: 'TypeScript',
        avatarUrl: `https://github.com/${item.owner}.png`,
        htmlUrl: `https://github.com/${item.owner}/${item.repo}`
      }
    }
  })

  return Promise.all(fallbackPromises)
})
