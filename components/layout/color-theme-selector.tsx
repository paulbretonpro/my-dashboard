'use client'

import { Circle } from 'lucide-react'
import { useColorTheme, type ColorTheme } from '@/hooks/use-color-theme'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const colorThemes: {
  value: ColorTheme
  label: string
  color: string
}[] = [
  { value: 'neutral', label: 'Neutral', color: '#737373' },
  { value: 'blue', label: 'Bleu', color: '#3b82f6' },
  { value: 'green', label: 'Vert', color: '#22c55e' },
  { value: 'rose', label: 'Rose', color: '#f43f5e' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'violet', label: 'Violet', color: '#a855f7' },
]

export function ColorThemeSelector() {
  const { colorTheme, setColorTheme, mounted } = useColorTheme()

  if (!mounted) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Couleur" />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={colorTheme} onValueChange={(value) => setColorTheme(value as ColorTheme)}>
      <SelectTrigger>
        <div className="flex items-center gap-2">
          <SelectValue placeholder="Couleur" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {colorThemes.map((theme) => (
          <SelectItem key={theme.value} value={theme.value}>
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 fill-current" style={{ color: theme.color }} />
              <span>{theme.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
