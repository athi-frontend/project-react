'use client'

import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import {
  DataGridTable,
  ActionButton,
  showActionAlert,
  MultiSelect,
} from '@/components/ui'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor'
import {
  FormContainer,
  FormHeader,
  FormContent,
  FormSection,
  ProductNameContainer,
  ProductNameLabel,
  ProductNameValue,
  STYLE5,
} from '@/styles/modules/dnd/intendedUseForm'
import { LabelContainer, LabelText, LabelValue } from '@/styles/components/modules/prototypeForm'
import {
  useIntendedUseMutation,
  useFetchIntendedUse,
  useFetchUseEnvironments,
} from '@/hooks/modules/dnd/useIntendedUse'
import {
  IntendedUseFormProps,
  IntendedUseFormData,
  FormErrors,
  IntendedPopulationItem,
  IntendedUsersItem,
  IndicationsOfUseItem,
} from '@/types/modules/dnd/intendedUse'
import {
  FORM_LABELS,
  PLACEHOLDERS,
  ERROR_MESSAGES,
  ONCHANGE,
  FIELD_ORDER,
  FIELD_LABEL_MAP,
  INTENDED_POPULATION_COLUMNS,
  INTENDED_USERS_COLUMNS,
  INDICATIONS_OF_USE_COLUMNS,
  TABLE_COLUMNS,
  TABLE_FIELDS,
  ALIGNMENT,
  ID_FIELDS,
  TEMP_ID_PATTERN,
} from '@/constants/modules/dnd/intendedUse'
import {
  handleChange,
  handleSave,
  handleCancel,
} from '@/lib/modules/dnd/intendedUse'
import { NUMBERMAP } from '@/constants/common'
import { DELETE_ALERT } from '@/constants/modules/dnd/formTeam'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import IntendedPopulationModal from '@/components/modules/dnd/intended-use/IntendedPopulationModal'
import IntendedUsersModal from '@/components/modules/dnd/intended-use/IntendedUsersModal'
import IndicationsOfUseModal from '@/components/modules/dnd/intended-use/IndicationsOfUseModal'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { GridColDef } from '@mui/x-data-grid'
import { stripHtml } from '@/lib/utils/common'

type RowId = number | string | undefined

