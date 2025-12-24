import TitleHeader from '@/components/shared/title-header'
import ListPage from './components/list-pages'

export default async function Page() {
  return (
    <div className="space-y-6">
      <TitleHeader title="Workspace name" description="Petite description sur le workspace" />
      <ListPage />
    </div>
  )
}
