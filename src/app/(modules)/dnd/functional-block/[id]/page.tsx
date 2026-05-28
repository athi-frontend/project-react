'use client'
import React, { useState } from 'react'
import { Grid2 } from '@mui/material'
import SidebarComponent from '@/components/modules/dnd/functional-block/Sidebar'
import MainContentComponent from '@/components/modules/dnd/functional-block/MainContent'
import { MenuItemType, EditingItem } from '@/types/modules/dnd/functionalBlock'
import { useParams,useRouter } from 'next/navigation'

import {
  useFetchFunctionalBlocksQuery,
  useFetchMainBlockQuery,
  useFetchSubBlockQuery,
  useMutateUpsertMainBlock,
  useMutateUpsertSubBlock,
  useMutateDeleteMainBlock,
  useMutateDeleteSubBlock,
  useResetQueryData,
} from '@/hooks/modules/dnd/useFunctionBlock'
import { PageContainer } from '@/styles/modules/dnd/functionalBlock'
import {
  FUNCTIONAL_BLOCK_CONSTANTS,
  USER_ERRORS,
} from '@/constants/modules/dnd/functionBlock'
import { isAppError } from '@/lib/modules/dnd/functionBlock'
import { showActionAlert } from '@/components/ui'
import { ROUTE_PATHS } from '@/constants/modules/dnd/project'
import GlobalLoader from '@/components/shared/LoadingSpinner'
/**
      *Classification : Confidential
**/
const { GENERAL, SIZES } = FUNCTIONAL_BLOCK_CONSTANTS

