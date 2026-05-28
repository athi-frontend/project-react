'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Checkbox, Grid2 } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { ButtonGroup, Label, InputField, DataGridTable, ActionButton, showActionAlert } from '@/components/ui'
import { PageContainer, P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { useProductTraceabilityCardByProject, useUpsertProductTraceabilityCard } from '@/hooks/modules/production/useProductTraceabilityCard'
import { useProcessChecklistGroups, useProcessChecklists, useOrganizationStatus } from '@/hooks/useCommonDropdown'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'


/**
 * Classification: Confidential
 * Product Traceability Card Page
 */

interface ProcessChecklistItem {
  id?: number | string
  process_card_checklist_id?: number | string
  process_checklist_group_id: number | string | null
  is_new_process_checklist_group: boolean
  process_checklist_group_name: string
  process_checklist_id: number | string | null
  is_new_process_checklist: boolean
  process_checklist_name: string
  is_special_process: number
  status_id: number
}

interface PartDetail {
  assembly_part_item_details_id?: number
  part_name: string
  part_number: string
  is_applicable?: number
}

const ProductTraceabilityCardPage: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const projectId = Number(params.id)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [processChecklistRows, setProcessChecklistRows] = useState<ProcessChecklistItem[]>([])
  const [partDetailsRows, setPartDetailsRows] = useState<PartDetail[]>([])
  const [errors, setErrors] = useState<{
    process_checklist_group_id: string
    process_checklist_id: string
    is_special_process: string
    status_id: string
    process_checklist_group_name: string
    process_checklist_name: string
  }>({
    process_checklist_group_id: '',
    process_checklist_id: '',
    is_special_process: '',
    status_id: '',
    process_checklist_group_name: '',
    process_checklist_name: '',
  })

  // Modal form state
  const [modalFormData, setModalFormData] = useState<{
    process_checklist_group_id: string
    process_checklist_group_name: string
    process_checklist_id: string
    process_checklist_name: string
    is_special_process: string
    status_id: string
    is_new_process_checklist_group: boolean
    is_new_process_checklist: boolean
  }>({
    process_checklist_group_id: '',
    process_checklist_group_name: '',
    process_checklist_id: '',
    process_checklist_name: '',
    is_special_process: '',
    status_id: '',
    is_new_process_checklist_group: false,
    is_new_process_checklist: false,
  })

  // Fetch data
  const { data: traceabilityData, isLoading: isDataLoading } = useProductTraceabilityCardByProject(projectId)
  const { data: processChecklistGroupsData, refetch: groupRefetch } = useProcessChecklistGroups()
  const { data: processChecklistsData, refetch: checklistRefetch } = useProcessChecklists()
  const { data: statusData } = useOrganizationStatus()
  const [newProcessChecklists, setNewProcessChecklists] = useState<ProcessChecklistItem[]>([])
  const [newProcessChecklistGroups, setNewProcessChecklistGroups] = useState<ProcessChecklistItem[]>([])
  const upsertMutation = useUpsertProductTraceabilityCard(projectId)

  // Draft save hook
  const projectIdForDraft = projectId
  const { 
    draftSave, 
    clearDraftSave, 
    isDraftSaving,
    checkUnsavedDraftBeforeLeave 
  } = useDraftSave({
    context_type: "project",
    context_instance_id: projectIdForDraft,
    enableFetch: false
  })

  // Helper function to normalize traceability data structure
  // Handles both array [{}] and object {} structures
  const getTraceabilityData = useCallback(() => {
    if (!traceabilityData?.data) return null
    
    // If data is an array, get first element
    if (Array.isArray(traceabilityData.data) && traceabilityData.data.length > NUMBERMAP.ZERO) {
      return traceabilityData.data[NUMBERMAP.ZERO]
    }
    
    // If data is an object, return it directly
    if (typeof traceabilityData.data === 'object' && !Array.isArray(traceabilityData.data)) {
      return traceabilityData.data
    }
    
    return null
  }, [traceabilityData])

  // Populate form when data is fetched
  useEffect(() => {
    const normalizedData = getTraceabilityData()
    if (normalizedData) {
      setProcessChecklistRows(normalizedData.process_checklist ?? [])
      setPartDetailsRows(normalizedData.part_details ?? [])
    }
  }, [traceabilityData, getTraceabilityData])

  // Prepare dropdown options
  interface DropdownOption {
    id: number
    label: string
    value: number
  }

  // Check if a value exists in dropdown options
  const isValueInOptions = (value: string | number, options: any[], keyField: string = 'id') => {
    return options.some((opt: any) => opt[keyField] === Number(value))
  }

  // Handle process checklist group change
  const handleProcessChecklistGroupChange = (value: string) => {
    const selectedOption = processChecklistGroupsData?.data?.find((opt: { process_checklist_group_id: number }) => opt.process_checklist_group_id.toString() === value)
    const isCustom = !isValueInOptions(value, processChecklistGroupsData?.data ?? [], 'process_checklist_group_id')

    setModalFormData(prev => ({
      ...prev,
      is_new_process_checklist_group: isCustom,
      process_checklist_group_id: value,
      process_checklist_group_name: selectedOption ? selectedOption.process_checklist_group_name : value,
    }))
  }

  // Handle process checklist change
  const handleProcessChecklistChange = (value: string) => {
    const selectedOption = processChecklistsData?.data?.find((opt: { process_checklist_id: number }) => opt.process_checklist_id.toString() === value)
    const isCustom = !isValueInOptions(value, processChecklistsData?.data ?? [], 'process_checklist_id')

    setModalFormData(prev => ({
      ...prev,
      is_new_process_checklist: isCustom,
      process_checklist_id: value,
      process_checklist_name: selectedOption ? selectedOption.process_checklist_name : value,
    }))
  }

  const validateModalForm = () => {
    const newErrors = { ...errors }
    if (!modalFormData.process_checklist_group_id && !modalFormData.process_checklist_group_name) {
      newErrors.process_checklist_group_id = 'Process Checklist Group is required'
    }
    if (!modalFormData.process_checklist_id && !modalFormData.process_checklist_name) {
      newErrors.process_checklist_id = 'Process Checklist is required'
    }
    if (!modalFormData.status_id) {
      newErrors.status_id = 'Status is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).some(key => newErrors[key as keyof typeof newErrors] !== '')
  }
  // Handle modal save
  const isDuplicateProcessChecklist = () => {
    return processChecklistRows.find((item) => {
      // Exclude the current item being edited
      if (editingIndex !== null && item.process_card_checklist_id == editingIndex) {
        return false
      }
      // Check if same group name and checklist name combination exists
      return item.process_checklist_group_name === modalFormData.process_checklist_group_name &&
        item.process_checklist_name === modalFormData.process_checklist_name &&
        item.status_id !== NUMBERMAP.TWO // Exclude deleted items
    })


  }

  const getProcessChecklistId = (modalFormData) => {
    if (modalFormData.is_new_process_checklist) {
      return `new_${Date.now()}`;
    }

    if (modalFormData.process_checklist_id) {
      return Number(modalFormData.process_checklist_id);
    }

    return null;
  };
  const getProcessChecklistGroupId = (modalFormData) => {
    if (modalFormData.is_new_process_checklist_group) {
      return `new_${Date.now()}`;
    }

    if (modalFormData.process_checklist_group_id) {
      return Number(modalFormData.process_checklist_group_id);
    }

    return null;
  };

  const handleModalSave = () => {
    if (validateModalForm()) {
      return
    }

    // Check for duplicate process_checklist_group_name + process_checklist_name combination

    if (isDuplicateProcessChecklist()) {
      const newErrors = { ...errors }
      newErrors.process_checklist_name = 'This Process Title already exists for this Process Group'
      setErrors(newErrors)
      return
    }

    const existingItem = processChecklistRows.find((item) => item.process_card_checklist_id == editingIndex) ?? null
    const newItem: ProcessChecklistItem = {
      ...(editingIndex !== null && existingItem?.process_card_checklist_id ? { process_card_checklist_id: existingItem.process_card_checklist_id } : {}),
      process_checklist_group_id: getProcessChecklistGroupId(modalFormData),
      is_new_process_checklist_group: modalFormData.is_new_process_checklist_group ?? false,
      process_checklist_group_name: modalFormData.process_checklist_group_name,
      process_checklist_id: getProcessChecklistId(modalFormData),
      is_new_process_checklist: modalFormData.is_new_process_checklist ?? false,
      process_checklist_name: modalFormData.process_checklist_name,
      status_id: Number(modalFormData.status_id),
    }

    // Set id for new items (as string, will be converted in handleSave)
    if (editingIndex === null) {
      (newItem as any).process_card_checklist_id = 'new_' + new Date().getTime()
    }
    if (modalFormData.is_new_process_checklist_group) {
      setNewProcessChecklistGroups((prev) => {
        return [...prev, newItem]
      })
    }
    if (modalFormData.is_new_process_checklist) {
      setNewProcessChecklists((prev) => {
        return [...prev, newItem]
      })
    }
    if (editingIndex !== null) {
      setProcessChecklistRows((prev) => {
        const updated = prev?.map((item) => {
          if (item.process_card_checklist_id == editingIndex) {
            return newItem
          }
          return item
        })
        handleDraftSave( updated)
        return updated
      })
    } else {
      setProcessChecklistRows((prev) => {
        const updated = [...prev, newItem]
        handleDraftSave( updated)
        return updated
      })
    }

    // Reset modal
    setModalFormData({
      process_checklist_group_id: '',
      process_checklist_group_name: '',
      process_checklist_id: '',
      process_checklist_name: '',
      is_special_process: '',
      status_id: '',
      is_new_process_checklist_group: false,
      is_new_process_checklist: false,
    })
    setIsModalOpen(false)
    setEditingIndex(null)
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingIndex(null)
    setModalFormData({
      process_checklist_group_id: '',
      process_checklist_group_name: '',
      process_checklist_id: '',
      process_checklist_name: '',
      is_special_process: '',
      status_id: '',
      is_new_process_checklist_group: false,
      is_new_process_checklist: false,
    })
  }

  // Handle add row
  const handleAddProcessChecklist = () => {
    setEditingIndex(null)
    setErrors({
      process_checklist_group_id: '',
      process_checklist_id: '',
      status_id: '',
      process_checklist_group_name: '',
      process_checklist_name: '',
    })
    setIsModalOpen(true)
  }

  // Handle edit
  const handleEditProcessChecklist = (processChecklistId: number) => {
    const item = processChecklistRows.find((item) => item.process_card_checklist_id == processChecklistId)
    if (item) {
      setModalFormData({
        process_checklist_group_id: item.process_checklist_group_id?.toString() ?? '',
        process_checklist_group_name: item.process_checklist_group_name,
        process_checklist_id: item.process_checklist_id?.toString() ?? '',
        process_checklist_name: item.process_checklist_name,
        is_special_process: item.is_special_process === NUMBERMAP.ONE ? 'Yes' : 'No',
        status_id: item.status_id?.toString() ?? '',
        is_new_process_checklist_group: item.is_new_process_checklist_group ?? false,
        is_new_process_checklist: item.is_new_process_checklist ?? false,
        process_card_checklist_id: item.process_card_checklist_id ?? "",
      })
      setEditingIndex(processChecklistId)
      setIsModalOpen(true)
    }
  }

  const handleDeleteProcessChecklistGroup = (checklistData: ProcessChecklistItem[], processChecklistId: number | string) => {
    return checklistData?.map((item) => {
      if (item.process_card_checklist_id == processChecklistId) {
        return {
          ...item,
          status_id: NUMBERMAP.TWO
        }
      }
      return item
    }) ?? []
  }
  // Handle delete
  const handleDeleteProcessChecklist = (processChecklistId: number | string) => {
    showActionAlert('delete').then((result) => {
      if (result.isConfirmed) {
        setProcessChecklistRows((prev) => {
          const updated = handleDeleteProcessChecklistGroup(prev, processChecklistId?.toString())
          handleDraftSave( updated)
          return updated
        })
      }
    })

  }

  const getNewGroupChecklistId = (item) => {
    return (typeof item.process_checklist_group_id === 'number' ? item.process_checklist_group_id : Number(item.process_checklist_group_id))
  }
  const getNewChecklistId = (item) => {
    return (typeof item.process_checklist_id === 'number' ? item.process_checklist_id : Number(item.process_checklist_id))
  }
  // Handle save
  const handleSave = () => {
    clearDraftSave()

    const normalizedData = getTraceabilityData()
    const payload = {
      project_id: projectId,
      ...(normalizedData?.product_traceability_card_id ? { product_traceability_card_id: normalizedData.product_traceability_card_id } : {}),
      part_details: partDetailsRows.map(item => ({
        assembly_part_item_details_id: item.assembly_part_item_details_id,
        is_applicable: item.is_applicable ?? NUMBERMAP.ZERO,
      })),
      process_checklist: processChecklistRows.map(item => {
        // Check if id is a new item (starts with "new_")
        const isNewItem = item.id?.toString()?.startsWith('new_') ?? false

        // Check if group_id is a new item (starts with "new_")
        const groupIdStr = item.process_checklist_group_id?.toString() ?? ''
        const isNewGroup = groupIdStr.startsWith('new_')

        // Check if checklist_id is a new item (starts with "new_")
        const checklistIdStr = item.process_checklist_id?.toString() ?? ''
        const isNewChecklist = checklistIdStr.startsWith('new_')

        return {
          process_card_checklist_id: isNewItem ? "" : item.process_card_checklist_id ?? "",
          process_checklist_group_id: isNewGroup ? null : getNewGroupChecklistId(item),
          is_new_process_checklist_group: isNewGroup,
          process_checklist_group_name: item.process_checklist_group_name,
          process_checklist_id: isNewChecklist ? null : getNewChecklistId(item),
          is_new_process_checklist: isNewChecklist,
          process_checklist_name: item.process_checklist_name,
          is_special_process: item.is_special_process ?? NUMBERMAP.ZERO,
          status_id: item.status_id,
        }
      }),
    }

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        setNewProcessChecklistGroups([])
        setNewProcessChecklists([])
        groupRefetch()
        checklistRefetch()
      }
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push('/production/list')
  }

  // Draft save handler
  const handleDraftSave = useCallback((processChecklistToSave?: typeof processChecklistRows, partDetailsToSave?: typeof partDetailsRows) => {
    const processChecklist = processChecklistToSave ?? processChecklistRows
    const partDetails = partDetailsToSave ?? partDetailsRows
    const normalizedData = getTraceabilityData()
    
    const payload = {
      id: projectIdForDraft ?? new Date().getTime(),
      project_id: normalizedData?.project_id ?? projectId,
      product_id: normalizedData?.product_id ?? null,
      product_type: normalizedData?.product_type ?? null,
      product_subtype: normalizedData?.product_subtype ?? null,
      product_name: normalizedData?.product_name ?? null,
      product_code: normalizedData?.product_code ?? null,
      process_checklist: processChecklist,
      part_details: partDetails,
      ...(normalizedData?.product_traceability_card_id ? { product_traceability_card_id: normalizedData.product_traceability_card_id } : {}),
      type: 'draft',
    }

    draftSave({
      form_data: payload,
    })
  }, [draftSave, projectIdForDraft, processChecklistRows, partDetailsRows, getTraceabilityData, projectId])

  const handleProductTraceabilityRequiredChange = (assemblyPartItemDetailsId: number, isApplicable: boolean) => {
    setPartDetailsRows((prev) => {
      const updated = prev?.map((item) => {
        if (item.assembly_part_item_details_id == assemblyPartItemDetailsId) {
          return { ...item, is_applicable: isApplicable ? NUMBERMAP.ONE : NUMBERMAP.ZERO }
        }
        return item
      })
      // Trigger draft save after state update
      handleDraftSave(undefined, updated)
      return updated
    })
  }

  const majorCriticalAssemblyPartColumns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF,
    },
    {
      field: 'part_number',
      headerName: 'Part Number',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'part_name',
      headerName: 'Part Name',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'assembly_part_item_details_id',
      headerName: 'Product Traceability Required',
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox
          checked={params.row.is_applicable ?? null}
          onChange={(e) => handleProductTraceabilityRequiredChange(params.row.assembly_part_item_details_id, e.target.checked)}
        />
      ),
    }
  ]

  const columns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF,
    },
    {
      field: 'process_checklist_name',
      headerName: 'Process Title',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'status_id',
      headerName: 'Status',
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.value} />
      ),
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <ActionButton
          onDelete={() => handleDeleteProcessChecklist(params.row.process_card_checklist_id)}
          onEdit={() => handleEditProcessChecklist(params.row.process_card_checklist_id)}
          deleteDisabled={params.row.status_id != NUMBERMAP.ONE}
        />
      ),
    },
  ]
  const normalizedTraceabilityData = getTraceabilityData()
  const productData = normalizedTraceabilityData ?? {}
  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <Label title={'Product Traceability Card'} />
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField
            label={'Product Type'}
            value={productData.product_type ?? "-"}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField
            label={'Product Sub Type'}
            value={productData.product_subtype ?? "-"}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField
            label={'Product Name'}
            value={productData.product_name ?? "-"}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField
            label={'Product Code'}
            value={productData.product_code ?? "-"}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title='Major/Critical/Assembly/part'
            rows={partDetailsRows}
            columns={majorCriticalAssemblyPartColumns}
            idField="part_number"
            loading={isDataLoading}
            hideFooter={true}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title='Process'
            rows={processChecklistRows}
            showAddButton
            onAddRow={handleAddProcessChecklist}
            columns={columns}
            idField="process_card_checklist_id"
            loading={isDataLoading}
            hideFooter={true}
          />
        </Grid2>
      </Grid2>

      <div style={P20P40}>
        <ButtonGroup
          buttons={[
            {
              label: 'Cancel',
              onClick: handleCancel,
            },
            {
              label: 'Save',
              onClick: handleSave,
            },
          ]}
        />
      </div>
      <CommonModal
        open={isModalOpen}
        title={editingIndex !== null ? 'Edit Process Checklist' : 'Add Process Checklist'}
        onClose={handleModalClose}
        onSave={handleModalSave}
        buttonRequired={true}
      >
        <Grid2 container spacing={NUMBERMAP.ONE} >
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Process Group*'}
              placeholder={'Select Process Group'}
              isDropdown
              options={[...(newProcessChecklistGroups ?? []), ...(processChecklistGroupsData?.data ?? [])]}
              keyField="process_checklist_group_id"
              valueField="process_checklist_group_name"
              value={modalFormData.process_checklist_group_id ?? modalFormData.process_checklist_group_name}
              customOption
              error={errors.process_checklist_group_id ?? ''}
              onChange={(value: string) => {
                handleProcessChecklistGroupChange(value)
                setErrors(prev => ({ ...prev, process_checklist_group_id: '' }))
              }}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Process Title*'}
              placeholder={'Select Process Title'}
              isDropdown
              options={[...(newProcessChecklists ?? []), ...(processChecklistsData?.data ?? [])]}
              keyField="process_checklist_id"
              valueField="process_checklist_name"
              value={modalFormData.process_checklist_id ?? modalFormData.process_checklist_name}
              customOption
              error={errors.process_checklist_id ?? errors.process_checklist_name ?? ''}
              onChange={(value: string) => {
                handleProcessChecklistChange(value)
                setErrors(prev => ({ ...prev, process_checklist_id: '', process_checklist_name: '' }))
              }}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              isDropdown
              options={statusData?.data ?? []}
              keyField="status_id"
              valueField="status_name"
              label="Status*"
              placeholder="Select Status"
              value={modalFormData.status_id}
              onChange={(value: string) => {
                setModalFormData(prev => ({ ...prev, status_id: value }))
                setErrors(prev => ({ ...prev, status_id: '' }))
              }}
              error={errors.status_id ?? ''}
            />
          </Grid2>
        </Grid2>
      </CommonModal>
    </PageContainer>
  )
}

export default ProductTraceabilityCardPage