/**
      *Classification : Confidential
**/
const IntendedUseForm: React.FC<IntendedUseFormProps> = ({
  onCancel,
  ProjectId,
}) => {
  const [formData, setFormData] = useState<IntendedUseFormData>({
    productName: '',
    intendedUse: '',
    intendedPopulation: [],
    intendedUsers: [],
    indicationsOfUse: [],
    contraIndicationsOfUse: '',
    useEnvironment: [],
  })

  const [errors, setErrors] = useState<FormErrors>({
    intendedUse: '',
    intendedPopulation: '',
    intendedUsers: '',
    indicationsOfUse: '',
    contraIndicationsOfUse: '',
    useEnvironment: '',
  })
  const [hasEditPermission, setHasEditPermission] = useState(true)
  const [isDisabled, setIsDisabled] = useState(false)
  const { data: intendedUseData, isLoading: isLoadingSpecifications, isFetching: isFetchingSpecifications } = useFetchIntendedUse(Number(ProjectId))
  const { isPending: isIntendedPending, mutate: mutateIntendedUse } = useIntendedUseMutation()
  const { data: useEnvironmentsData } = useFetchUseEnvironments()
  
  const [isPopulationModalOpen, setIsPopulationModalOpen] = useState(false)
  const [editingPopulationItem, setEditingPopulationItem] = useState<IntendedPopulationItem | null>(null)
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false)
  const [editingUsersItem, setEditingUsersItem] = useState<IntendedUsersItem | null>(null)
  const [isIndicationsModalOpen, setIsIndicationsModalOpen] = useState(false)
  const [editingIndicationsItem, setEditingIndicationsItem] = useState<IndicationsOfUseItem | null>(null)

  const intendedUseItem = intendedUseData?.data?.[NUMBERMAP.ZERO]
  const productName = intendedUseItem?.product_name ?? ''
  const productGroup = intendedUseItem?.product_group ?? ''
  const productCategory = intendedUseItem?.product_category ?? ''
  const productType = intendedUseItem?.product_type ?? ''
  const productSubType = intendedUseItem?.product_sub_type ?? ''

  // Comprehensive loading state function
  const isAnyLoading = () => {
    if (isLoadingSpecifications) return true
    if (isFetchingSpecifications) return true
    if (isIntendedPending) return true
    return false
  }

  useEffect(() => {
    if (intendedUseData?.data && intendedUseData.data.length > NUMBERMAP.ZERO) {
      const item = intendedUseData.data[NUMBERMAP.ZERO]

      setFormData({
        productName: item.product_name ?? '',
        intendedUse: item.intended_use ?? '',
        intendedPopulation: item.intended_population ?? [],
        intendedUsers: item.intended_user ?? [],
        indicationsOfUse: item.indication_use ?? [],
        contraIndicationsOfUse: item.contra_indication_use ?? '',
        useEnvironment: item.use_environment ?? [],
      })
    }
  }, [intendedUseData])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      intendedUse: !formData.intendedUse || formData.intendedUse.trim() === ''
        ? ERROR_MESSAGES.INTENDED_USE_REQUIRED
        : '',
      intendedPopulation: !formData.intendedPopulation || formData.intendedPopulation.length === NUMBERMAP.ZERO
        ? ERROR_MESSAGES.INTENDED_POPULATION_REQUIRED
        : '',
      intendedUsers: !formData.intendedUsers || formData.intendedUsers.length === NUMBERMAP.ZERO
        ? ERROR_MESSAGES.INTENDED_USERS_REQUIRED
        : '',
      indicationsOfUse: !formData.indicationsOfUse || formData.indicationsOfUse.length === NUMBERMAP.ZERO
        ? ERROR_MESSAGES.INDICATIONS_REQUIRED
        : '',
      contraIndicationsOfUse: !formData.contraIndicationsOfUse
        ? ERROR_MESSAGES.CONTRA_INDICATIONS_REQUIRED
        : '',
      useEnvironment: !formData.useEnvironment || formData.useEnvironment.length === NUMBERMAP.ZERO
        ? ERROR_MESSAGES.USE_ENVIRONMENT_REQUIRED
        : '',
    }

    setErrors(newErrors)
    const isValid = !Object.values(newErrors).some((error) => error !== '')
    
    if (!isValid) {
      // Use validateAndFocusFirstEmptyField for focus management
      validateAndFocusFirstEmptyField(formData, FIELD_ORDER, FIELD_LABEL_MAP)
    }
    
    return isValid
  }

  const handleFormSave = () => {
    /**
     * Description: Added setIsDisabled to prevent multiple clicks on save button,
     * Author: Prithiviraj,
     * Created: 2-08-2025,
     * Classification : Confidential
    **/
    if (validateForm()) {
      setIsDisabled(true)
      handleSave(formData, mutateIntendedUse, ProjectId, () => {
        setIsDisabled(false)
      })
    } 
  }

  const handleFormCancel = () => {
    handleCancel(onCancel)
  }

  const handleFieldChangeWithPermission = (field: any, value: string | number[]) => {
    if (!hasEditPermission) return
    handleChange(field, value, setFormData, setErrors)
  }

  // Helper function to update table data
  const updateTableData = (
    fieldName: 'intendedPopulation' | 'intendedUsers' | 'indicationsOfUse',
    updatedData: any[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: updatedData,
    }))
  }

  // Common handlers for table operations
  const createTableHandlers = <T extends { id?: number; sno?: number }>(
    fieldName: 'intendedPopulation' | 'intendedUsers' | 'indicationsOfUse',
    setEditingItem: (item: T | null) => void,
    setIsModalOpen: (open: boolean) => void
  ) => {
    const handleDeleteRow = (targetId: RowId) => {
      const currentItems = formData[fieldName] as any[]
      const updatedItems = currentItems.map((item: any, index: number) => {
        // Match by id if it exists, otherwise match by temp id pattern
        const itemId = item.id ?? `${TEMP_ID_PATTERN.PREFIX}${index}`
        if (itemId === targetId || item.id === targetId) {
          return { ...item, status: NUMBERMAP.TWO }
        }
        return item
      })
      updateTableData(fieldName, updatedItems)
    }

    const handleDelete = (rowId: RowId) => {
      const onConfirm = () => {
        handleDeleteRow(rowId)
      }
      showActionAlert(DELETE_ALERT).then((result) => {
        if (result.isConfirmed) {
          onConfirm()
        }
      })
    }

    const handleEdit = (rowId: number | string | undefined) => {
      const currentItems = formData[fieldName] as any[]
      // Find row by id or by temp id pattern
      const originalRow = currentItems.find((item: any, index: number) => {
        const itemId = item.id ?? `${TEMP_ID_PATTERN.PREFIX}${index}`
        return itemId === rowId || item.id === rowId
      })
      if (originalRow) {
        setEditingItem(originalRow as T)
        setIsModalOpen(true)
      }
    }

    const handleSave = (data: T, editingItem: T | null) => {
      const currentItems = formData[fieldName]
      
      if (editingItem) {
        const editingId = editingItem.id
        const updatedItems = currentItems.map((item: any, index: number) => {
          const itemId = item.id ?? `${TEMP_ID_PATTERN.PREFIX}${index}`
          const matchId = editingId ?? `${TEMP_ID_PATTERN.PREFIX}${index}`
          
          if (itemId === matchId || item.id === editingId) {
            return data
          }
          return item
        })
        updateTableData(fieldName, updatedItems)
      } else {
        updateTableData(fieldName, [...currentItems, data])
      }
      
      setIsModalOpen(false)
      setEditingItem(null)
    }

    return {
      handleAdd: () => {
        setEditingItem(null)
        setIsModalOpen(true)
      },
      handleEdit,
      handleDelete,
      handleSave,
    }
  }

  const populationHandlers = createTableHandlers<IntendedPopulationItem>(
    'intendedPopulation',
    setEditingPopulationItem,
    setIsPopulationModalOpen
  )

  const handleAddPopulation = populationHandlers.handleAdd
  const handleEditPopulation = populationHandlers.handleEdit
  const handleDeletePopulation = populationHandlers.handleDelete
  const handleSavePopulation = (data: IntendedPopulationItem) => {
    populationHandlers.handleSave(data, editingPopulationItem)
  }

  // Intended Users handlers
  const usersHandlers = createTableHandlers<IntendedUsersItem>(
    'intendedUsers',
    setEditingUsersItem,
    setIsUsersModalOpen
  )

  const handleAddUsers = usersHandlers.handleAdd
  const handleEditUsers = usersHandlers.handleEdit
  const handleDeleteUsers = usersHandlers.handleDelete
  const handleSaveUsers = (data: IntendedUsersItem) => {
    usersHandlers.handleSave(data, editingUsersItem)
  }

  // Indications of Use handlers
  const indicationsHandlers = createTableHandlers<IndicationsOfUseItem>(
    'indicationsOfUse',
    setEditingIndicationsItem,
    setIsIndicationsModalOpen
  )

  const handleAddIndications = indicationsHandlers.handleAdd
  const handleEditIndications = indicationsHandlers.handleEdit
  const handleDeleteIndications = indicationsHandlers.handleDelete
  const handleSaveIndications = (data: IndicationsOfUseItem) => {
    indicationsHandlers.handleSave(data, editingIndicationsItem)
  }

  // Helper function to create table columns with actions
  const createTableColumns = (
    baseColumns: GridColDef[],
    onEdit: (id: RowId) => void,
    onDelete: (id: RowId) => void,
    useDefaultStatusValue: boolean = false
  ): GridColDef[] => {
    return [
      ...baseColumns.map((col) => {
        if (col.field === TABLE_FIELDS.STATUS) {
          return {
            ...col,
            renderCell: (params: any) => (
              <StatusTypography value={useDefaultStatusValue ? (params.value ?? NUMBERMAP.ZERO) : params?.value} />
            ),
          }
        }
        return col
      }),
      {
        headerName: TABLE_COLUMNS.ACTIONS,
        field: TABLE_FIELDS.ACTIONS,
        sortable: false,
        disableColumnMenu: true,
        flex: NUMBERMAP.ONE,
        headerAlign: ALIGNMENT.CENTER,
        align: ALIGNMENT.CENTER,
        renderCell: (params) => {
          if (!hasEditPermission) return null
          return (
            <ActionButton
              onEdit={() => onEdit(params.row.id)}
              onDelete={() => onDelete(params.row.id)}
            />
          )
        },
      },
    ]
  }

  const populationColumns: GridColDef[] = createTableColumns(
    INTENDED_POPULATION_COLUMNS,
    handleEditPopulation,
    handleDeletePopulation
  )

  const usersColumns: GridColDef[] = createTableColumns(
    INTENDED_USERS_COLUMNS,
    handleEditUsers,
    handleDeleteUsers,
    true
  )

  const indicationsColumns: GridColDef[] = createTableColumns(
    INDICATIONS_OF_USE_COLUMNS,
    handleEditIndications,
    handleDeleteIndications,
    true
  )


  // Get permissions from intendedUseData or use default
  const permissions = intendedUseData?.meta_info?.action_control?.permissions ?? [];
  return (
    <>
      <GlobalLoader loading={isAnyLoading()} />
      {intendedUseData && (
        <FormContainer>
      <FormHeader>{FORM_LABELS.HEADER}</FormHeader>
      <FormContent>
        <FormSection>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <LabelContainer>
                <LabelText>{FORM_LABELS.PRODUCT_GROUP}</LabelText>
                <LabelValue>{productGroup ?? '-'}</LabelValue>
              </LabelContainer>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <LabelContainer>
                <LabelText>{FORM_LABELS.PRODUCT_CATEGORY}</LabelText>
                <LabelValue>{productCategory ?? '-'}</LabelValue>
              </LabelContainer>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <LabelContainer>
                <LabelText>{FORM_LABELS.PRODUCT_TYPE}</LabelText>
                <LabelValue>{productType ?? '-'}</LabelValue>
              </LabelContainer>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <LabelContainer>
                <LabelText>{FORM_LABELS.PRODUCT_SUB_TYPE}</LabelText>
                <LabelValue>{productSubType ?? '-'}</LabelValue>
              </LabelContainer>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <ProductNameContainer>
                <ProductNameLabel>{FORM_LABELS.PRODUCT_NAME}</ProductNameLabel>
                <ProductNameValue>{productName}</ProductNameValue>
              </ProductNameContainer>
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <RichTextEditor
                label={FORM_LABELS.INTENDED_USE}
                value={formData.intendedUse}
                onChange={(value) =>
                  handleFieldChangeWithPermission(ONCHANGE.INTENDED_USE as keyof IntendedUseFormData, value)
                }
                error={errors.intendedUse}
                placeholder={PLACEHOLDERS.INTENDED_USE}
                disabled={!hasEditPermission}
                id={ID_FIELDS.INTENDED_USE}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <DataGridTable
                title={FORM_LABELS.INTENDED_POPULATION}
                columns={populationColumns}
                rows={formData.intendedPopulation.map((item, index) => ({
                  ...item,
                  id: item.id ?? `temp-${index}`,
                  value: stripHtml(item.value ?? ''),
                }))}
                idField={TABLE_FIELDS.ID}
                showAddButton={hasEditPermission}
                onAddRow={handleAddPopulation}
                hideFooter
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.TWELVE}>
              <DataGridTable
                title={FORM_LABELS.INTENDED_USERS}
                columns={usersColumns}
                rows={formData.intendedUsers.map((item, index) => ({
                  ...item,
                  id: item.id ?? `temp-${index}`,
                  value: stripHtml(item.value ?? ''),
                }))}
                idField={TABLE_FIELDS.ID}
                showAddButton={hasEditPermission}
                onAddRow={handleAddUsers}
                hideFooter
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <DataGridTable
                title={FORM_LABELS.INDICATIONS_OF_USE}
                columns={indicationsColumns}
                rows={formData.indicationsOfUse.map((item, index) => ({
                  ...item,
                  id: item.id ?? `temp-${index}`,
                  value: stripHtml(item.value ?? ''),
                }))}
                idField={TABLE_FIELDS.ID}
                showAddButton={hasEditPermission}
                onAddRow={handleAddIndications}
                hideFooter
              />
            </Grid2>

            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={`${FORM_LABELS.CONTRA_INDICATIONS}`}
                placeholder={PLACEHOLDERS.CONTRA_INDICATIONS}
                value={formData.contraIndicationsOfUse}
                onChange={(value: string) =>
                  handleFieldChangeWithPermission(
                    ONCHANGE.CONTRA_INDICATIONS,
                    value
                  )
                }
                error={errors.contraIndicationsOfUse}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <MultiSelect
                label={FORM_LABELS.USE_ENVIRONMENT}
                placeholder={PLACEHOLDERS.USE_ENVIRONMENT}
                value={formData.useEnvironment}
                onChange={(value) => {
                  const environmentIds = value.map((v) => (typeof v === 'string' ? Number(v) : v))
                  handleFieldChangeWithPermission(
                    ONCHANGE.USE_ENVIRONMENT,
                    environmentIds
                  )
                }}
                error={errors.useEnvironment ?? ""}
                options={useEnvironmentsData?.data ?? []}
                idField={TABLE_FIELDS.REF_ID}
                valueField={TABLE_FIELDS.USE_ENVIRONMENT}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>
          <Grid2 sx={STYLE5}>
          <CommentsHistory 
              comments={intendedUseData?.meta_info?.task_info?.task_comments}
            />
            </Grid2>
          <ReviewerModalManager
            isLoading={isLoadingSpecifications}
            permissions={permissions}
            projectId={ProjectId}
            menuId={intendedUseData?.meta_info?.action_control?.menuId}
            menuName={intendedUseData?.meta_info?.action_control?.formName}
            onPermissionChange={setHasEditPermission}
            customHandlers={{
              handleCancel: handleFormCancel,
              handleSave: handleFormSave,
              isDisabled: isDisabled
            }}
            reviewerList={intendedUseData?.meta_info?.task_info?.reviewer_list}
          />
        </FormSection>
      </FormContent>
    </FormContainer>
      )}
      <IntendedPopulationModal
        open={isPopulationModalOpen}
        onClose={() => {
          setIsPopulationModalOpen(false)
          setEditingPopulationItem(null)
        }}
        onSave={handleSavePopulation}
        initialData={editingPopulationItem}
      />
      <IntendedUsersModal
        open={isUsersModalOpen}
        onClose={() => {
          setIsUsersModalOpen(false)
          setEditingUsersItem(null)
        }}
        onSave={handleSaveUsers}
        initialData={editingUsersItem}
      />
      <IndicationsOfUseModal
        open={isIndicationsModalOpen}
        onClose={() => {
          setIsIndicationsModalOpen(false)
          setEditingIndicationsItem(null)
        }}
        onSave={handleSaveIndications}
        initialData={editingIndicationsItem}
        projectId={Number(ProjectId)}
      />
    </>
  )
}

export default IntendedUseForm
