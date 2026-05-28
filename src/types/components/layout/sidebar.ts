import React from 'react'
import {
  MenuStructure,
  MenuItemType,
} from '@/types/modules/dnd/functionalBlock'

export interface Activity {
  activity_id: number
  name: string
  label: string | null
}

export interface ApiMenu {
  menu_id: number
  name: string
  slug: string | null
  url: string | null
  hierarchy: string
  instance_hierarchy?: string
  order: number
  menu_type: string
  activities: Activity[]
}

export interface MenuApiResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: {
    user_id: number
    last_login: string
    roles: { name: string; slug: string | null; role_id: number }[]
    menus: ApiMenu[]
  }
}

export interface NestedSubmenu {
  id: number
  label: string
  path: string
}

export interface Submenu {
  id: number
  label: string
  path: string
  submenu: NestedSubmenu[]
}

export interface MenuItem {
  id: number
  icon: React.ReactNode
  label: string
  basePath: string
  submenu: Submenu[]
}

export interface SidebarComponentProps {
  menuStructure: MenuStructure
  onAddChild: (parentId: string, type: MenuItemType) => void
  onRemoveItem: (id: string, parentId?: string) => void
  onEditItem: (
    id: string,
    name: string,
    type: MenuItemType,
    parentId?: string
  ) => void
}

export interface BreadcrumbItem{
    name: string;
    url: string;
} 

