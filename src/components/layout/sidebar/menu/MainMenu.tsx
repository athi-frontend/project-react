'use client'
import React, { useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from '@mui/material'
import { ArrowDown2, ArrowUp2 } from 'iconsax-react'
import { MenuItem, Submenu } from '@/types/components/layout/sidebar'
import { HoverText ,listItemButtonStyle} from '@/styles/components/ui/hover'
import SubmenuComponent from '../menu/SubMenu'
import Link from 'next/link'
import { NUMBERMAP } from '@/constants/common'
import {
  CUSTOM_MENU_PANEL_CLASS,
  MENU_RIGHT_PANEL_CLASS,
  MENU_PANEL_CLASS,
  TEXT_SECONDARY_COLOR,
  DEFAULT_LINK,
  CURRENT_COLOR,
  DIV_ELEMENT,
} from '@/constants/components/menu'
import { useDispatch } from 'react-redux'
import { setCurrentMenuId } from '@/store/slices/menuSlice'

/**
 * Classification: Confidential
 */

const Menu = ({
  open,
  activeMenu,
  setActiveMenu,
  menuPanelRef,
  menuItems,
}: {
  open: boolean
  activeMenu: number | null
  setActiveMenu: (id: number | null) => void
  menuPanelRef: any
  menuItems: MenuItem[]
}) => {
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null)
  const dispatch = useDispatch()

  const toggleSubmenu = (submenuId: string) => {
    setActiveSubmenuId((prev) => (prev === submenuId ? null : submenuId))
  }
  const pathValidator = (basePath:string,label:string)=>{
    return (label == 'User Onboarding'?null:basePath)
  }
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      className={CUSTOM_MENU_PANEL_CLASS}
      ref={menuPanelRef}
    >
      <List component="nav" className={MENU_RIGHT_PANEL_CLASS}>
        {menuItems?.map((item: MenuItem) => (
          <Box key={item.id} color={TEXT_SECONDARY_COLOR}>
            <ListItem disablePadding className={MENU_PANEL_CLASS}>
              <ListItemButton
                sx={listItemButtonStyle}
                onClick={() =>
                  setActiveMenu(activeMenu === item.id ? null : item.id)
                }
              >
                <Link onClick={()=>{
                  dispatch(setCurrentMenuId({menu_id:item.id}))
                }} href={pathValidator(item.basePath,item.label) ? `/${item.basePath}`: DEFAULT_LINK}>
                  <ListItemText primary={item.label} />
                </Link>
                {item.submenu.length > NUMBERMAP.ZERO &&
                  (activeMenu === item.id ? (
                    <ArrowDown2
                      size={NUMBERMAP.EIGHTEEN}
                      color={CURRENT_COLOR}
                    />
                  ) : (
                    <ArrowUp2 size={NUMBERMAP.EIGHTEEN} color={CURRENT_COLOR} />
                  ))}
              </ListItemButton>
            </ListItem>
            {item.submenu.length > NUMBERMAP.ZERO && activeMenu === item.id && (
              <Collapse
                in={activeMenu === item.id}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.submenu.map((sub: Submenu) => (
                    <HoverText key={sub.id} as={DIV_ELEMENT}>
                      <SubmenuComponent
                        menu_id = {item.id}
                        sub={sub}
                        basePath={item.basePath}
                        isOpen={activeSubmenuId === sub.id.toString()}
                        onToggle={() => toggleSubmenu(sub.id.toString())}
                      />
                    </HoverText>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
    </Drawer>
  )
}

export default Menu