const InputDesign: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = Number(params.id)
  const [editingItem, setEditingItem] = useState<EditingItem | undefined>(
    GENERAL.INITIAL_STATE_UNDEFINED
  )
  const [addingToParentId, setAddingToParentId] = useState<string | null>(
    GENERAL.INITIAL_STATE_NULL
  )
  const [addingItemType, setAddingItemType] = useState<MenuItemType | null>(
    GENERAL.INITIAL_STATE_NULL
  )
  const [operationError, setOperationError] = useState<string | null>(null)
  const [blockTitle, setBlockTitle] = useState<string>('')
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(true)

  const { mutate: mutateUpsertMainBlock, isPending: isUpsertingMainBlock } = useMutateUpsertMainBlock(projectId)
  const { mutate: mutateUpsertSubBlock, isPending: isUpsertingSubBlock } = useMutateUpsertSubBlock(projectId)
  const { mutate: mutateDeleteMainBlock, isPending: isDeletingMainBlock } = useMutateDeleteMainBlock(projectId)
  const { mutate: mutateDeleteSubBlock, isPending: isDeletingSubBlock } = useMutateDeleteSubBlock(projectId)

  const resetQueryData = useResetQueryData()
  const { data: menuData, refetch: refetchMenuData, isLoading: isLoadingSpecifications, isFetching: isFetchingSpecifications } =
    useFetchFunctionalBlocksQuery(projectId)
  const { refetch: refetchMainBlock, isFetching: isFetchingMainBlock } = useFetchMainBlockQuery(editingItem?.id)
  const { refetch: refetchSubBlock, isFetching: isFetchingSubBlock } = useFetchSubBlockQuery(editingItem?.id)

  // Comprehensive loading state function
  const isAnyLoading = () => {
    if (isLoadingSpecifications) return true
    if (isFetchingSpecifications) return true
    if (isFetchingMainBlock) return true
    if (isFetchingSubBlock) return true
    if (isUpsertingMainBlock) return true
    if (isUpsertingSubBlock) return true
    if (isDeletingMainBlock) return true
    if (isDeletingSubBlock) return true
    return false
  }

  const getInitialDescription = (
    id: string,
    type: MenuItemType,
    parentId?: string
  ): string => {
    if (!menuData) return GENERAL.EMPTY_STRING
    if (type === MenuItemType.MAIN) {
      return (
        menuData.menu.find((item) => item.id === id)?.description ??
        GENERAL.EMPTY_STRING
      )
    }
    if (type === MenuItemType.CHILD && parentId) {
      const parentBlock = menuData.menu.find((item) => item.id === parentId)
      return (
        parentBlock?.child?.find((child) => child.id === id)?.description ??
        GENERAL.EMPTY_STRING
      )
    }
    return GENERAL.EMPTY_STRING
  }

  const handleAddMenuItem = (parentId: string, type: MenuItemType) => {
    /**
     * Function Name: handleAddMenuItem
     * Params: parentId,type
     * Description: used to add item in menu,
     * Author: Savitri K,
     * Modified: 4-09-2025,
     * Classification : Confidential
    **/
    setAddingToParentId(parentId)
    setAddingItemType(type)
    setEditingItem(GENERAL.INITIAL_STATE_UNDEFINED)
    setOperationError(null)
    
    // Set blockTitle based on the parent item being added to
    if (menuData) {
      if (parentId === GENERAL.ROOT_ID) {
        setBlockTitle(menuData.productname)
      } else {
        const parentItem = menuData.menu.find(item => item.id === parentId)
        if (parentItem) {
          setBlockTitle(parentItem.name)
        }
      }
    }
  }

  const handleEditChildBlockData = async (
    id: string,
    name: string,
    parentId: string,
    initialDescription: string
  ): Promise<boolean> => {
    const { data: subBlockData, error } = await refetchSubBlock()
    if (error) {
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: `${USER_ERRORS.FAILED_EDIT_ITEM}${error.message}`,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
      return false
    }
    if (!subBlockData) {
      return false
    }
    setEditingItem({
      id,
      name: subBlockData.title ?? name,
      type: MenuItemType.CHILD,
      parentId,
      description: subBlockData.description ?? initialDescription,
    })
    return true
  }

  const handleEditMainBlockData = async (
    id: string,
    name: string,
    initialDescription: string
  ): Promise<boolean> => {
    const { data: mainBlockData, error } = await refetchMainBlock()
    if (error) {
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: `${USER_ERRORS.FAILED_EDIT_ITEM}${error.message}`,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
      return false
    }
    if (!mainBlockData) {
      return false
    }
    setEditingItem({
      id,
      name: mainBlockData.title ?? name,
      type: MenuItemType.MAIN,
      description: mainBlockData.description ?? initialDescription,
    })
    return true
  }

  const handleEditMenuItem = async (
    id: string,
    name: string,
    type: MenuItemType,
    parentId?: string
  ) => {
    if (!id || !name || !type) {
      return
    }

    const resetQueryDataAndState = () => {
      resetQueryData(editingItem?.id, editingItem?.id)
      setAddingToParentId(GENERAL.INITIAL_STATE_NULL)
      setAddingItemType(GENERAL.INITIAL_STATE_NULL)
    }

    const setInitialEditingItem = () => {
      const initialDescription = getInitialDescription(id, type, parentId)
      setEditingItem({
        id,
        name,
        type,
        parentId,
        description: initialDescription,
      })
      return initialDescription
    }

    resetQueryDataAndState()
    const initialDescription = setInitialEditingItem()

    try {
      let success: boolean
      if (type === MenuItemType.CHILD && parentId) {
        success = await handleEditChildBlockData(
          id,
          name,
          parentId,
          initialDescription
        )
      } else if (type === MenuItemType.MAIN) {
        success = await handleEditMainBlockData(id, name, initialDescription)
      } else {
        success = true
      }
      if (!success) return
    } catch (err: unknown) {
      const errorMessage = isAppError(err)
        ? err.message
        : USER_ERRORS.UNEXPECTED_ERROR
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: `${USER_ERRORS.FAILED_EDIT_ITEM}${errorMessage}`,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }

  const handleEditChildBlock = async (
    editItem: EditingItem,
    title: string,
    description: string
  ) => {
    if (!editItem.parentId) {
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: USER_ERRORS.INVALID_EDIT_PARAMETERS,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
      return
    }
    const parentId = parseInt(editItem.parentId)
    const subBlockId = parseInt(editItem.id)
    if (isNaN(parentId) || isNaN(subBlockId)) {
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: USER_ERRORS.INVALID_PARENT_OR_SUB_BLOCK_ID,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
      return
    }

    const parentBlock = menuData?.menu.find(
      (item) => item.id === editItem.parentId
    )
    if (
      parentBlock?.child?.some(
        (child) => child.name === title && child.id !== editItem.id
      )
    ) {
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: USER_ERRORS.SUB_MODULE_ALREADY_EXISTS,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
      return
    }
    mutateUpsertSubBlock(
      {
        functional_block_id: parentId,
        title,
        description,
        functional_sub_block_id: subBlockId,
      },
      {
        onSuccess: (data) => {
          resetQueryData(editItem.id, editItem.parentId)
          refetchMenuData()
          setEditingItem(GENERAL.INITIAL_STATE_UNDEFINED)
          showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SUCCESS)
        },
        onError: () => {
          showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
            title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
            text: USER_ERRORS.SUB_MODULE_ALREADY_EXISTS,
            icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
            cancelButton: false,
            confirmButton: false,
          })
        },
      }
    )
  }

  const handleEditMainBlock = async (
    editItem: EditingItem,
    title: string,
    description: string
  ) => {
    const blockId = parseInt(editItem.id)
    if (isNaN(blockId)) {
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: USER_ERRORS.INVALID_BLOCK_ID,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
      return
    }

    if (
      menuData?.menu.some(
        (item) => item.name === title && item.id !== editItem.id
      )
    ) {
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: USER_ERRORS.MODULE_ALREADY_EXISTS,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
      return
    }
    const payload = {
      project_id: projectId,
      title,
      description,
      functional_block_id: blockId,
    }
    mutateUpsertMainBlock(payload, {
      onSuccess: (data) => {
        resetQueryData(editItem.id, undefined)
        refetchMenuData()
        setEditingItem(GENERAL.INITIAL_STATE_UNDEFINED)
        showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SUCCESS)
      },
      onError: () => {
        showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
          title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
          text: USER_ERRORS.MODULE_ALREADY_EXISTS,
          icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
          cancelButton: false,
          confirmButton: false,
        })
      },
    })
  }

  const handleAddBlock = async (title: string, description: string) => {
    if (addingToParentId === GENERAL.ROOT_ID) {
      if (menuData?.menu.some((item) => item.name === title)) {
        showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
          title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
          text: USER_ERRORS.MODULE_ALREADY_EXISTS,
          icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
          cancelButton: false,
          confirmButton: false,
        })
        return
      }
      const payload = {
        project_id: projectId,
        title,
        description,
      }
      mutateUpsertMainBlock(payload, {
        onSuccess: () => {
          refetchMenuData()
          setEditingItem(GENERAL.INITIAL_STATE_UNDEFINED)
          showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SUCCESS)
        },
        onError: () => {
          showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
            title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
            text: USER_ERRORS.MODULE_ALREADY_EXISTS,
            icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
            cancelButton: false,
            confirmButton: false,
          })
        },
      })
    } else {
      if (addingToParentId === null) {
        showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
          title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
          text: USER_ERRORS.INVALID_SAVE_STATE_ADDING,
          icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
          cancelButton: false,
          confirmButton: false,
        })
        return
      }
      const parentId = parseInt(addingToParentId)
      if (isNaN(parentId)) {
        showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
          title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
          text: USER_ERRORS.INVALID_PARENT_ID,
          icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
          cancelButton: false,
          confirmButton: false,
        })
        return
      }

      const parentBlock = menuData?.menu.find(
        (item) => item.id === addingToParentId
      )
      if (parentBlock?.child?.some((child) => child.name === title)) {
        showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
          title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
          text: USER_ERRORS.SUB_MODULE_ALREADY_EXISTS,
          icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
          cancelButton: false,
          confirmButton: false,
        })
        return
      }
      const payload = {
        functional_block_id: parentId,
        title,
        description,
      }
      mutateUpsertSubBlock(payload, {
        onSuccess: () => {
          refetchMenuData()
          setEditingItem(GENERAL.INITIAL_STATE_UNDEFINED)
          showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SUCCESS)
        },
        onError: () => {
          showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
            title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
            text: USER_ERRORS.SUB_MODULE_ALREADY_EXISTS,
            icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
            cancelButton: false,
            confirmButton: false,
          })
        },
      })
    }
  }

  const handleSaveMenuItem = async (
    title: string,
    description: string,
    editItem?: EditingItem
  ) => {
    try {
      if (editItem) {
        if (editItem.type === MenuItemType.CHILD && editItem.parentId) {
          await handleEditChildBlock(editItem, title, description)
        } else if (editItem.type === MenuItemType.MAIN) {
          await handleEditMainBlock(editItem, title, description)
        }
      } else if (addingToParentId && addingItemType) {
        await handleAddBlock(title, description)
      } else {
        showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
          title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
          text: USER_ERRORS.INVALID_SAVE_STATE,
          icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
          cancelButton: false,
          confirmButton: false,
        })
      }
    } catch (err: unknown) {
      const errorMessage = isAppError(err)
        ? err.message
        : USER_ERRORS.UNEXPECTED_ERROR
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: `${USER_ERRORS.FAILED_SAVE_ITEM}${errorMessage}`,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
    } finally {
      setEditingItem(GENERAL.INITIAL_STATE_UNDEFINED)
      setAddingToParentId(GENERAL.INITIAL_STATE_NULL)
      setAddingItemType(GENERAL.INITIAL_STATE_NULL)
    }
  }

  const handleRemoveMenuItem = async (
    id: string,
    parentId?: string,
    type?: MenuItemType
  ) => {
    if (!id || !type) {
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: USER_ERRORS.INVALID_REMOVE_PARAMETERS,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
      return
    }
    try {
      if (type === MenuItemType.CHILD && parentId) {
        mutateDeleteSubBlock(id, {
          onSuccess: () => {
            refetchMenuData()
            setEditingItem(GENERAL.INITIAL_STATE_UNDEFINED)
            setAddingToParentId(GENERAL.INITIAL_STATE_NULL)
            setAddingItemType(GENERAL.INITIAL_STATE_NULL)
            setOperationError(null)
            showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SUCCESS)
          },
          onError: (error) => {
            showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
              title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
              text: USER_ERRORS.FAILED_DELETE_SUB_BLOCK,
              icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
              cancelButton: false,
              confirmButton: false,
            })
          },
        })
      } else if (type === MenuItemType.MAIN) {
        mutateDeleteMainBlock(id, {
          onSuccess: () => {
            refetchMenuData()
            setEditingItem(GENERAL.INITIAL_STATE_UNDEFINED)
            setAddingToParentId(GENERAL.INITIAL_STATE_NULL)
            setAddingItemType(GENERAL.INITIAL_STATE_NULL)
            setOperationError(null)
            showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SUCCESS)
          },
          onError: (error) => {
            showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
              title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
              text: USER_ERRORS.FAILED_DELETE_MAIN_BLOCK,
              icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
              cancelButton: false,
              confirmButton: false,
            })
          },
        })
      } else {
        showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
          title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
          text: USER_ERRORS.INVALID_DELETE_CALL,
          icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
          cancelButton: false,
          confirmButton: false,
        })
      }
    } catch (err: unknown) {
      const errorMessage = isAppError(err)
        ? err.message
        : USER_ERRORS.UNEXPECTED_ERROR
      showActionAlert(FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.CUSTOM_ALERT, {
        title: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.SOMETHING_WENT_WRONG,
        text: `${USER_ERRORS.DELETING_ITEM}${errorMessage}`,
        icon: FUNCTIONAL_BLOCK_CONSTANTS.GENERAL.ICON_ERROR,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }

  const handleCancel = () => {
    setEditingItem(GENERAL.INITIAL_STATE_UNDEFINED)
    setAddingToParentId(GENERAL.INITIAL_STATE_NULL)
    setAddingItemType(GENERAL.INITIAL_STATE_NULL)
    setOperationError(null)
    router.push(ROUTE_PATHS.DND_PROJECT_LIST)
  }

  const handleItemClick = (itemTitle: string) => {
    setBlockTitle(itemTitle)
  }

  if (!menuData?.productname) {
    return
  }

  return (
    <PageContainer>
      <GlobalLoader loading={isAnyLoading()} />
      {operationError && <div style={GENERAL.COLOR}>{operationError}</div>}
      <Grid2 container>
        <Grid2 size={{ md: SIZES.GRID_SIZE_SIDEBAR }}>
          <SidebarComponent
            menuStructure={menuData}
            onAddChild={handleAddMenuItem}
            onRemoveItem={handleRemoveMenuItem}
            onEditItem={handleEditMenuItem}
            onItemClick={handleItemClick}
            hasEditPermission={hasEditPermission}
          />
        </Grid2>
        <Grid2 size={{ md: SIZES.GRID_SIZE_MAIN_CONTENT }}>
          <MainContentComponent
            onSave={handleSaveMenuItem}
            onCancel={handleCancel}
            editingItem={editingItem}
            action_control={menuData?.meta_info?.action_control ?? { permissions: [] }}
            isLoading={isLoadingSpecifications}
            taskComments={menuData?.meta_info?.task_info?.task_comments}
            reviewerList={menuData?.meta_info?.task_info?.reviewer_list}
            blockTitle={blockTitle}
            onPermissionChange={setHasEditPermission}
          />
        </Grid2>
      </Grid2>
    </PageContainer>
  )
}

export default InputDesign
