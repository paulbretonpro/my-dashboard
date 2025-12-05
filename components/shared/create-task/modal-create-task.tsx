import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Plus } from 'lucide-react'
import { CreateTask } from './create-task'
import { useState } from 'react'

export function ModalCreateTask() {
  const [isLoading, setLoading] = useState(false)

  const handleAddTask = () => setLoading(true)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle tâche</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une liste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CreateTask />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading} onClick={handleAddTask}>
            {isLoading ? <Spinner /> : <Plus />} Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
