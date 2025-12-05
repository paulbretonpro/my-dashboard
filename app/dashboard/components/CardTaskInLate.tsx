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

export function CardTaskInLate() {
  const tasks = [
    { title: 'Tâche 1', lastUpdate: '21/12/2025' },
    { title: 'Tâche 2', lastUpdate: '22/12/2025' },
    { title: 'Tâche 3', lastUpdate: '23/12/2025' },
    { title: 'Tâche 4', lastUpdate: '24/12/2025' },
    { title: 'Tâche 5', lastUpdate: '25/12/2025' },
    { title: 'Tâche 6', lastUpdate: '26/12/2025' },
    { title: 'Tâche 7', lastUpdate: '27/12/2025' },
    { title: 'Tâche 8', lastUpdate: '28/12/2025' },
    { title: 'Tâche 9', lastUpdate: '29/12/2025' },
    { title: 'Tâche 10', lastUpdate: '30/12/2025' },
  ]

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Mes retards</CardTitle>
        <CardDescription>Deadline dépassée</CardDescription>

        <CardAction>
          <Button variant="ghost">
            <ArrowRight />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="overflow-y-auto">
        <div className="flex flex-col gap-2">
          {tasks.map((task, index) => (
            <div
              key={`${task.title}-${index}`}
              className="flex items-center justify-between bg-accent/50 p-4 rounded-md"
            >
              <span>{task.title}</span>
              <span className="text-sm text-muted-foreground">{task.lastUpdate}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
