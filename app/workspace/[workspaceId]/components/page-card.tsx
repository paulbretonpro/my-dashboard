import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IPage } from '@/utils/type'

export default function PageCard({ page }: { page: IPage }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{page.name}</CardTitle>
        <CardAction>{page.isFavorite}</CardAction>
        <CardDescription>{page.description}</CardDescription>
      </CardHeader>

      <CardFooter>
        <div className="flex w-full justify-between">
          <div className="text-sm text-gray-400">Tâches</div>
          <Badge variant={'outline'}>12</Badge>
        </div>
      </CardFooter>
    </Card>
  )
}
