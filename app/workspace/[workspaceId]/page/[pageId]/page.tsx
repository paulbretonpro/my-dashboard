import TitleHeader from '@/components/shared/title-header'
import Task from './components/task'

export default async function Page() {
  return (
    <div className="space-y-6">
      <TitleHeader title="Page name" description="Petite description de la page"></TitleHeader>
      <Task />
    </div>
  )
}
