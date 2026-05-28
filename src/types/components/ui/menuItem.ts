import { MenuItem, MenuItemType } from '../../modules/dnd/functionalBlock'
export interface BasicItem {
  id: string
  name: string
  isProduct?: boolean
}

export interface MenuItemComponentProps {
  item: MenuItem | BasicItem
  type: MenuItemType
  onAddChild: (parentId: string, type: MenuItemType) => void
  onRemove: (id: string, parentId?: string) => void
  onEdit: (
    id: string,
    name: string,
    type: MenuItemType,
    parentId?: string
  ) => void
  parentId?: string
}
