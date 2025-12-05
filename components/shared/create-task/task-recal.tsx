'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Clock } from 'lucide-react'

export function TaskRecal() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full border text-xs border-dashed">
          <Clock /> Rappel
        </Button>
      </PopoverTrigger>
    </Popover>
  )
}
