import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  List,
} from '@mui/material'
import { Add, Minus } from 'iconsax-react'
import { Submenu, NestedSubmenu } from '@/types/components/layout/sidebar'
import Link from 'next/link'
import { SubMenu } from '@/styles/components/ui/hover'
import { NUMBERMAP } from '@/constants/common'
import { useDispatch } from 'react-redux'
import { setCurrentMenuId } from '@/store/slices/menuSlice'

/**
 * Classification: Confidential
 */

interface SubmenuComponentProps {
  menu_id: number
  sub: Submenu
  basePath: string
  isOpen: boolean
  onToggle: () => void
}
const trimSlashes = (str: string) => {
  let start = NUMBERMAP.ZERO
  let end = str.length - NUMBERMAP.ONE

  while (str[start] === '/') start++

  while (str[end] === '/') end--

  return str.slice(start, end + 1)
}

const SubmenuComponent = ({
  menu_id,
  sub,
  basePath,
  isOpen,
  onToggle,
}: SubmenuComponentProps) => {
  const dispatch = useDispatch()

  const getFullPath = (
    path: string | undefined,
    isThirdLevel: boolean = false
  ) => {
    if (!path) return basePath ?? '/'
    const cleanBasePath = trimSlashes(basePath)
    const cleanSubPath = trimSlashes(sub.path)
    const cleanPath = trimSlashes(path)

    if (isThirdLevel) {
      return `/${cleanBasePath}/${cleanSubPath}/${cleanPath}`
    }

    return `/${cleanBasePath}/${cleanPath}`
  }


  const getPath = (path: string) => {
    const URL = path ? "/" + path : '#'
    return URL
  }
  return (
    <Box key={sub.id} className="nested-submenu" color="text.primary">
      <ListItem disablePadding>
        <ListItemButton onClick={onToggle} sx={{ pl: NUMBERMAP.THREE }}>
          <Link onClick={() => {
            dispatch(setCurrentMenuId({ menu_id: menu_id }))
          }} href={getPath(sub.path)} className="nested-subMenu-1">
            <ListItemText primary={sub.label} />
          </Link>
          {sub.submenu.length > 0 &&
            (isOpen ? (
              <Minus size={NUMBERMAP.EIGHTEEN} color="currentColor" />
            ) : (
              <Add size={NUMBERMAP.EIGHTEEN} color="currentColor" />
            ))}
        </ListItemButton>
      </ListItem>
      {sub.submenu.length > 0 && isOpen && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {sub.submenu.map((nested: NestedSubmenu, index: number) => (
              <ListItem
                key={`${nested.id}-${index}`}
                disablePadding
                component="div"
              >
                <ListItemButton
                  component={Link}
                  onClick={() => {

                    dispatch(setCurrentMenuId({ menu_id: menu_id }))
                  }}
                  href={getFullPath(nested.path, true)}
                  sx={{ pl: NUMBERMAP.TWO }}
                  className="nested-subMenu-2"
                >
                  <SubMenu as={'div'} sx={{ color: 'text.primary' }}>
                    <ListItemText primary={nested.label} />
                  </SubMenu>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  )
}

export default SubmenuComponent
