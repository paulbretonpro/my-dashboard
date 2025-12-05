import { ArrowUpIcon, PlusIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group'
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

          <InputGroupButton
            variant="default"
            className="rounded-full ml-auto"
            size="icon-xs"
            disabled
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
