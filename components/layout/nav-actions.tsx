'use client'

import { Plus, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeSelector } from './theme-selector'
import { ColorThemeSelector } from './color-theme-selector'

export function NavActions() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-muted-foreground hidden font-medium md:inline-block">Edit Oct 08</div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button>

      <ColorThemeSelector />
      <ThemeSelector />

      <Link href="/new-list">
        <Button>
          <Plus /> New task
        </Button>
      </Link>
    </div>
  )
}
