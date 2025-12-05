import { InputGroup, InputGroupAddon, InputGroupTextarea } from '@/components/ui/input-group'
import { TaskDeadline } from './task-deadline'
import { TaskRecal } from './task-recal'

export function CreateTask() {
  return (
    <div className="grid w-full gap-6">
      <InputGroup>
        <InputGroupTextarea placeholder="Add new task, reminding, ..." />
        <InputGroupAddon align="block-end">
          <TaskDeadline />
          <TaskRecal />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
