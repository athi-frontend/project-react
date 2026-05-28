'use client'
import React, { useEffect, useState } from 'react'
import {
  SectionHeader,
  SectionTitle,
  SectionContent,
  NestedItemStyle,
  PaddingLeft,
} from '@/styles/components/ui/sidebar'
import { SidebarSectionProps } from '@/types/components/modules/stepper'
import SidebarItem from './SidebarItem'
import {
  ExpandLess,
  ExpandMore,
  CheckCircle,
  Pending,
  Error,
} from '@mui/icons-material'
import { usePathname, useRouter } from 'next/navigation'
import { NUMBERMAP } from '@/constants/common'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentMenuId, setCurrentMenuId } from '@/store/slices/menuSlice'
const SidebarSection: React.FC<SidebarSectionProps> = ({
  AccessedSection,
  currentSection,
  title,
  isExpanded = false,
  isActive = false,
  items = [],
  onToggle,
  onItemClick,
}) => {
  const route = useRouter()
  const currentMenuId = useSelector(selectCurrentMenuId)
  const dispatch = useDispatch()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const handlePageRoute = (path: string, menu_id: null | number) => {
    dispatch(setCurrentMenuId({ menu_id: menu_id }))
    const routePath = `${path}`
    route.push(routePath)
  }

  const pathName = usePathname()

  const getStatusIcon = (index: number, itemsArray: any[] = items) => {
    const currentItem = itemsArray[index]
    if (!currentItem?.path || currentItem.path === '#') {
      return <Error color="info" />
    }

    // Find the current active item based on path - use startsWith for partial matching
    // Find all matching items first, then get the most specific one (longest path)
    const matchingItems = itemsArray
      .map((item, idx) => ({ item, index: idx }))
      .filter(({ item }) => {
        if (!item.path || item.path === '#') return false
        // Normalize paths with trailing slashes to prevent partial matches
        const normalizedItemPath = item.path.endsWith('/') ? item.path : `${item.path}/`
        const normalizedPathName = pathName.endsWith('/') ? pathName : `${pathName}/`
        return normalizedPathName.startsWith(normalizedItemPath) ?? pathName === item.path
      })
      .sort((a, b) => b.item.path.length - a.item.path.length) // Sort by path length (most specific first)

    const currentActiveIndex = matchingItems.length > NUMBERMAP.ZERO ? matchingItems[NUMBERMAP.ZERO].index : -1

    if (currentActiveIndex === -1) {
      // If no matching path found, default to error
      return <Error color="info" />
    }
    if (index < currentActiveIndex) {
      // Items before the current active item
      return <CheckCircle color="secondary" />
    } else if (index === currentActiveIndex) {
      // Current active item
      return <Pending color="secondary" />
    } else {
      // Items after the current active item
      return <Error color="info" />
    }
  }

  const renderExpandedIcon = () => {
    return <ExpandLess />;
  };

  const renderCollapsedIcon = () => {
    return <ExpandMore />;
  };


  const handleCurrentActiveMenu = () => {
    /**
     * Find the most specific matching menu item for the current pathname
     * This function handles both top-level and nested menu items
     */
    
    // Step 1: Find all menu items that match the current pathname
    const matchingMenus = items
      .map((menu: any, idx: number) => ({ menu, index: idx }))
      .filter(({ menu }: { menu: any }) => {
        // Check nested menu items
        if (menu.items) {
          return menu.items.some((submenu: any) => 
            submenu?.path && pathName.startsWith(submenu.path)
          )
        }
        
        // Check top-level menu items
        if (!menu.path || menu.path === '#') return false
        return pathName.startsWith(menu.path)
      })
      .sort((a: any, b: any) => b.menu.path.length - a.menu.path.length) // Most specific path first

    // Step 2: Handle route replacement only if no menu_id is present
    if (matchingMenus.length > NUMBERMAP.ZERO && !currentMenuId) {
      const mostSpecificMatch = matchingMenus[NUMBERMAP.ZERO]
      
      if (mostSpecificMatch.menu.items) {
        // Handle nested menu: find the specific submenu that matches
        const matchingSubmenu = mostSpecificMatch.menu.items.find((submenu: any) => 
          submenu?.path && pathName.startsWith(submenu.path)
        )
        if (matchingSubmenu?.path) {
          dispatch(setCurrentMenuId({ menu_id: matchingSubmenu.menu_id }))
        }
      } else if (mostSpecificMatch.menu.path) {
        // Handle top-level menu item
        dispatch(setCurrentMenuId({ menu_id: mostSpecificMatch.menu.menu_id }))
      }
    }

    // Step 3: Update UI state for the most specific match
    if (matchingMenus.length > NUMBERMAP.ZERO && onItemClick) {
      onItemClick(matchingMenus[NUMBERMAP.ZERO].index)
    }
  }

  const handleNestedItemToggle = (itemIndex: number) => {
    const itemKey = `item-${itemIndex}`
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemKey)) {
      newExpanded.delete(itemKey)
    } else {
      newExpanded.add(itemKey)
    }
    setExpandedItems(newExpanded)
  }

  const renderNestedItems = (nestedItems: any[], level: number = NUMBERMAP.ONE, parentKey: string = '') => {
    return nestedItems.map((nestedItem, nestedIndex) => {
      const itemKey = `${parentKey}-nested-${nestedIndex}`
      const hasNestedChildren = nestedItem.items && nestedItem.items.length > NUMBERMAP.ZERO
      const isNestedExpanded = expandedItems.has(itemKey)
      return (
        <div key={itemKey} style={NestedItemStyle(level,NUMBERMAP.FIVE)}>
          {hasNestedChildren ? (
            <div>
              <SidebarItem
                label={nestedItem.title ?? nestedItem.label}
                icon={isNestedExpanded ? <ExpandLess /> : <ExpandMore />}
                path={nestedItem.path ?? "#"}
                isActive={false}
                onClick={() => {
                  // If the nested item has a valid URL, navigate to it first
                  if (nestedItem.path && nestedItem.path !== '#') {
                    handlePageRoute(nestedItem.path, nestedItem?.menu_id ?? null)
                  }
                  // Then toggle the nested items
                  const newExpanded = new Set(expandedItems)
                  if (newExpanded.has(itemKey)) {
                    newExpanded.delete(itemKey)
                  } else {
                    newExpanded.add(itemKey)
                  }
                  setExpandedItems(newExpanded)
                }}
              />
              {/* Render nested children if expanded */}
              {isNestedExpanded && renderNestedItems(nestedItem.items, level + NUMBERMAP.ONE, itemKey)}
            </div>
          ) : (
            <SidebarItem
              label={nestedItem.label}
              path={nestedItem.path}
              icon={getStatusIcon(nestedIndex, nestedItems)}
              isActive={false}
              onClick={() => {
                if (nestedItem.path && nestedItem.path !== '#') {
                  handlePageRoute(nestedItem.path, nestedItem?.menu_id ?? null)
                }
              }}
            />
          )}
        </div>
      )
    })
  }

  useEffect(() => {
    handleCurrentActiveMenu()
  }, [pathName])

  return (
    <section>
      <SectionHeader
        sx={(theme) => ({
          backgroundColor: isActive ? theme.palette.background.default : 'transparent',
          textTransform: 'none',
        })}
        onClick={onToggle}
      >
        <SectionTitle
          sx={(theme) => ({
            color: isActive
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
          })}
        >
          {title}
        </SectionTitle>
        {isExpanded ? (
          <ExpandLess
            sx={(theme) => ({
              color: theme.palette.text.primary,
            })}
          />
        ) : (
          <ExpandMore
            sx={(theme) => ({
              color: theme.palette.text.secondary,
            })}
          />
        )}
      </SectionHeader>

      {isExpanded && items.length > NUMBERMAP.ZERO && (
        <SectionContent>
          {items.map((item: any, index) => {
            const hasNested = item.hasNested || (item.items && item.items.length > NUMBERMAP.ZERO)
            const isItemExpanded = expandedItems.has(`item-${index}`)
            const icon = isItemExpanded ? renderExpandedIcon() : renderCollapsedIcon();

            return (
              <div key={`${title}-item-${index}`}>
                <SidebarItem
                  label={item.label ?? item.title}
                  path={item.path ?? "#"}
                  icon={hasNested ? icon : getStatusIcon(index)}
                  isActive={!hasNested && item.isActive}
                  onClick={() => {
                    if (hasNested) {
                      // For top-level items with nested children, only toggle expansion (no navigation)
                      handleNestedItemToggle(index)
                    } else {
                      // For leaf items (no children), navigate if valid URL
                      if (item.path && item.path !== '#') {
                        handlePageRoute(item.path, item.menu_id ?? null)
                      }
                      // For regular items, call onItemClick
                      if (onItemClick) {
                        onItemClick(index)
                      }
                    }
                  }}
                />

                {/* Render nested items if expanded */}
                {hasNested && isItemExpanded && item.items && (
                  <div style={PaddingLeft}>
                    {renderNestedItems(item.items, NUMBERMAP.ONE, `item-${index}`)}
                  </div>
                )}
              </div>
            )
          })}
        </SectionContent>
      )}
    </section>
  )
}

export default SidebarSection
