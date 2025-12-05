'use client'

import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeSelector } from './theme-selector'
import { ColorThemeSelector } from './color-theme-selector'
import { ModalCreateTask } from '@/components/shared/create-task/modal-create-task'

export function NavActions() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-muted-foreground hidden font-medium md:inline-block">Edit Oct 08</div>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star />
      </Button>

      <ColorThemeSelector />
      <ThemeSelector />

      <ModalCreateTask />
    </div>
  )
}
