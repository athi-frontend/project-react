/**
*Classification : Confidential
*/

'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  useTheme,
  Typography,
} from '@mui/material'
import {
  ArrowRight2,
  ArrowLeft2,
  Element4,
  DocumentText,
  TickSquare,
  Setting2,
  UserSquare,
} from 'iconsax-react'
import { HoverIcon, VersionControlMain } from '@/styles/components/ui/hover'
import {
  MenuItem,
  MenuApiResponse,
  Submenu,
} from '@/types/components/layout/sidebar'
import { useMenuData } from '@/hooks/modules/dnd/useMenu'
import {
  DIV,
  LEFT,
  MENU_CONSTANTS,
  MOUSEDOWN,
  OUTLINE,
  PERMANENT,
  RELATIVE,
} from '@/constants/components/menu'
import Menu from './menu/MainMenu'
import { setUserData, setMenuData, setProfileData, setCurrentMenuId, selectMenuData , setCurrentSlug} from '@/store/slices/menuSlice'
import { useDispatch, useSelector } from 'react-redux'
import { apiClient } from '@/shared/apiClient'
import { NUMBERMAP } from '@/constants/common'
import { startCriticalRequest, finishCriticalRequest } from '@/lib/utils/common'
import { collectMenuUrls, isPathAllowed, findMenuObjectByPath } from '@/lib/utils/menu'
import { Version } from '@/config/site'
import { notFound, usePathname, useRouter } from 'next/navigation'

import { useProfilePictureFetch } from '@/hooks/modules/user/useSetting'
const getIconFromName = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes(MENU_CONSTANTS.ICON_DESIGN))
    return (
      <Element4
        variant={OUTLINE}
        size={MENU_CONSTANTS.ICON_SIZE}
        color={MENU_CONSTANTS.ICON_COLOR}
      />
    )
  if (lowerName.includes(MENU_CONSTANTS.ICON_PROJECT))
    return (
      <DocumentText
        variant={OUTLINE}
        size={MENU_CONSTANTS.ICON_SIZE}
        color={MENU_CONSTANTS.ICON_COLOR}
      />
    )
  if (lowerName.includes(MENU_CONSTANTS.ICON_PLAN))
    return (
      <TickSquare
        variant={OUTLINE}
        size={MENU_CONSTANTS.ICON_SIZE}
        color={MENU_CONSTANTS.ICON_COLOR}
      />
    )
  return (
    <Setting2
      variant={OUTLINE}
      size={MENU_CONSTANTS.ICON_SIZE}
      color={MENU_CONSTANTS.ICON_COLOR}
    />
  )
}

const buildMenuTree = (menus: MenuApiResponse['data']['menus']): MenuItem[] => {
  const menuMap = new Map<
    number,
    MenuItem & { hierarchy: string; submenus: Submenu[] }
  >()
  const mainMenus: MenuItem[] = []

  menus.forEach((menu) => {
    const hierarchyParts = menu.hierarchy
      ?.split(MENU_CONSTANTS.HIERARCHY_SEPARATOR)
      .map(Number)
    if (hierarchyParts.some(isNaN)) {
      return
    }

    const menuItem: MenuItem & { hierarchy: string; submenus: Submenu[] } = {
      id: menu.menu_id,
      icon: getIconFromName(menu.name),
      label: menu.name,
      basePath:
        menu.url ?? '',
      submenu: [],
      hierarchy: menu.hierarchy,
      submenus: [],
    }
    menuMap.set(menu.menu_id, menuItem)

    if (hierarchyParts.length === NUMBERMAP.ONE) {
      mainMenus.push(menuItem)
    }
  })

  menus.forEach((menu) => {
    const hierarchyParts = menu.hierarchy
      .split(MENU_CONSTANTS.HIERARCHY_SEPARATOR)
      .map(Number)
    
    if (hierarchyParts.length === NUMBERMAP.TWO) {
      const parentId = hierarchyParts[NUMBERMAP.ZERO]
      const parent = menuMap.get(parentId)
      
      if (parent && menu.menu_type === "Side Bar") {
        parent.submenus.push({
          id: menu.menu_id,
          label: menu.name,
          path:
            menu.url ??
            `/${menu.name.toLowerCase().replace(MENU_CONSTANTS.REGEX, MENU_CONSTANTS.URL_DASH)}`,
          submenu: [],
        })
      }
    } else if (hierarchyParts.length === NUMBERMAP.THREE) {
      const submenuId = hierarchyParts[1]
      const parent = Array.from(menuMap.values()).find((item) =>
        item.submenus.some((sub) => sub.id === submenuId)
      )
      if (parent && menu.menu_type === "Side Bar") {
        const submenu = parent.submenus.find((sub) => sub.id === submenuId)
        if (submenu) {
          submenu.submenu.push({
            id: menu.menu_id,
            label: menu.name,
            path:
              menu.url ??
              `/${menu.name.toLowerCase().replace(MENU_CONSTANTS.REGEX, MENU_CONSTANTS.URL_DASH)}`,
          })
        }
      }
    }
  })
  mainMenus.forEach((mainMenu) => {
    const menuData = menuMap.get(mainMenu.id)
    if (menuData) {
      mainMenu.submenu = menuData.submenus.sort((a, b) => a.id - b.id)
      mainMenu.submenu.forEach((submenu) => {
        submenu.submenu.sort((a, b) => a.id - b.id)
      })
    }
  })
  return mainMenus
}

