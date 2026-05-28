/**
      *Classification : Confidential
**/
export enum MenuItemType {
  PRODUCT = 'PRODUCT',
  MAIN = 'SUBMENU',
  CHILD = 'CHILD',
}

export interface ChildMenuItem {
  id: string
  name: string
  description?: string
}

export interface MenuItem {
  id: string
  name: string
  description?: string
  child?: ChildMenuItem[]
}

export interface MenuStructure {
  productname: string
  menu: MenuItem[]
  action_control: {
    formType?: string
    formId?: string
    menuId?: string
    formName?: string
    permissions: Array<{
      action: string
      trigger_status_id?: string
    }>
  }
  meta_info?: {
    action_control?: {
      formType?: string
      formId?: string
      menuId?: string
      formName?: string
      permissions: Array<{
        action: string
        trigger_status_id?: string
      }>
    }
    task_info?: {
      task_comments?: Array<{
        comment: string
        date: string
        ref_id: number | null
        comment_type: string | null
        comment_order: number | null
        user_id: number
        firstName: string
        lastName: string
      }>
      reviewer_list?: Array<{
        user_id: number
        first_name: string
        last_name: string
      }>
    }
  }
}

export interface EditingItem {
  id: string
  name: string
  type: MenuItemType
  parentId?: string
  description?: string
}

export interface ApiBlock {
  functional_block_id: number
  tid: number
  eid: number
  project_id: number
  title: string
  description?: string
  functional_subblocks?: {
    functional_sub_block_id: number
    title: string
    description?: string
  }[]
}

export interface MainBlock {
  title: string
  description?: string
  functional_block_id: number
}

export interface SubBlock {
  title: string
  description?: string
  functional_sub_block_id: number
}

export interface ExtendedMenuItem extends MenuItem {
  description?: string
}

export interface ExtendedChildMenuItem extends ChildMenuItem {
  description?: string
}

export interface EditMenuItemParams {
  id: string
  name: string
  type: MenuItemType
  parentId?: string
}

export interface SaveMenuItemParams {
  title: string
  description: string
  editItem?: EditingItem
}

export interface RemoveMenuItemParams {
  id: string
  parentId?: string
  type?: MenuItemType
}

export interface MenuItemComponentProps {
  item: MenuItem | { id: string; name: string; isProduct?: boolean }
  type: MenuItemType
  onAddChild: (parentId: string, type: MenuItemType) => void
  onRemove: (id: string, parentId?: string, type?: MenuItemType) => void
  onEdit: (
    id: string,
    name: string,
    type: MenuItemType,
    parentId?: string
  ) => void
  onItemClick?: (itemTitle: string) => void
  hasEditPermission?: boolean
  parentId?: string
}

export interface SidebarComponentProps {
  menuStructure: MenuStructure
  onAddChild: (parentId: string, type: MenuItemType) => void
  onRemoveItem: (id: string, parentId?: string, type?: MenuItemType) => void
  onEditItem: (
    id: string,
    name: string,
    type: MenuItemType,
    parentId?: string
  ) => void
  onItemClick?: (itemTitle: string) => void
  hasEditPermission?: boolean
}

export interface MainContentComponentProps {
  onSave: (
    title: string,
    description: string,
    editingItem?: EditingItem
  ) => void
  onCancel: () => void
  editingItem?: EditingItem & { description?: string }
  action_control: {
    formType?: string
    formId?: string
    menuId?: string
    formName?: string
    permissions: Array<{
      action: string
      trigger_status_id?: string
    }>
  },
  isLoading?: boolean
  taskComments?: Array<{
    comment: string
    date: string
    ref_id: number | null
    comment_type: string | null
    comment_order: number | null
    user_id: number
    firstName: string
    lastName: string
  }>
  reviewerList?: Array<{
    user_id: number
    first_name: string
    last_name: string
  }>
  blockTitle?: string
  onPermissionChange?: (hasPermission: boolean) => void
}

export interface UpsertMainBlockPayload {
  project_id: number
  title: string
  description: string
  functional_block_id?: number
}

export interface UpsertSubBlockPayload {
  functional_block_id: number
  title: string
  description: string
  functional_sub_block_id?: number
}

export interface AppError {
  message: string
}
