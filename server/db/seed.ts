import { db } from './index'
import { pages, users, workspaces } from './schema'

await db
  .insert(users)
  .values({
    id: 1,
    providerId: '48292737',
    avatarUrl: 'https://avatars.githubusercontent.com/u/48292737?v=4',
    displayName: 'Paul Breton'
  })
  .onConflictDoNothing()

await db
  .insert(workspaces)
  .values([
    {
      id: 1,
      name: 'CAM',
      icon: 'i-lucide-rocket',
      userId: 1
    },
    {
      id: 2,
      name: 'My Cooperl Home',
      icon: 'i-lucide-home-cog',
      userId: 1
    }
  ])
  .onConflictDoNothing()

await db
  .insert(pages)
  .values([
    {
      id: 1,
      name: 'Rappels',
      workspaceId: 1,
      isFavorite: false,
      userId: 1
    },
    {
      id: 2,
      name: 'Veille',
      isFavorite: true,
      userId: 1
    }
  ])
  .onConflictDoNothing()
