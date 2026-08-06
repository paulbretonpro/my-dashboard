import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { userGithubRepositories, users } from '~~/server/db/schema'

interface LatestRelease {
  name: string | null
  tagName: string
  htmlUrl: string
  publishedAt: string
}

interface GithubRepoResponse {
  id: number
  owner: string
  repo: string
  createdAt: Date
  name: string
  fullName: string
  description: string | null
  stars: number
  forks: number
  openIssues: number
  language: string | null
  htmlUrl: string
  updatedAt: string | null
  avatarUrl: string | null
  status: 'success' | 'error'
  latestRelease: LatestRelease | null
  isNewRelease: boolean
}

export default defineEventHandler(async (event): Promise<GithubRepoResponse[]> => {
  const user = await requireUserAuth(event)

  const [dbUser] = await db
    .select({
      previousConnection: users.previousConnection,
      lastConnection: users.lastConnection
    })
    .from(users)
    .where(eq(users.id, user.sub))

  const previousConnectionDate = dbUser?.previousConnection ? new Date(dbUser.previousConnection) : null

  const trackedRepos = await db
    .select()
    .from(userGithubRepositories)
    .where(eq(userGithubRepositories.userId, user.sub))

  // Fetch from GitHub API in parallel with explicit types
  const fetchPromises: Promise<GithubRepoResponse>[] = trackedRepos.map(
    async (item): Promise<GithubRepoResponse> => {
      try {
        const headers: Record<string, string> = {
          'User-Agent': 'my-dashboard-app'
        }
        if (process.env.GITHUB_TOKEN) {
          headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
        }

        const [repoInfo, latestReleaseInfo] = await Promise.all([
          $fetch<any>(
            `https://api.github.com/repos/${item.owner}/${item.repo}`,
            {
              headers
            }
          ),
          $fetch<any>(
            `https://api.github.com/repos/${item.owner}/${item.repo}/releases/latest`,
            {
              headers
            }
          ).catch(() => null)
        ])

        const latestRelease = latestReleaseInfo
          ? {
              name: latestReleaseInfo.name,
              tagName: latestReleaseInfo.tag_name,
              htmlUrl: latestReleaseInfo.html_url,
              publishedAt: latestReleaseInfo.published_at
            }
          : null

        const isNewRelease = latestRelease && previousConnectionDate
          ? new Date(latestRelease.publishedAt) > previousConnectionDate
          : false

        return {
          id: item.id,
          owner: item.owner,
          repo: item.repo,
          createdAt: item.createdAt,
          name: repoInfo.name,
          fullName: repoInfo.full_name,
          description: repoInfo.description,
          stars: repoInfo.stargazers_count,
          forks: repoInfo.forks_count,
          openIssues: repoInfo.open_issues_count,
          language: repoInfo.language,
          htmlUrl: repoInfo.html_url,
          updatedAt: repoInfo.pushed_at || repoInfo.updated_at,
          avatarUrl: repoInfo.owner?.avatar_url,
          status: 'success',
          latestRelease,
          isNewRelease
        }
      } catch (error: any) {
        console.error(`Failed to fetch repo ${item.owner}/${item.repo}:`, error)
        return {
          id: item.id,
          owner: item.owner,
          repo: item.repo,
          createdAt: item.createdAt,
          name: item.repo,
          fullName: `${item.owner}/${item.repo}`,
          description:
            'Impossible de charger les données GitHub (Dépôt privé ou limite de taux atteinte).',
          stars: 0,
          forks: 0,
          openIssues: 0,
          language: null,
          htmlUrl: `https://github.com/${item.owner}/${item.repo}`,
          updatedAt: null,
          avatarUrl: null,
          status: 'error',
          latestRelease: null,
          isNewRelease: false
        }
      }
    }
  )

  return await Promise.all(fetchPromises)
})
