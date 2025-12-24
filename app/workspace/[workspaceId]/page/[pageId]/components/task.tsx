import { Checkbox } from '@/components/ui/checkbox'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'

export default function Task() {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Basic Item</ItemTitle>
        <ItemDescription>A simple item with title and description.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Checkbox />
      </ItemActions>
    </Item>
  )
}
