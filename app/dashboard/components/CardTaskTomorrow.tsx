import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CardTaskTomorrow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes tâches de demain</CardTitle>
        <CardDescription>À réaliser demain</CardDescription>

        <CardAction>
          <Button variant="ghost">
            <ArrowRight />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold text-primary">12</div>
      </CardContent>
    </Card>
  )
}
