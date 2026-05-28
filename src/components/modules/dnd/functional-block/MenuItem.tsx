'use client'
import React, { useState } from 'react'
import { Box, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import EditIcon from '@mui/icons-material/Edit'
import {
  MenuItem,
  ChildMenuItem,
  MenuItemType,
  MenuItemComponentProps,
} from '@/types/modules/dnd/functionalBlock'
import {
  ItemContainer,
  ItemHeader,
  ItemContent,
  ItemName,
  ActionButtons,
  ChildrenContainer,
  ChildItem,
  StyledIconButton,
} from '@/styles/modules/dnd/functionalBlock'
import { FUNCTIONAL_BLOCK_CONSTANTS } from '@/constants/modules/dnd/functionBlock'
import { getTypeChecks } from '@/lib/modules/dnd/functionBlock'
import { showActionAlert } from '@/components/ui'
import { PaddingLeft } from '@/styles/components/ui/sidebar'

const { GENERAL, TOOLTIPS, SIZES, PROPERTYKEYS } = FUNCTIONAL_BLOCK_CONSTANTS

interface ProductMenuItem extends MenuItem {
  [PROPERTYKEYS.PROPERTY_KEY_MENU]?: MenuItem[]
}

const hasMenuProperty = (item: MenuItem): item is ProductMenuItem => {
  return (
    PROPERTYKEYS.PROPERTY_KEY_MENU in item &&
    Array.isArray(item[PROPERTYKEYS.PROPERTY_KEY_MENU])
  )
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  type,
  onAddChild,
  onRemove,
  onEdit,
  onItemClick,
  hasEditPermission,
  parentId,
}) => {
  const [expanded, setExpanded] = useState<boolean>(
    type === MenuItemType.PRODUCT || type === MenuItemType.MAIN
  )
  const typeChecks = getTypeChecks(type)

  const hasChildren =
    typeChecks.isMainBlock &&
    PROPERTYKEYS.PROPERTY_KEY_CHILD in item &&
    Array.isArray(item[PROPERTYKEYS.PROPERTY_KEY_CHILD]) &&
    item[PROPERTYKEYS.PROPERTY_KEY_CHILD]!.length > 0

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasChildren || typeChecks.isProduct) {
      setExpanded(!expanded)
    }
  }

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddChild(item.id, type)
  }

  const handleRemoveClick = (
    e: React.MouseEvent,
    id: string,
    itemType: MenuItemType
  ) => {
    e.stopPropagation()
    showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.DELETE).then(
      (result) => {
        if (result.isConfirmed) {
          onRemove(id, parentId, itemType)
        }
      }
    )
  }

  const renderExpandIcon = () => {
    if (hasChildren || typeChecks.isProduct) {
      return expanded ? (
        <ExpandLessIcon fontSize={SIZES.SIZE_SMALL} />
      ) : (
        <ExpandMoreIcon fontSize={SIZES.SIZE_SMALL} />
      )
    }
    return <Box sx={PaddingLeft} />
  }

  return (
    <ItemContainer>
      <ItemHeader
        $isProduct={typeChecks.isProduct}
        onClick={handleToggleExpand}
      >
        <ItemContent>
          {renderExpandIcon()}
          <ItemName
            $isProduct={typeChecks.isProduct}
            onClick={(e) => {
              e.stopPropagation()
              if (typeChecks.isMainBlock) {
                onEdit(item.id, item.name, type)
                onItemClick?.(item.name)
              }
            }}
          >
            {item.name}
          </ItemName>
        </ItemContent>
        <ActionButtons>
          {(typeChecks.isProduct || typeChecks.isMainBlock) && (
            <Tooltip title={TOOLTIPS.TOOLTIP_TITLE_ADD_ITEM}>
              <StyledIconButton
                size={SIZES.SIZE_SMALL}
                onClick={handleAddChild}
              >
                <AddIcon fontSize={SIZES.SIZE_SMALL} />
              </StyledIconButton>
            </Tooltip>
          )}
          {!typeChecks.isProduct && (
            <Tooltip title={TOOLTIPS.TOOLTIP_TITLE_REMOVE}>
              <StyledIconButton
                size={SIZES.SIZE_SMALL}
                onClick={(e) => handleRemoveClick(e, item.id, type)}
                sx={{ pointerEvents: !hasEditPermission ? 'none' : 'auto' }}
              >
                <CloseIcon fontSize={SIZES.SIZE_SMALL} />
              </StyledIconButton>
            </Tooltip>
          )}
        </ActionButtons>
      </ItemHeader>

      {typeChecks.isProduct && (
        <ChildrenContainer expanded={expanded}>
          {hasMenuProperty(item) &&
            item[PROPERTYKEYS.PROPERTY_KEY_MENU]?.map((mainBlock) => (
              <MenuItemComponent
                key={mainBlock.id}
                item={mainBlock}
                type={MenuItemType.MAIN}
                onAddChild={onAddChild}
                onRemove={onRemove}
                onEdit={onEdit}
                onItemClick={onItemClick}
                hasEditPermission={hasEditPermission}
                parentId={item.id}
              />
            ))}
        </ChildrenContainer>
      )}

      {typeChecks.isMainBlock && hasChildren && (
        <ChildrenContainer expanded={expanded}>
          {(item[PROPERTYKEYS.PROPERTY_KEY_CHILD] as ChildMenuItem[]).map(
            (child: ChildMenuItem) => (
              <ChildItem key={child.id}>
                <ItemName
                  sx={{ paddingLeft: '25px' }}
                  onClick={() => {
                    onEdit(child.id, child.name, MenuItemType.CHILD, item.id)
                    onItemClick?.(child.name)
                  }}
                >
                  {child.name}
                </ItemName>
                <Box>
                  <StyledIconButton
                    size={SIZES.SIZE_SMALL}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(child.id, child.name, MenuItemType.CHILD, item.id)
                      onItemClick?.(child.name)
                    }}
                  >
                    <EditIcon fontSize={SIZES.SIZE_SMALL} />
                  </StyledIconButton>
                  <StyledIconButton
                    size={SIZES.SIZE_SMALL}
                    onClick={(e) =>
                      handleRemoveClick(e, child.id, MenuItemType.CHILD)
                    }
                    sx={{ pointerEvents: !hasEditPermission ? 'none' : 'auto' }}
                  >
                    <CloseIcon fontSize={SIZES.SIZE_SMALL} />
                  </StyledIconButton>
                </Box>
              </ChildItem>
            )
          )}
        </ChildrenContainer>
      )}
    </ItemContainer>
  )
}

export default MenuItemComponent
