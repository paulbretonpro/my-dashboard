import { IPage } from '@/utils/type'
import PageCard from './page-card'

export default function ListPage() {
  const page: IPage = {
    id: 1,
    isFavorite: false,
    name: 'Mes tâches',
    description: 'Liste des tâches',
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <PageCard page={page} />
    </div>
  )
}