const Sidebar = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [userId, setuserId] = useState(null)

  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const menuPanelRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()
  const { data } = useMenuData()
  const menuData = useSelector(selectMenuData);

  const { data: profileData } = useProfilePictureFetch(userId)
  
  const theme = useTheme()
  const pathname = usePathname()  
  const menuItems: MenuItem[] =
    data?.data?.menus && data.data.menus.length > NUMBERMAP.ZERO
      ? buildMenuTree(data.data.menus)
      : []
  startCriticalRequest()
  useEffect(() => {
    if (data?.data) {
      const userData = data.data
      if (userData.user_id && userData.roles.length > NUMBERMAP.ZERO) {
        const roleId = userData.roles[NUMBERMAP.ZERO].role_id
        apiClient.defaults.headers.common['role_id'] = roleId  
        setuserId(data?.data?.user_id)
        dispatch(setUserData({ user_id: data.data.user_id, role_id: roleId }))
        finishCriticalRequest(roleId.toString(), '' , userData?.org_id ?? '')
      }
      if (userData.menus && userData.menus.length > NUMBERMAP.ZERO) {
        dispatch(setMenuData(userData.menus))
      }
    }
  }, [data])

  const menuIdUpdate = useCallback(() => {
    const menuDataList = menuData ?? data?.data?.menus;
    if (pathname && menuDataList && menuDataList.length > NUMBERMAP.ZERO) {
      const currentMenuObj = findMenuObjectByPath(pathname, menuDataList)
        dispatch(setCurrentMenuId({ menu_id: currentMenuObj?.menu_id ?? null }));
        dispatch(setCurrentSlug({ slug: currentMenuObj?.slug ?? '' }));
    }
  }, [pathname, data, dispatch, menuData])

useEffect(() => {
  if (!pathname || pathname === '/' || !data?.data?.menus?.length) {
    return;
  }
 
  const allMenuUrls = collectMenuUrls(data.data.menus);
  const isAllowed = isPathAllowed(pathname, allMenuUrls);
 
  if (!isAllowed) {
    notFound();
  }
  menuIdUpdate()
}, [pathname, data, menuData]);

  useEffect(()=>{
    dispatch(setProfileData(profileData))
  },[profileData])

 const toggleMenuVisibility = () => {
    setIsMenuVisible((prev) => !prev)
    setActiveMenu(null)
  }

  const handleMenuHover = (id: number) => {
    if (activeMenu !== id) {
      setActiveMenu(id)
      setIsMenuVisible(true)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        menuPanelRef.current &&
        !menuPanelRef.current.contains(event.target as Node)
      ) {
        setIsMenuVisible(false)
        setActiveMenu(null)
      }
    }

    if (isMenuVisible) {
      document.addEventListener(MOUSEDOWN, handleClickOutside)
    }
    return () => document.removeEventListener(MOUSEDOWN, handleClickOutside)
  }, [isMenuVisible])

  return (
    <Box position={RELATIVE} className={MENU_CONSTANTS.BOX_CLASS}>
      <Drawer
        variant={PERMANENT}
        anchor={LEFT}
        className={MENU_CONSTANTS.DRAWER_CLASS}
        ref={sidebarRef}
      >
        <List>
          {menuItems.map((item: MenuItem) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                className={MENU_CONSTANTS.LIST_ITEM_BUTTON_CLASS}
                onMouseEnter={() => handleMenuHover(item.id)}
                selected={activeMenu === item.id}
                onClick={() => {
                  router.push((item.label == 'User Onboarding' ?null:item.basePath)?? '#')
                }}
              >
                <HoverIcon as={DIV}>
                  <ListItemIcon
                    className={`${MENU_CONSTANTS.LIST_ITEM_ICON_CLASS} ${activeMenu === item.id ? MENU_CONSTANTS.LIST_ITEM_ACTIVE_ICON_CLASS : ''}`}
                  >
                    {item.label == 'User Onboarding' ? (
                      <UserSquare
                        size={NUMBERMAP.TWENTYSIX}
                        color={theme.palette.text.secondary}
                      />
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                </HoverIcon>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={VersionControlMain}><Typography fontSize={NUMBERMAP.TEN}>{Version}</Typography></Box>
      </Drawer>

      <IconButton
        sx={{
          bgcolor: MENU_CONSTANTS.ICON_BUTTON_BGCOLOR,
          color: MENU_CONSTANTS.ICON_BUTTON_COLOR,
          '&:hover': { bgcolor: MENU_CONSTANTS.ICON_BUTTON_HOVER_BGCOLOR },
        }}
        onClick={toggleMenuVisibility}
        className={MENU_CONSTANTS.ICON_BUTTON_CLASS}
      >
        {isMenuVisible ? (
          <ArrowLeft2
            size={MENU_CONSTANTS.TOGGLE_ICON_SIZE}
            color={MENU_CONSTANTS.ICON_COLOR}
          />
        ) : (
          <ArrowRight2
            size={MENU_CONSTANTS.TOGGLE_ICON_SIZE}
            color={MENU_CONSTANTS.ICON_COLOR}
          />
        )}
      </IconButton>

      {isMenuVisible && (
        <Menu
          open={isMenuVisible}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          menuPanelRef={menuPanelRef}
          menuItems={menuItems}
        />
      )}
    </Box>
  )
}

export default Sidebar