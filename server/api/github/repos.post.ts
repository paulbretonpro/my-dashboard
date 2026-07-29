import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { userGithubRepositories } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const body = await readBody(event)

  let owner = body?.owner?.trim()
  let repo = body?.repo?.trim()
  const url = body?.url?.trim()

  if (url) {
    // Parser l'URL GitHub
    // exemple : https://github.com/nuxt/nuxt ou github.com/nuxt/nuxt
    const match = url.match(/(?:github\.com\/|^)([a-zA-Z0-9-._]+)\/([a-zA-Z0-9-._]+)/)
    if (match) {
      owner = match[1]
      repo = match[2]
    }
  }

  if (!owner || !repo) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le propriétaire (owner) et le nom du dépôt (repo) ou l'URL GitHub sont obligatoires."
    })
  }

  // Nettoyage si le dépôt finit par .git
  if (repo.endsWith('.git')) {
    repo = repo.slice(0, -4)
  }

  // Vérifier que le dépôt existe sur GitHub
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'my-dashboard-app'
    }
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
    }

    await $fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers
    })
  } catch (error: any) {
    throw createError({
      statusCode: 404,
      statusMessage: `Le dépôt GitHub "${owner}/${repo}" est introuvable ou inaccessible.`
    })
  }

  // Vérifier s'il est déjà suivi
  const existing = await db
    .select()
    .from(userGithubRepositories)
    .where(
      and(
        eq(userGithubRepositories.userId, user.sub),
        eq(userGithubRepositories.owner, owner),
        eq(userGithubRepositories.repo, repo)
      )
    )

  if (existing.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: "Ce dépôt est déjà suivi."
    })
  }

  // Insérer en base de données
  const [newRepo] = await db
    .insert(userGithubRepositories)
    .values({
      userId: user.sub,
      owner,
      repo
    })
    .returning()

  return newRepo
})
