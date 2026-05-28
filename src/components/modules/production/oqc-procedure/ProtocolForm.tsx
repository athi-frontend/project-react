'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Grid2 } from '@mui/material'
import { ButtonGroup, Label, InputField, DataGridTable, ActionButton, RichTextEditor, showActionAlert } from '@/components/ui'
import { PageContainer, P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'

import CommonModal from '@/components/ui/common-modal/CommonModal'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { useJigsDropdown } from '@/hooks/modules/production/useFinalOQC'
import { useGetTestProtocol, useUpsertTestProtocol } from '@/hooks/modules/production/useTestProtocol'
import { useGetPackagingProtocol, useUpsertPackagingProtocol } from '@/hooks/modules/production/usePackagingProtocol'
import { useGetInspectionProtocol, useUpsertInspectionProtocol } from '@/hooks/modules/production/useInspectionProtocol'
import { useTools, useEquipment } from '@/hooks/modules/dnd/useInstallationProcedure'
import { useFetchModels } from '@/hooks/modules/dnd/useDirSpecificataion'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { stripHtml } from '@/lib/utils/common'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
 * Classification: Confidential
 * Protocol Form Page
 */

interface ProtocolFormPageProps {
  protocolType: 'test-protocol' | 'inspection-protocol' | 'packaging-protocol' | 'burn-in-protocol';
  modelMapperId?: string | number;
  projectId?: string | number;
  initialModelId?: string | number;
  /** Required when protocolType is 'burn-in-protocol'; used for set_burn_in_id and draft context */
  burnInId?: number;
  /** When set (burn-in protocol), fetch uses ?burn_in=true or not; when undefined, form tries both and uses whichever returns data */
  isBurnInProtocolId?: boolean;
}

const ProtocolFormPage: React.FC<ProtocolFormPageProps> = ({ protocolType, modelMapperId, projectId, initialModelId, burnInId, isBurnInProtocolId }) => {
  // ===== New: Error States for Field Validation (Per Modal) =====
  const [toolsError, setToolsError] = useState<{ toolTypeId?: string; toolStatusId?: string }>({});
  const [jigsError, setJigsError] = useState<{ jigsTypeId?: string; jigsStatusId?: string }>({});
  const [equipmentError, setEquipmentError] = useState<{ equipmentTypeId?: string; equipmentStatusId?: string }>({});
  const [workInstructionError, setWorkInstructionError] = useState<{
    descriptionOfInstruction?: string;
    jigsOrEquipmentSettings?: string;
    acceptanceCriteria?: string;
    safetyAndPrecautions?: string;
    workInstructionStatusId?: string;
  }>({});
  const [productNameError, setProductNameError] = useState<string>('')
  const [modelError, setModelError] = useState<string>('')
  // ==============================================================

  const router = useRouter()
  const { id: routeProjectId } = useParams<{ id?: string }>()
  const isTestProtocol = protocolType === 'test-protocol'
  const isBurnInProtocol = protocolType === 'burn-in-protocol'
  const safeProjectId = projectId ? Number(projectId) : Number(routeProjectId ?? 0)

  // Modal states
  const [toolsModalOpen, setToolsModalOpen] = useState(false)
  const [jigsModalOpen, setJigsModalOpen] = useState(false)
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false)
  const [workInstructionModalOpen, setWorkInstructionModalOpen] = useState(false)

  // Form states
  const [processName, setProcessName] = useState('')
  const [processWorkInstruction, setProcessWorkInstruction] = useState('')
  const [productName, setProductName] = useState('')
  const [modelId, setModelId] = useState(String(initialModelId ?? ''))

  // Tools modal state
  const [toolTypeId, setToolTypeId] = useState('')
  const [toolStatusId, setToolStatusId] = useState('')
  const [editingToolRowId, setEditingToolRowId] = useState<string | null>(null)

  // Jigs modal state
  const [jigsTypeId, setJigsTypeId] = useState('')
  const [jigsStatusId, setJigsStatusId] = useState('')
  const [editingJigRowId, setEditingJigRowId] = useState<string | null>(null)

  // Equipment modal state
  const [equipmentTypeId, setEquipmentTypeId] = useState('')
  const [equipmentStatusId, setEquipmentStatusId] = useState('')
  const [editingEquipmentRowId, setEditingEquipmentRowId] = useState<string | null>(null)

  // Work Instruction modal state
  const [stepNo, setStepNo] = useState('')
  const [workInstructionStepVisual, setWorkInstructionStepVisual] = useState('')
  const [descriptionOfInstruction, setDescriptionOfInstruction] = useState('')
  const [jigsOrEquipmentSettings, setJigsOrEquipmentSettings] = useState('')
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('')
  const [safetyAndPrecautions, setSafetyAndPrecautions] = useState('')
  const [workInstructionStatusId, setWorkInstructionStatusId] = useState('')
  const [editingWorkInstructionRowId, setEditingWorkInstructionRowId] = useState<string | null>(null)

  // Data rows
  const [toolsRows, setToolsRows] = useState<any[]>([])
  const [jigsRows, setJigsRows] = useState<any[]>([])
  const [equipmentRows, setEquipmentRows] = useState<any[]>([])
  const [workInstructionRows, setWorkInstructionRows] = useState<any[]>([])

  const commonColumns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF,
    },
  ]
  const commonStatusColumn = {
    field: 'status_name',
    headerName: 'Status',
    flex: NUMBERMAP.ONE,
    renderCell: (params: any) => (
      <StatusTypography value={Number(params.row.status_id)} />
    )
  }
  // Tools columns
  const toolsColumns = [
    ...commonColumns,
    {
      field: 'tool_type',
      headerName: 'Tool type',
      flex: NUMBERMAP.ONE,
    },
    commonStatusColumn,
    {
      field: 'action',
      headerName: 'Actions',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <ActionButton
          onDelete={() => handleDeleteRow(params.row.id, setToolsRows, 'tools')}
          onEdit={() => handleEditTool(params.row)}
          deleteDisabled={params.row.status_id != NUMBERMAP.ONE}
        />
      ),
    },
  ]

  // Jigs columns
  const jigsColumns = [
    ...commonColumns,
    {
      field: 'jigs_type',
      headerName: 'Jigs type',
      flex: NUMBERMAP.ONE,
    },
    commonStatusColumn,
    {
      field: 'action',
      headerName: 'Actions',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <ActionButton
          onDelete={() => handleDeleteRow(params.row.id, setJigsRows, 'jigs')}
          onEdit={() => handleEditJig(params.row)}
          deleteDisabled={params.row.status_id != NUMBERMAP.ONE}
        />
      ),
    },
  ]

  // Equipment columns
  const equipmentColumns = [
    ...commonColumns,
    {
      field: 'equipment_type',
      headerName: 'Equipment type',
      flex: NUMBERMAP.ONE,
    },
    commonStatusColumn,
    {
      field: 'action',
      headerName: 'Actions',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <ActionButton
          onDelete={() => handleDeleteRow(params.row.id, setEquipmentRows, 'equipment')}
          onEdit={() => handleEditEquipment(params.row)}
          deleteDisabled={params.row.status_id != NUMBERMAP.ONE}

        />
      ),
    },
  ]

  // Work Instruction columns
  const workInstructionColumns = [
    ...commonColumns,
    {
      field: 'step_number',
      headerName: 'Step Number',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        if (params.value) {
          return params.value?.split('_')[NUMBERMAP.ZERO] == 'Step' ? params.value : `Step_${params.value}`
        } else {
          return '-'
        }
      }
    },
    {
      field: 'description',
      headerName: 'Description of the instruction',
      flex: NUMBERMAP.TWO,
      renderCell: (params: any) => {
        if (params.value) return stripHtml(params.value);
        return '-';
      }
    },
    commonStatusColumn,
    {
      field: 'action',
      headerName: 'Actions',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <ActionButton
          onDelete={() => handleDeleteRow(params.row.id, setWorkInstructionRows, 'workInstruction')}
          onEdit={() => handleEditWorkInstruction(params.row)}
          deleteDisabled={params.row.status_id != NUMBERMAP.ONE}
        />
      ),
    },
  ]

  // Dropdowns
  const { data: statusData } = useOrganizationStatus(1)
  const statusOptions = (statusData as any)?.data ?? statusData ?? []

  const { data: modelsResponseData } = useFetchModels(String(safeProjectId), 1)
  const modelsOptions = (modelsResponseData as any)?.data ?? modelsResponseData ?? []

  const { data: toolsData } = useTools()
  const toolsOptions = (toolsData as any)?.data ?? toolsData ?? []

  const jigsQuery = useJigsDropdown()
  const jigsOptions = (jigsQuery.data as any)?.data ?? jigsQuery.data ?? []

  const equipmentQuery = useEquipment()
  const equipmentOptions = (equipmentQuery.data as any)?.data ?? equipmentQuery.data ?? []

  // Dropdown fields (as per API response shape)
  const toolKeyField = 'tool_id'
  const toolValueField = 'tool_name'

  const equipmentKeyField = 'equipment_id'
  const equipmentValueField = 'equipment_name'

  // Protocol fetch + upsert (burn-in uses same test protocol API with set_burn_in_id)
  const getTestProtocolId = () => {
    const isTestOrBurnIn = protocolType === 'test-protocol' || protocolType === 'burn-in-protocol'
    return isTestOrBurnIn && modelMapperId != null ? modelMapperId : ('' as string)
  }

  const testProtocolId = getTestProtocolId()
  const shouldUseBurninParam = protocolType === 'burn-in-protocol' && isBurnInProtocolId === true
  const testProtocolQuery = useGetTestProtocol(
    testProtocolId,
    shouldUseBurninParam ? { burnin: true } : undefined
  )
  // Burn-in without isBurnInProtocolId: try both APIs and use whichever returns data (no mode in URL)
  const testProtocolQueryWithBurnin = useGetTestProtocol(testProtocolId, { burnin: true })
  const testProtocolQueryWithoutBurnin = useGetTestProtocol(testProtocolId)

  const packagingProtocolQuery = useGetPackagingProtocol(
    protocolType === 'packaging-protocol' ? (safeProjectId ?? '') : ('' as string),
    modelId
  )
  const inspectionProtocolQuery = useGetInspectionProtocol(
    protocolType === 'inspection-protocol' ? (safeProjectId ?? '') : ('' as string),
    modelId
  )

  // Helper function to select the appropriate protocol query
  const getProtocolQuery = (): typeof testProtocolQuery => {
    if (protocolType === 'test-protocol') {
      return testProtocolQuery
    }

    if (protocolType === 'burn-in-protocol') {
      const hasExplicitBurnInFlag = isBurnInProtocolId === true || isBurnInProtocolId === false
      if (hasExplicitBurnInFlag) {
        return testProtocolQuery
      }
      // Prefer withBurnin if it has data, else use withoutBurnin
      const withData = (testProtocolQueryWithBurnin?.data as any)?.data ?? testProtocolQueryWithBurnin?.data
      const hasWithBurnin = Array.isArray(withData) ? withData.length > 0 : withData != null
      return hasWithBurnin ? testProtocolQueryWithBurnin : testProtocolQueryWithoutBurnin
    }

    if (protocolType === 'packaging-protocol') {
      return packagingProtocolQuery
    }

    return inspectionProtocolQuery
  }

  const protocolQuery = getProtocolQuery()
  // State to hold draft data that will be merged with protocolData
  const [draftProtocolData, setDraftProtocolData] = useState<any>(null)

  // API responses across protocols are not fully consistent:
  const protocolData = useMemo(() => {
    // First check if we have draft data (takes priority)
    if (draftProtocolData) {
      return draftProtocolData
    }
    // Otherwise use API data
    const data = (protocolQuery?.data as any)?.data ?? protocolQuery?.data ?? null
    if (Array.isArray(data)) return data?.[NUMBERMAP.ZERO] ?? null
    return data
  }, [protocolQuery, draftProtocolData])

  const upsertTest = useUpsertTestProtocol()
  const upsertPackaging = useUpsertPackagingProtocol()
  const upsertInspection = useUpsertInspectionProtocol()

  // Draft save hook - for inspection-protocol, packaging-protocol, test-protocol, and burn-in-protocol (set_burn_in)
  const getContextInstanceId = useMemo(() => {
    // Helper to get model-based ID for protocols that use modelId
    const getModelBasedId = () => modelId ? Number(modelId) : null

    // Helper to get mapper-based ID for test/burn-in protocols
    const getMapperBasedId = () => {
      if (protocolData?.model_mapper_id) {
        return protocolData.model_mapper_id
      }
      return modelMapperId ? Number(modelMapperId) : null
    }

    switch (protocolType) {
      case 'burn-in-protocol':
        return burnInId ?? getMapperBasedId()
      case 'inspection-protocol':
      case 'packaging-protocol':
        return getModelBasedId()
      case 'test-protocol':
        return getMapperBasedId()
      default:
        return null
    }
  }, [protocolType, protocolData, modelId, modelMapperId, burnInId])

  const getContextType = useMemo(() => {
    if (protocolType === 'burn-in-protocol') return 'set_burn_in'
    if (protocolType === 'inspection-protocol') return "inspection_protocol"
    if (protocolType === 'packaging-protocol') return "packaging_protocol"
    if (protocolType === 'test-protocol') return "testing_protocol"
    return undefined
  }, [protocolType])

  const { 
    draftSave, 
    clearDraftSave, 
    isDraftSaving, 
    checkUnsavedDraftBeforeLeave 
  } = useDraftSave({
    context_type: getContextType,
    context_instance_id: getContextInstanceId,
    enableFetch: false
  })

  const findOptionLabel = useMemo(() => {
    return (options: any[], key: string, value: string, selectedId: string) => {
      const match = (options ?? []).find((o) => String(o?.[key]) === String(selectedId))
      return String(match?.[value] ?? '')
    }
  }, [])

  const handleWorkFlowInstruction = (work_instruction: any[]) => {
    setWorkInstructionRows(
      (work_instruction ?? []).map((w: any, idx: number) => ({
        id: String(w?.protocol_work_instruction_id ?? `wi-${idx}`),
        sno: idx + NUMBERMAP.ONE,
        protocol_work_instruction_id: w?.protocol_work_instruction_id ?? '',
        step_number: String(w?.step_number ?? ''),
        work_instruction_step_visuals: String(w?.work_instruction_step_visuals ?? ''),
        description: String(w?.description ?? ''),
        setting_usage: String(w?.setting_usage ?? ''),
        acceptance_criteria: String(w?.acceptance_criteria ?? ''),
        safety_precautions: String(w?.safety_precautions ?? ''),
        status_id: String(w?.status_id ?? ''),
        status_name:
          String(w?.status ?? '') ||
          findOptionLabel(statusOptions as any[], 'status_id', 'status_name', String(w?.status_id ?? '')),
      }))
    )
  }

  // Prefill from API (edit flow) - also handles draft data via protocolData
  useEffect(() => {
    if (protocolType === 'test-protocol') {
      setProcessName(String(protocolData?.process_name ?? ''))
      setProcessWorkInstruction(String(protocolData?.process_work_instruction ?? ''))
      setProductName(String(protocolData?.product_name ?? ''))
      setToolsRows(
        (protocolData?.tools_required ?? []).map((t: any, idx: number) => ({
          id: String(t?.protocol_tool_type_id ?? `tool-${idx}`),
          sno: idx + NUMBERMAP.ONE,
          protocol_tool_type_id: t?.protocol_tool_type_id ?? '',
          tool_type_id: String(t?.tool_type_id ?? ''),
          tool_type: String(t?.tool_type ?? ''),
          status_id: String(t?.status_id ?? ''),
          status_name: findOptionLabel(statusOptions as any[], 'status_id', 'status_name', String(t?.status_id ?? '')),
        }))
      )
      setJigsRows(
        (protocolData?.jigs_required ?? []).map((j: any, idx: number) => ({
          id: String(j?.protocol_jigs_id ?? `jig-${idx}`),
          sno: idx + NUMBERMAP.ONE,
          protocol_jigs_id: j?.protocol_jigs_id ?? '',
          jigs_type_id: String(j?.jigs_type_id ?? ''),
          jigs_type: String(j?.jigs_type ?? ''),
          status_id: String(j?.status_id ?? ''),
          status_name: findOptionLabel(statusOptions as any[], 'status_id', 'status_name', String(j?.status_id ?? '')),
        }))
      )
      setEquipmentRows(
        (protocolData?.equipment_required ?? []).map((e: any, idx: number) => ({
          id: String(e?.protocol_equipment_id ?? `equip-${idx}`),
          sno: idx + NUMBERMAP.ONE,
          protocol_equipment_id: e?.protocol_equipment_id ?? '',
          equipment_type_id: String(e?.equipment_type_id ?? ''),
          equipment_type: String(e?.equipment_type ?? ''),
          status_id: String(e?.status_id ?? ''),
          status_name: findOptionLabel(statusOptions as any[], 'status_id', 'status_name', String(e?.status_id ?? '')),
        }))
      )
      handleWorkFlowInstruction(protocolData?.work_instruction ?? [])
      return
    }

    // Packaging / Inspection
    if (protocolData?.model_id && !modelId) {
      setModelId(String(protocolData.model_id))
    }

    setToolsRows(
      (protocolData?.tools_required ?? []).map((t: any, idx: number) => ({
        id: String(t?.protocol_tool_type_id ?? `tool-${idx}`),
        sno: idx + NUMBERMAP.ONE,
        protocol_tool_type_id: t?.protocol_tool_type_id ?? '',
        tool_type_id: String(t?.tool_type_id ?? ''),
        tool_type: String(t?.tool_type ?? ''),
        status_id: String(t?.status_id ?? ''),
        status_name:
          String(t?.status ?? '') ||
          findOptionLabel(statusOptions as any[], 'status_id', 'status_name', String(t?.status_id ?? '')),
      }))
    )
    setJigsRows(
      (protocolData?.jigs_required ?? []).map((j: any, idx: number) => ({
        id: String(j?.protocol_jigs_id ?? `jig-${idx}`),
        sno: idx + NUMBERMAP.ONE,
        protocol_jigs_id: j?.protocol_jigs_id ?? '',
        jigs_type_id: String(j?.jigs_type_id ?? ''),
        jigs_type: String(j?.jigs_type ?? ''),
        status_id: String(j?.status_id ?? ''),
        status_name:
          String(j?.status ?? '') ||
          findOptionLabel(statusOptions as any[], 'status_id', 'status_name', String(j?.status_id ?? '')),
      }))
    )
    setEquipmentRows(
      (protocolData?.equipment_required ?? []).map((e: any, idx: number) => ({
        id: String(e?.protocol_equipment_id ?? `equip-${idx}`),
        sno: idx + NUMBERMAP.ONE,
        protocol_equipment_id: e?.protocol_equipment_id ?? '',
        equipment_type_id: String(e?.equipment_type_id ?? ''),
        equipment_type: String(e?.equipment_type ?? ''),
        status_id: String(e?.status_id ?? ''),
        status_name:
          String(e?.status ?? '') ||
          findOptionLabel(statusOptions as any[], 'status_id', 'status_name', String(e?.status_id ?? '')),
      }))
    )
    handleWorkFlowInstruction(protocolData?.work_instruction ?? [])
  }, [findOptionLabel, modelId, protocolData, protocolType, statusOptions])

  // Tools handlers
  const handleAddTool = () => {
    setToolTypeId('')
    setToolStatusId('')
    setEditingToolRowId(null)
    setToolsError({}) // Reset errors
    setToolsError({}); // Clear errors
    setToolsModalOpen(true)
  }

  const handleShowDuplicateAlert = (type: string) => {
    showActionAlert('customAlert', {
      title: 'Duplicate Entry',
      text: `The same ${type} type should not be entered again.`,
      icon: 'error',
      cancelButton: false,
      confirmButton: false,
    })

  }
  const handleSaveTool = () => {
    // Error validation
    const newErrors: { toolTypeId?: string; toolStatusId?: string } = {};
    if (!toolTypeId) newErrors.toolTypeId = 'Tool Type is required.';
    if (!toolStatusId) newErrors.toolStatusId = 'Status is required.';
    setToolsError(newErrors);
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) return;
    // Duplicate type check (not editing or editing to a new type)
    const foundDuplicate = toolsRows.some(
      (item) => String(item.tool_type_id) === String(toolTypeId) && String(item.id) !== String(editingToolRowId)
    );
    if (foundDuplicate) {
      handleShowDuplicateAlert('tool')
      return;
    }
    if (toolTypeId && toolStatusId) {
      const toolTypeLabel = findOptionLabel(toolsOptions as any[], toolKeyField, toolValueField, toolTypeId)
      const statusLabel = findOptionLabel(statusOptions as any[], 'status_id', 'status_name', toolStatusId)

      const nextId = editingToolRowId ?? Date.now().toString()
      const existing = toolsRows.find((t) => String(t.id) === String(nextId))
      const sno = existing?.sno ?? toolsRows.length + NUMBERMAP.ONE

      const nextRow = {
        id: nextId,
        sno,
        protocol_tool_type_id: existing?.protocol_tool_type_id ?? null,
        tool_type_id: toolTypeId,
        tool_type: toolTypeLabel,
        status_id: toolStatusId,
        status_name: statusLabel,
      }

      setToolsRows((prev) => {
        const updated = existing ? prev.map((r) => (String(r.id) === String(nextId) ? nextRow : r)) : [...prev, nextRow]
        if (protocolType === 'inspection-protocol' || protocolType === 'packaging-protocol' || protocolType === 'test-protocol' || protocolType === 'burn-in-protocol') {
          handleDraftSave(updated)
        }
        return updated
      })
      setToolsModalOpen(false)
      resetToolModal()
    }
  }

  const handleUpdateDeleteRow = (data: [], id: string) => {
    return data?.map((item) =>
      String(item.id) === String(id)
        ? { ...item, status_id: String(NUMBERMAP.TWO), status_name: 'Inactive' }
        : item
    )
  }

  const handleDeleteRow = (id: string, setRows: React.Dispatch<React.SetStateAction<any[]>>, rowType: 'tools' | 'jigs' | 'equipment' | 'workInstruction') => {
    showActionAlert('delete').then((result) => {
      if (result.isConfirmed) {
        setRows((prev) => {
          const updated = handleUpdateDeleteRow(prev, id) ?? []
          if (protocolType === 'inspection-protocol' || protocolType === 'packaging-protocol' || protocolType === 'test-protocol' || protocolType === 'burn-in-protocol') {
            // Determine which rows were updated based on the rowType parameter
            if (rowType === 'tools') {
              handleDraftSave(updated)
            } else if (rowType === 'jigs') {
              handleDraftSave(undefined, updated)
            } else if (rowType === 'equipment') {
              handleDraftSave(undefined, undefined, updated)
            } else if (rowType === 'workInstruction') {
              handleDraftSave(undefined, undefined, undefined, updated)
            }
          }
          return updated
        })
      }
    })
  }

  // Old delete for tools replaced below

  const handleEditTool = (row: any) => {
    setEditingToolRowId(String(row.id))
    setToolTypeId(String(row.tool_type_id ?? ''))
    setToolStatusId(String(row.status_id ?? ''))
    setToolsError({}); // Clear errors
    setToolsModalOpen(true)
  }

  const resetToolModal = () => {
    setToolTypeId('')
    setToolStatusId('')
    setEditingToolRowId(null)
    setToolsError({}) // Reset errors
  }

  // Jigs handlers
  const handleAddJig = () => {
    setJigsTypeId('')
    setJigsStatusId('')
    setEditingJigRowId(null)
    setJigsError({}); // Reset errors
    setJigsError({}); // Clear errors
    setJigsModalOpen(true)
  }

  const handleSaveJig = () => {
    // Error validation
    const newErrors: { jigsTypeId?: string; jigsStatusId?: string } = {};
    if (!jigsTypeId) newErrors.jigsTypeId = 'Jigs Type is required.';
    if (!jigsStatusId) newErrors.jigsStatusId = 'Status is required.';
    setJigsError(newErrors);
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) return;
    // Duplicate type check (not editing or editing to a new type)
    const foundDuplicate = jigsRows.some(
      (item) => String(item.jigs_type_id) === String(jigsTypeId) && String(item.id) !== String(editingJigRowId)
    );
    if (foundDuplicate) {
      handleShowDuplicateAlert('jig')
      return;
    }
    if (jigsTypeId && jigsStatusId) {
      const jigsTypeLabel = findOptionLabel(jigsOptions as any[], 'jigs_type_id', 'jigs_type_name', jigsTypeId)
      const statusLabel = findOptionLabel(statusOptions as any[], 'status_id', 'status_name', jigsStatusId)

      const nextId = editingJigRowId ?? Date.now().toString()
      const existing = jigsRows.find((j) => String(j.id) === String(nextId))
      const sno = existing?.sno ?? jigsRows.length + NUMBERMAP.ONE

      const nextRow = {
        id: nextId,
        sno,
        protocol_jigs_id: existing?.protocol_jigs_id ?? '',
        jigs_type_id: jigsTypeId,
        jigs_type: jigsTypeLabel,
        status_id: jigsStatusId,
        status_name: statusLabel,
      } 

      setJigsRows((prev) => {
        const updated = existing ? prev.map((r) => (String(r.id) === String(nextId) ? nextRow : r)) : [...prev, nextRow]
        if (protocolType === 'inspection-protocol' || protocolType === 'packaging-protocol' || protocolType === 'test-protocol' || protocolType === 'burn-in-protocol') {
          handleDraftSave(undefined, updated)
        }
        return updated
      })
      setJigsModalOpen(false)
      resetJigModal()
    }
  }

  const handleEditJig = (row: any) => {
    setEditingJigRowId(String(row.id))
    setJigsTypeId(String(row.jigs_type_id ?? ''))
    setJigsStatusId(String(row.status_id ?? ''))
    setJigsError({}); // Clear errors
    setJigsModalOpen(true)
  }

  const resetJigModal = () => {
    setJigsTypeId('')
    setJigsStatusId('')
    setEditingJigRowId(null)
    setJigsError({}); // Reset errors
  }

  // Equipment handlers
  const handleAddEquipment = () => {
    setEquipmentTypeId('')
    setEquipmentStatusId('')
    setEditingEquipmentRowId(null)
    setEquipmentError({}); // Reset errors
    setEquipmentError({}); // Clear errors
    setEquipmentModalOpen(true)
  }

  const handleSaveEquipment = () => {
    // Error validation
    const newErrors: { equipmentTypeId?: string; equipmentStatusId?: string } = {};
    if (!equipmentTypeId) newErrors.equipmentTypeId = 'Equipment Type is required.';
    if (!equipmentStatusId) newErrors.equipmentStatusId = 'Status is required.';
    setEquipmentError(newErrors);
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) return;
    // Duplicate type check (not editing or editing to a new type)
    const foundDuplicate = equipmentRows.some(
      (item) => String(item.equipment_type_id) === String(equipmentTypeId) && String(item.id) !== String(editingEquipmentRowId)
    );
    if (foundDuplicate) {
      handleShowDuplicateAlert('equipment')
      return;
    }
    if (equipmentTypeId && equipmentStatusId) {
      const equipmentTypeLabel = findOptionLabel(equipmentOptions as any[], equipmentKeyField, equipmentValueField, equipmentTypeId)
      const statusLabel = findOptionLabel(statusOptions as any[], 'status_id', 'status_name', equipmentStatusId)

      const nextId = editingEquipmentRowId ?? Date.now().toString()
      const existing = equipmentRows.find((e) => String(e.id) === String(nextId))
      const sno = existing?.sno ?? equipmentRows.length + NUMBERMAP.ONE

      const nextRow = {
        id: nextId,
        sno,
        protocol_equipment_id: existing?.protocol_equipment_id ?? '',
        equipment_type_id: equipmentTypeId,
        equipment_type: equipmentTypeLabel,
        status_id: equipmentStatusId,
        status_name: statusLabel,
      }

      setEquipmentRows((prev) => {
        const updated = existing ? prev.map((r) => (String(r.id) === String(nextId) ? nextRow : r)) : [...prev, nextRow]
        handleDraftSave(undefined, undefined, updated)
        return updated
      })
      setEquipmentModalOpen(false)
      resetEquipmentModal()
    }
  }

  const handleEditEquipment = (row: any) => {
    setEditingEquipmentRowId(String(row.id))
    setEquipmentTypeId(String(row.equipment_type_id ?? ''))
    setEquipmentStatusId(String(row.status_id ?? ''))
    setEquipmentError({}); // Clear errors
    setEquipmentModalOpen(true)
  }

  const resetEquipmentModal = () => {
    setEquipmentTypeId('')
    setEquipmentStatusId('')
    setEditingEquipmentRowId(null)
    setEquipmentError({}); // Reset errors
  }

  // Work Instruction handlers
  const handleAddWorkInstruction = () => {
    const nextStepNo = (workInstructionRows.length + 1).toString()
    setStepNo(nextStepNo)
    setWorkInstructionStepVisual('')
    setDescriptionOfInstruction('')
    setJigsOrEquipmentSettings('')
    setAcceptanceCriteria('')
    setSafetyAndPrecautions('')
    setWorkInstructionStatusId('')
    setEditingWorkInstructionRowId(null)
    setWorkInstructionError({}); // Reset errors
    setWorkInstructionError({}); // Clear errors
    setWorkInstructionModalOpen(true)
  }

  const handleSaveWorkInstruction = () => {
    // Error validation
    const newErrors: {
      descriptionOfInstruction?: string;
      jigsOrEquipmentSettings?: string;
      acceptanceCriteria?: string;
      safetyAndPrecautions?: string;
      workInstructionStatusId?: string;
    } = {};
    if (!descriptionOfInstruction) newErrors.descriptionOfInstruction = 'Description is required.';
    if (!jigsOrEquipmentSettings) newErrors.jigsOrEquipmentSettings = 'Jigs/Equipment Setting is required.';
    if (!acceptanceCriteria) newErrors.acceptanceCriteria = 'Acceptance Criteria is required.';
    if (!safetyAndPrecautions) newErrors.safetyAndPrecautions = 'Safety and Precautions are required.';
    if (!workInstructionStatusId) newErrors.workInstructionStatusId = 'Status is required.';
    setWorkInstructionError(newErrors);
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) return;
    if (descriptionOfInstruction && jigsOrEquipmentSettings && acceptanceCriteria && safetyAndPrecautions && workInstructionStatusId) {
      const statusLabel = findOptionLabel(statusOptions as any[], 'status_id', 'status_name', workInstructionStatusId)

      const nextId = editingWorkInstructionRowId ?? Date.now().toString()
      const existing = workInstructionRows.find((w) => String(w.id) === String(nextId))
      const sno = existing?.sno ?? workInstructionRows.length + NUMBERMAP.ONE

      const nextRow = {
        id: nextId,
        sno,
        protocol_work_instruction_id: existing?.protocol_work_instruction_id ?? '',
        step_number: stepNo ?? String(workInstructionRows.length + NUMBERMAP.ONE),
        work_instruction_step_visuals: workInstructionStepVisual,
        description: descriptionOfInstruction,
        setting_usage: jigsOrEquipmentSettings,
        acceptance_criteria: acceptanceCriteria,
        safety_precautions: safetyAndPrecautions,
        status_id: workInstructionStatusId,
        status_name: statusLabel,
      }

      setWorkInstructionRows((prev) => {
        const updated = existing ? prev.map((r) => (String(r.id) === String(nextId) ? nextRow : r)) : [...prev, nextRow]
        handleDraftSave(undefined, undefined, undefined, updated)
        return updated
      })
      setWorkInstructionModalOpen(false)
      resetWorkInstructionModal()
    }
  }

  const handleEditWorkInstruction = (row: any) => {
    setEditingWorkInstructionRowId(String(row.id))
    setStepNo(String(row.step_number ?? ''))
    setWorkInstructionStepVisual(String(row.work_instruction_step_visuals ?? ''))
    setDescriptionOfInstruction(String(row.description ?? ''))
    setJigsOrEquipmentSettings(String(row.setting_usage ?? ''))
    setAcceptanceCriteria(String(row.acceptance_criteria ?? ''))
    setSafetyAndPrecautions(String(row.safety_precautions ?? ''))
    setWorkInstructionStatusId(String(row.status_id ?? ''))
    setWorkInstructionError({}); // Clear errors
    setWorkInstructionModalOpen(true)
  }

  const resetWorkInstructionModal = () => {
    setStepNo('')
    setWorkInstructionStepVisual('')
    setDescriptionOfInstruction('')
    setJigsOrEquipmentSettings('')
    setAcceptanceCriteria('')
    setSafetyAndPrecautions('')
    setWorkInstructionStatusId('')
    setEditingWorkInstructionRowId(null)
    setWorkInstructionError({}); // Reset errors
  }

  const validationForm = () => {
    if (protocolType === 'test-protocol' || protocolType === 'burn-in-protocol') {
      if (processName?.trim() == '') setProductNameError('Product name is required')
      return Boolean(modelMapperId && processName)
    } else if (protocolType === 'packaging-protocol' || protocolType === 'inspection-protocol') {
      if (!modelId) setModelError('Model is required')
      return Boolean(modelId)
    }
    return true
  }

  // Helper function to check if protocol type is supported
  const isSupportedProtocolType = () => {
    return protocolType === 'inspection-protocol' || 
           protocolType === 'packaging-protocol' || 
           protocolType === 'test-protocol' || 
           protocolType === 'burn-in-protocol'
  }

  // Helper function to build protocol-specific fields
  const buildProtocolFields = (): Record<string, any> => {
    switch (protocolType) {
      case 'inspection-protocol':
        return {
          project_id: Number(safeProjectId),
          model_id: Number(modelId),
          ...(protocolData?.inspection_protocol_id ? { inspection_protocol_id: protocolData.inspection_protocol_id } : {}),
        }
      case 'packaging-protocol':
        return {
          project_id: Number(safeProjectId),
          model_id: Number(modelId),
          ...(protocolData?.packaging_protocol_id ? { packaging_protocol_id: protocolData.packaging_protocol_id } : {}),
        }
      case 'test-protocol':
        return {
          ...(protocolData?.test_protocol_id ? { test_protocol_id: protocolData.test_protocol_id } : {}),
          model_mapper_id: Number(modelMapperId),
          process_name: processName,
        }
      case 'burn-in-protocol':
        return {
          ...(protocolData?.test_protocol_id ? { test_protocol_id: protocolData.test_protocol_id } : {}),
          model_mapper_id: Number(modelMapperId),
          process_name: processName,
          ...(burnInId != null ? { set_burn_in_id: burnInId } : {}),
        }
      default:
        return {}
    }
  }

  // Draft save handler
  const handleDraftSave = useCallback((toolsRowsToSave?: any[], jigsRowsToSave?: any[], equipmentRowsToSave?: any[], workInstructionRowsToSave?: any[]) => {
    if (!isSupportedProtocolType()) return

    const common = {
      tools_required: toolsRowsToSave ?? toolsRows,
      jigs_required: jigsRowsToSave ?? jigsRows,
      equipment_required: equipmentRowsToSave ?? equipmentRows,
      work_instruction: workInstructionRowsToSave ?? workInstructionRows,
    }

    const protocolFields = buildProtocolFields()

    const payload = {
      id: getContextInstanceId ?? new Date().getTime(),
      ...protocolFields,
      ...common,
      type: 'draft',
    }

    draftSave({
      form_data: payload,
    })
  }, [draftSave, protocolType, toolsRows, jigsRows, equipmentRows, workInstructionRows, safeProjectId, modelId, protocolData, getContextInstanceId, modelMapperId, processName, burnInId])

  // Helper function to build common fields for save
  const buildCommonFields = () => ({
    tools_required: toolsRows.map(row => ({
      ...(row.protocol_tool_type_id ? { protocol_tool_type_id: row.protocol_tool_type_id } : {}),
      tool_type_id: Number(row.tool_type_id) || '',
      status_id: Number(row.status_id) || NUMBERMAP.ONE
    })),
    jigs_required: jigsRows.map(row => ({
      ...(row.protocol_jigs_id ? { protocol_jigs_id: row.protocol_jigs_id } : {}),
      jigs_type_id: Number(row.jigs_type_id ?? ''),
      status_id: Number(row.status_id ?? NUMBERMAP.ONE)
    })),
    equipment_required: equipmentRows.map(row => ({
      ...(row.protocol_equipment_id ? { protocol_equipment_id: row.protocol_equipment_id } : {}),
      equipment_type_id: Number(row.equipment_type_id ?? ''),
      status_id: Number(row.status_id ?? NUMBERMAP.ONE)
    })),
    work_instruction: workInstructionRows.map(row => {
      const stepNumber = row.step_number && row.step_number.toString().split("_")[NUMBERMAP.ZERO] === 'Step' 
        ? row.step_number 
        : `Step_${row.step_number}`
      return {
        ...(row.protocol_work_instruction_id ? { protocol_work_instruction_id: row.protocol_work_instruction_id } : {}),
        step_number: stepNumber,
        work_instruction_step_visuals: row.work_instruction_step_visuals ?? '',
        description: row.description ?? '',
        setting_usage: row.setting_usage ?? '',
        acceptance_criteria: row.acceptance_criteria ?? '',
        safety_precautions: row.safety_precautions ?? '',
        status_id: Number(row.status_id ?? NUMBERMAP.ONE)
      }
    })
  })

  // Helper function to handle protocol mutations
  const handleProtocolMutation = (payload: any) => {
    const successCallback = () => showActionAlert("success")
    const errorCallback = () => showActionAlert("failed")

    switch (protocolType) {
      case 'test-protocol':
        upsertTest.mutate(payload, {
          onSuccess: () => {
            successCallback()
            router.push(`/production/final-oqc-procedure/${protocolType}/${safeProjectId}`)
          },
          onError: errorCallback,
        })
        break
      case 'burn-in-protocol':
        if (burnInId != null) {
          upsertTest.mutate(payload, {
            onSuccess: () => {
              successCallback()
              if (safeProjectId) router.push(`/production/burn-in/${safeProjectId}`)
            },
            onError: errorCallback,
          })
        }
        break
      case 'packaging-protocol':
        upsertPackaging.mutate(payload, {
          onSuccess: successCallback,
          onError: errorCallback
        })
        break
      case 'inspection-protocol':
        upsertInspection.mutate(payload, {
          onSuccess: successCallback,
          onError: errorCallback
        })
        break
    }
  }

  const handleSave = () => {
    if (!validationForm()) {
      return
    }

    if (isSupportedProtocolType()) {
      clearDraftSave()
      setDraftProtocolData(null)
    }

    const common = buildCommonFields()
    const protocolFields = buildProtocolFields()
    const payload = { ...protocolFields, ...common }

    handleProtocolMutation(payload)
  }

  // Helper function to get model number value
  const getModelNumberValue = () => {
    if (isTestProtocol || isBurnInProtocol) {
      return String((protocolData as any)?.model_number ?? '-')
    }
    return findOptionLabel(modelsOptions as any[], 'model_id', 'model_name', modelId) ?? '-'
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    switch (protocolType) {
      case 'burn-in-protocol':
        if (safeProjectId) router.push(`/production/burn-in/${safeProjectId}`)
        break
      case 'test-protocol':
        router.push(`/production/final-oqc-procedure/${protocolType}/${safeProjectId}`)
        break
      case 'packaging-protocol':
      case 'inspection-protocol':
        router.push(`/production/list`)
        break
    }
  }

  return (
    <PageContainer>
      { isDraftSaving && <DraftLoading />}
      <Label title={'Protocol Form'} />

      <Grid2 container spacing={NUMBERMAP.ONE} sx={P20P40}>
        {/* Top Section - Info Fields and Process Name/Model Dropdown */}
        {(isTestProtocol || isBurnInProtocol) && (
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
            <InfoField label="Process Work Instruction" value={processWorkInstruction ?? '-'} />
          </Grid2>
        )}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField label="Product Name" value={productName ?? '-'} />
        </Grid2>
        {(isTestProtocol || isBurnInProtocol) && (
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
            <InfoField
              label="Model Number"
              value={getModelNumberValue()}
            />
          </Grid2>
        )}

        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          {(isTestProtocol || isBurnInProtocol) ? (
            <InputField
              label={'Process name*'}
              placeholder={'Enter Process name'}
              value={processName}
              onChange={(value: string) => {
                setProcessName(value);
                setProductNameError('');
                handleDraftSave()
              }}
              error={productNameError ?? ''}
            />
          ) : (
            <InputField
              label={'Model*'}
              placeholder={'Select Model'}
              isDropdown
              options={modelsOptions ?? []}
              keyField="model_id"
              valueField="model_name"
              value={modelId}
              onChange={(value: string) => {
                setModelId(value);
                setModelError('');
                handleDraftSave()
              }}
              error={modelError ?? ''}
            />
          )}
        </Grid2>

        {/* Tools Requirement Section */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title="Tools Requirement"
            rows={toolsRows}
            showAddButton
            onAddRow={handleAddTool}
            columns={toolsColumns}
            idField="id"
            loading={false}
            hideFooter={true}
          />
        </Grid2>

        {/* Jigs Required Section */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title="Jigs Required"
            rows={jigsRows}
            showAddButton
            onAddRow={handleAddJig}
            columns={jigsColumns}
            idField="id"
            loading={false}
            hideFooter={true}
          />
        </Grid2>

        {/* Equipment Required Section */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title="Equipment Required"
            rows={equipmentRows}
            showAddButton
            onAddRow={handleAddEquipment}
            columns={equipmentColumns}
            idField="id"
            loading={false}
            hideFooter={true}
          />
        </Grid2>

        {/* Work Instruction Section */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title="Work Instruction"
            rows={workInstructionRows}
            showAddButton
            onAddRow={handleAddWorkInstruction}
            columns={workInstructionColumns}
            idField="id"
            loading={false}
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

      {/* Tools Modal */}
      <CommonModal
        open={toolsModalOpen}
        title={'Add Tool'}
        buttonRequired
        onClose={() => {
          setToolsModalOpen(false)
          resetToolModal()
        }}
        onSave={handleSaveTool}
      >
        <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'ToolType*'}
              placeholder={'Select ToolType'}
              isDropdown
              options={toolsOptions ?? []}
              keyField={toolKeyField}
              valueField={toolValueField}
              value={toolTypeId}
              onChange={(value: string) => {
                setToolTypeId(value);
                setToolsError((e) => ({ ...e, toolTypeId: undefined }));
              }}
              error={toolsError.toolTypeId}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Status*'}
              placeholder={'Select Status'}
              isDropdown
              options={statusOptions ?? []}
              keyField="status_id"
              valueField="status_name"
              value={toolStatusId}
              onChange={(value: string) => {
                setToolStatusId(value);
                setToolsError((e) => ({ ...e, toolStatusId: undefined }));
              }}
              error={toolsError.toolStatusId}
            />
          </Grid2>
        </Grid2>
      </CommonModal>

      {/* Jigs Modal */}
      <CommonModal
        open={jigsModalOpen}
        buttonRequired
        title={'Add Jig'}
        onClose={() => {
          setJigsModalOpen(false)
          resetJigModal()
        }}
        onSave={handleSaveJig}

      >
        <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'JigsType*'}
              placeholder={'Select JigsType'}
              isDropdown
              options={jigsOptions ?? []}
              keyField="jigs_type_id"
              valueField="jigs_type_name"
              value={jigsTypeId}
              onChange={(value: string) => {
                setJigsTypeId(value);
                setJigsError(e => ({ ...e, jigsTypeId: undefined }));
              }}
              error={jigsError.jigsTypeId}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Status*'}
              placeholder={'Select Status'}
              isDropdown
              options={statusOptions ?? []}
              keyField="status_id"
              valueField="status_name"
              value={jigsStatusId}
              onChange={(value: string) => {
                setJigsStatusId(value);
                setJigsError(e => ({ ...e, jigsStatusId: undefined }));
              }}
              error={jigsError.jigsStatusId}
            />
          </Grid2>
        </Grid2>
      </CommonModal>

      {/* Equipment Modal */}
      <CommonModal
        open={equipmentModalOpen}
        title={'Add Equipment'}
        buttonRequired
        onClose={() => {
          setEquipmentModalOpen(false)
          resetEquipmentModal()
        }}
        onSave={handleSaveEquipment}
      >
        <Grid2 container spacing={NUMBERMAP.ONE} >
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Equipment Type*'}
              placeholder={'Select Equipment Type'}
              isDropdown
              options={equipmentOptions ?? []}
              keyField={equipmentKeyField}
              valueField={equipmentValueField}
              value={equipmentTypeId}
              onChange={(value: string) => {
                setEquipmentTypeId(value);
                setEquipmentError(e => ({ ...e, equipmentTypeId: undefined }));
              }}
              error={equipmentError.equipmentTypeId}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Status*'}
              placeholder={'Select Status'}
              isDropdown
              options={statusOptions ?? []}
              keyField="status_id"
              valueField="status_name"
              value={equipmentStatusId}
              onChange={(value: string) => {
                setEquipmentStatusId(value);
                setEquipmentError(e => ({ ...e, equipmentStatusId: undefined }));
              }}
              error={equipmentError.equipmentStatusId}
            />
          </Grid2>
        </Grid2>
      </CommonModal>

      {/* Work Instruction Modal */}
      <CommonModal
        open={workInstructionModalOpen}
        title={'Add Work Instruction'}
        buttonRequired
        onClose={() => {
          setWorkInstructionModalOpen(false)
          resetWorkInstructionModal()
        }}
        onSave={handleSaveWorkInstruction}
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={POPUP_STYLE}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InfoField label="Step No" value={stepNo ?? '-'} />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Work Instruction Step Visual'}
              placeholder={'Enter Work Instruction Step Visual'}
              toolbaroptions={{items:['imageUpload']}}
              value={workInstructionStepVisual}
              onChange={(value: string) => setWorkInstructionStepVisual(value)}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Description of instruction*'}
              placeholder={'Enter Description of instruction'}
              value={descriptionOfInstruction}
              onChange={(value: string) => {
                setDescriptionOfInstruction(value);
                setWorkInstructionError(e => ({ ...e, descriptionOfInstruction: undefined }));
              }}
              error={workInstructionError.descriptionOfInstruction}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Jigs or Equipment settings and usage*'}
              placeholder={'Enter Jigs or Equipment settings and usage'}
              value={jigsOrEquipmentSettings}
              onChange={(value: string) => {
                setJigsOrEquipmentSettings(value);
                setWorkInstructionError(e => ({ ...e, jigsOrEquipmentSettings: undefined }));
              }}
              error={workInstructionError.jigsOrEquipmentSettings}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Acceptance Criteria*'}
              placeholder={'Enter Acceptance Criteria'}
              value={acceptanceCriteria}
              onChange={(value: string) => {
                setAcceptanceCriteria(value);
                setWorkInstructionError(e => ({ ...e, acceptanceCriteria: undefined }));
              }}
              error={workInstructionError.acceptanceCriteria}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Safety and Precautions*'}
              placeholder={'Enter Safety and Precautions'}
              value={safetyAndPrecautions}
              onChange={(value: string) => {
                setSafetyAndPrecautions(value);
                setWorkInstructionError(e => ({ ...e, safetyAndPrecautions: undefined }));
              }}
              error={workInstructionError.safetyAndPrecautions}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={'Status*'}
              placeholder={'Select Status'}
              isDropdown
              options={statusOptions ?? []}
              keyField="status_id"
              valueField="status_name"
              value={workInstructionStatusId}
              onChange={(value: string) => {
                setWorkInstructionStatusId(value);
                setWorkInstructionError(e => ({ ...e, workInstructionStatusId: undefined }));
              }}
              error={workInstructionError.workInstructionStatusId}
            />
          </Grid2>
        </Grid2>
      </CommonModal>
    </PageContainer>
  )
}

export default ProtocolFormPage
