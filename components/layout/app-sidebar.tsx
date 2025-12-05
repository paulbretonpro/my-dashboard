'use client'

import * as React from 'react'
import { AudioWaveform, Calendar, Command, Home, Inbox, Search, Settings2 } from 'lucide-react'

import { NavFavorites } from '@/components/layout/nav-favorites'
import { NavMain } from '@/components/layout/nav-main'
import { NavSecondary } from '@/components/layout/nav-secondary'
import { NavWorkspaces } from '@/components/layout/nav-workspaces'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { DashboardSwitcher } from './dashboard-switcher/dashboard-switcher'

// This is sample data.
const data = {
  teams: [
    {
      name: 'Dashboard Pro',
      logo: Command,
      plan: 'Enterprise',
    },
    {
      name: 'Dashboard Perso',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navMain: [
    {
      title: 'Search',
      url: '#',
      icon: Search,
    },
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'Catégories',
      url: '/categories',
      icon: Inbox,
    },
  ],
  navSecondary: [
    {
      title: 'Calendar',
      url: '/calendar',
      icon: Calendar,
      badge: '10',
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
    },
  ],
  favorites: [
    {
      name: 'Veille',
      url: '#',
      emoji: '📊',
    },
    {
      name: 'Nuxt 4',
      url: '#',
      emoji: '🍳',
    },
  ],
  workspaces: [
    {
      name: 'MyCooperlHome',
      emoji: '🏠',
      pages: [
        {
          name: 'Mes tâches',
          url: '#',
          emoji: '🔍',
        },
        {
          name: 'Mes événements',
          url: '#',
          emoji: '📅',
        },
      ],
    },
    {
      name: 'CAM',
      emoji: '💼',
      pages: [
        {
          name: 'Mes tâches',
          url: '#',
          emoji: '🎯',
        },
        {
          name: 'Mes événements',
          url: '#',
          emoji: '📅',
        },
      ],
    },
    {
      name: 'Pass Annonce',
      emoji: '📢',
      pages: [
        {
          name: 'tâches',
          url: '#',
          emoji: '🔍',
        },
        {
          name: 'Mes événements',
          url: '#',
          emoji: '�',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <DashboardSwitcher />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces workspaces={data.workspaces} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
