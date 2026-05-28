'use client'
import React from 'react'
import {
  MenuItemType,
  SidebarComponentProps,
} from '@/types/modules/dnd/functionalBlock'
import {
  SidebarContainer,
  SidebarInner,
  SidebarContent,
  MenuContainer,
} from '@/styles/modules/dnd/functionalBlock'
import { FUNCTIONAL_BLOCK_CONSTANTS } from '@/constants/modules/dnd/functionBlock'
import MenuItemComponent from './MenuItem'

const { GENERAL } = FUNCTIONAL_BLOCK_CONSTANTS

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  menuStructure,
  onAddChild,
  onRemoveItem,
  onEditItem,
  onItemClick,
  hasEditPermission = true,
}) => {
  if (!menuStructure) {
    return null
  }
  const rootItem = {
    id: GENERAL.ROOT_ID,
    name: menuStructure.productname,
    menu: menuStructure.menu,
    isproduct: String(true),
  }

  return (
    <SidebarContainer>
      <SidebarInner>
        <SidebarContent>
          <MenuContainer>
            <MenuItemComponent
              item={rootItem}
              type={MenuItemType.PRODUCT}
              onAddChild={onAddChild}
              onRemove={onRemoveItem}
              onEdit={onEditItem}
              onItemClick={onItemClick}
              hasEditPermission={hasEditPermission}
            />
          </MenuContainer>
        </SidebarContent>
      </SidebarInner>
    </SidebarContainer>
  )
}

export default SidebarComponent
