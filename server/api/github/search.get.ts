import { requireUserAuth } from '~~/server/utils/user'

interface SearchItem {
  label: string
  value: string
  description: string
  icon: string
}

export default defineEventHandler(async (event): Promise<SearchItem[]> => {
  await requireUserAuth(event)
  const query = getQuery(event)
  const q = query.q ? String(query.q).trim() : ''

  // Predefined popular repositories
  const popularRepos = [
    { label: 'nuxt/nuxt', value: 'nuxt/nuxt', description: 'Intuitive Web Framework', stars: 55000 },
    { label: 'nuxt-hub/core', value: 'nuxt-hub/core', description: 'Build full-stack Nuxt apps on Cloudflare', stars: 2500 },
    { label: 'nuxt/ui', value: 'nuxt/ui', description: 'A UI Library for Nuxt', stars: 6000 },
    { label: 'vuejs/core', value: 'vuejs/core', description: 'Progressive JavaScript Framework', stars: 45000 },
    { label: 'tailwindlabs/tailwindcss', value: 'tailwindlabs/tailwindcss', description: 'A utility-first CSS framework', stars: 80000 },
    { label: 'facebook/react', value: 'facebook/react', description: 'The library for web and native UIs', stars: 220000 },
    { label: 'vercel/next.js', value: 'vercel/next.js', description: 'The React Framework', stars: 120000 },
    { label: 'drizzle-team/drizzle-orm', value: 'drizzle-team/drizzle-orm', description: 'Next gen TypeScript ORM', stars: 14000 },
    { label: 'unjs/h3', value: 'unjs/h3', description: 'Minimal h3 web framework', stars: 3000 }
  ]

  if (!q) {
    return popularRepos.map(repo => ({
      label: repo.label,
      value: repo.value,
      description: `${(repo.stars / 1000).toFixed(1)}k ⭐ • ${repo.description}`,
      icon: 'i-simple-icons-github'
    }))
  }

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'my-dashboard-app'
    }
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
    }

    // Search repositories matching the query, sorted by stars
    const searchResult = await $fetch<{ items: any[] }>(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=10`,
      { headers }
    )

    if (searchResult && searchResult.items) {
      return searchResult.items.map((item: any) => ({
        label: item.full_name,
        value: item.full_name,
        description: `${(item.stargazers_count / 1000).toFixed(1)}k ⭐ • ${item.description || 'Pas de description'}`,
        icon: 'i-simple-icons-github'
      }))
    }

    return []
  } catch (error) {
    console.error('GitHub search failed:', error)
    // Fallback to filtering local popular repos
    return popularRepos
      .filter(repo => repo.label.toLowerCase().includes(q.toLowerCase()))
      .map(repo => ({
        label: repo.label,
        value: repo.value,
        description: `${(repo.stars / 1000).toFixed(1)}k ⭐ • ${repo.description}`,
        icon: 'i-simple-icons-github'
      }))
  }
})
