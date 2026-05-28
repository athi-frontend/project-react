'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Grid2 } from '@mui/material'
import { InputField, DataGridTable, ActionButton, RichTextEditor, Description, MultiSelect, ButtonGroup, showActionAlert } from '@/components/ui'
import { P20P40 } from '@/styles/common'
import { FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { useTools, useEquipment } from '@/hooks/modules/dnd/useInstallationProcedure'
import { useFetchSkills } from '@/hooks/modules/hr/useTrainingNeeds'
import { useAllJigsTypes } from '@/hooks/modules/production/useCommonProductionDropDownHook'
import { useAssemblyWorkInstructionById, useUpsertAssemblyWorkInstruction } from '@/hooks/modules/production/useAssemblyWorkInstruction'
import { populateFormData } from '@/lib/utils/fileUploadManager'
import { FinalFileData, mergeFinalFileData, isDocumentUploadValid, handleFileUpload, handleFileEdit, numberValidation } from '@/lib/utils/common'
import { stripHtml } from '@/lib/modules/dnd/dirSpecification'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { useRouter } from 'next/navigation'

/**
 * Classification: Confidential
 * Assembly Work Instruction Form Component
 */

export interface PartDetail {
  id: string
  sno: number
  partCode: string
  partName: string
}

export interface StepDetail {
  id: string
  sno: number
  stepNumber: string
  description: string
  assemblyInstruction?: string
  assemblyStepVisual?: string
  safetyAndPrecautions?: string
}

export interface AssemblyWorkInstructionFormData {
  productName: string
  modelNo: string
  assemblyPartName: string
  assemblyPartCode: string
  descriptionOfAssembly: string
  partLegend: string
  partDetails: PartDetail[]
  jigsAndSettingsUsage: string
  skillRequired: (string | number)[]
  estimateHours: string
  toolType: (string | number)[]
  equipmentType: (string | number)[]
  jigType: (string | number)[]
  steps: StepDetail[]
  stepNumber: string
  assemblyStepVisual: string
  assemblyInstruction: string
  safetyAndPrecautions: string
  supporting_file_documents: any[]
}

interface AssemblyWorkInstructionFormProps {
  partAssemblyDetailId: number
  assemblyPartItemDetailId: number
  onSaveSuccess?: () => void
}

const INITIAL_FORM_DATA: AssemblyWorkInstructionFormData = {
  productName: '',
  modelNo: '',
  assemblyPartName: '',
  assemblyPartCode: '',
  descriptionOfAssembly: '',
  partLegend: '',
  partDetails: [],
  jigsAndSettingsUsage: '',
  skillRequired: [],
  estimateHours: '',
  toolType: [],
  equipmentType: [],
  jigType: [],
  steps: [],
  stepNumber: '',
  assemblyStepVisual: '',
  assemblyInstruction: '',
  safetyAndPrecautions: '',
  supporting_file_documents: [],
}
const AssemblyWorkInstructionForm: React.FC<AssemblyWorkInstructionFormProps> = ({
  partAssemblyDetailId,
  assemblyPartItemDetailId,
  onSaveSuccess,
}) => {
  const [openStepModal, setOpenStepModal] = useState(false)
  const [editingStep, setEditingStep] = useState<StepDetail | null>(null)
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  const [errors, setErrors] = useState<Partial<Record<keyof AssemblyWorkInstructionFormData | 'fileUpload', string>>>({})
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])
  const router = useRouter()

  // Initialize form data state
  const [formData, setFormData] = useState<AssemblyWorkInstructionFormData>({
    productName: '',
    modelNo: '',
    assemblyPartName: '',
    assemblyPartCode: '',
    descriptionOfAssembly: '',
    partLegend: '',
    partDetails: [],
    jigsAndSettingsUsage: '',
    skillRequired: [],
    estimateHours: '',
    toolType: [],
    equipmentType: [],
    jigType: [],
    steps: [],
    stepNumber: '',
    assemblyStepVisual: '',
    assemblyInstruction: '',
    safetyAndPrecautions: '',
    supporting_file_documents: [],
  })

  // Fetch dropdown data
  const { data: toolsData } = useTools()
  const { data: equipmentData } = useEquipment()
  const { data: skillsData } = useFetchSkills(NUMBERMAP.ONE)
  const { data: jigsTypeData } = useAllJigsTypes(NUMBERMAP.ONE)

  // Fetch assembly work instruction data
  const { data: assemblyWorkInstructionData, isLoading: isLoadingData } = useAssemblyWorkInstructionById(
    assemblyPartItemDetailId,
    !!assemblyPartItemDetailId
  )

  // Mutation for saving
  const { mutate: upsertAssemblyWorkInstruction, isPending: isSaving } = useUpsertAssemblyWorkInstruction()

  // Draft save hook
  const isAddMode = !assemblyPartItemDetailId
  const contextInstanceIdForDraft = isAddMode ? null : assemblyPartItemDetailId
  const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'assembly_work_instruction',
    context_instance_id: contextInstanceIdForDraft,
    enableFetch: isAddMode
  })

  // Normalize part details so each row has id, sno, partCode, partName (for Data Grid)
  const normalizePartDetails = (raw: any[]): PartDetail[] =>
    Array.isArray(raw)
      ? raw.map((p: any, i: number) => {
        return {
          ...p,
        part_number : p?.part_number ?? i + NUMBERMAP.ONE,
        }
      })
      : []

  // Load draft data when fetched
  useEffect(() => {
    if (draftData?.data && isAddMode) {
      const draftFormData = draftData.data
      setFormData((prev) => ({
        ...prev,
        supporting_file_documents: draftFormData.supporting_file_documents ?? [],
        productName: draftFormData.productName ?? '',
        assemblyPartName: draftFormData.assemblyPartName ?? '',
        assemblyPartCode: draftFormData.assemblyPartCode ?? '',
        descriptionOfAssembly: draftFormData.descriptionOfAssembly ?? '',
        partLegend: draftFormData.partLegend ?? '',
        partDetails: normalizePartDetails(draftFormData.partDetails ?? []),
        jigsAndSettingsUsage: draftFormData.jigsAndSettingsUsage ?? '',
        skillRequired: draftFormData.skillRequired ?? [],
        estimateHours: draftFormData.estimateHours ?? '',
        toolType: draftFormData.toolType ?? [],
        equipmentType: draftFormData.equipmentType ?? [],
        jigType: draftFormData.jigType ?? [],
        steps: draftFormData.steps ?? [],
        stepNumber: draftFormData.stepNumber ?? '',
        assemblyStepVisual: draftFormData.assemblyStepVisual ?? '',
        assemblyInstruction: draftFormData.assemblyInstruction ?? '',
        safetyAndPrecautions: draftFormData.safetyAndPrecautions ?? '',
      }))
      setDraftDocuments(draftFormData.draftDocuments ?? {})
      setDraftDelete(draftFormData.draftDelete ?? [])
    }
  }, [draftData, isAddMode])

  // Load data when fetched (API returns [{}] initially, {} after draft save)
  useEffect(() => {
    const rawData = assemblyWorkInstructionData?.data
    if (!rawData) return

    const assemblyWorkApiData = Array.isArray(rawData)
      ? rawData[NUMBERMAP.ZERO]
      : rawData

    if (!assemblyWorkApiData || typeof assemblyWorkApiData !== 'object') return

    const apiData = assemblyWorkApiData as Record<string, any>
    const mergedDocuments = [
      ...(assemblyWorkApiData?.supporting_file_documents ?? []),
      ...(apiData?.draftDocuments?.supporting_file_documents ?? []),
      ...(apiData?.documents ?? []),
    ]

    const uniqueAssemblyWorkDocuments = mergedDocuments.reduce((acc: any[], doc: any) => {
      const fileId = doc?.file_id ?? doc?.id ?? doc?.document_id ?? doc?.fk_eqms_file_id
      if (fileId === undefined || fileId === null) {
        return acc
      }
      const exists = acc.some((item) => {
        const existingId = item?.file_id ?? item?.id ?? item?.document_id ?? item?.fk_eqms_file_id
        return String(existingId) === String(fileId)
      })
      if (!exists) acc.push(doc)
      return acc
    }, [])

    const partDetails = normalizePartDetails(
      apiData.partDetails ?? assemblyWorkApiData.assembly_part_details ?? []
    )

    const rawSteps = apiData.steps ?? assemblyWorkApiData.add_steps ?? []
    const steps: StepDetail[] = Array.isArray(rawSteps)
      ? rawSteps.map((step: any, index: number) => ({
          id: step.step_id ?? step.id ?? `step-${index}`,
          stepNumber: step.step_no ?? step.stepNumber ?? '',
          assemblyInstruction: step.assembly_instruction ?? step.assemblyInstruction ?? '',
          description: step.safety_precautions ?? step.safetyAndPrecautions ?? '',
          assemblyStepVisual: step.assembly_step_visuals ?? step.assemblyStepVisual ?? '',
          safetyAndPrecautions: step.safety_precautions ?? step.safetyAndPrecautions ?? '',
        }))
      : []

    setFormData((prev) => ({
      ...prev,
      supporting_file_documents: uniqueAssemblyWorkDocuments,
      productName: apiData.productName ?? assemblyWorkApiData.product_name ?? '',
      modelNo: apiData.modelNo ?? apiData.model_no ?? '',
      assemblyPartName: apiData.assemblyPartName ?? assemblyWorkApiData.assembly_part_name ?? '',
      assemblyPartCode: apiData.assemblyPartCode ?? assemblyWorkApiData.assembly_part_code ?? '',
      descriptionOfAssembly: apiData.descriptionOfAssembly ?? assemblyWorkApiData.description_of_assembly ?? '',
      partLegend: apiData.partLegend ?? assemblyWorkApiData.part_legend ?? '',
      partDetails,
      jigsAndSettingsUsage: apiData.jigsAndSettingsUsage ?? assemblyWorkApiData.jigs_and_settings ?? '',
      skillRequired: apiData.skillRequired ?? assemblyWorkApiData.skills_required ?? [],
      estimateHours: apiData.estimateHours ?? assemblyWorkApiData.estimated_hours ?? '',
      toolType: apiData.toolType ?? assemblyWorkApiData.tool_type ?? [],
      equipmentType: apiData.equipmentType ?? assemblyWorkApiData.equipment_type ?? [],
      jigType: apiData.jigType ?? assemblyWorkApiData.jig_type ?? [],
      steps,
      stepNumber: apiData.stepNumber ?? '',
      assemblyStepVisual: apiData.assemblyStepVisual ?? '',
      assemblyInstruction: apiData.assemblyInstruction ?? '',
      safetyAndPrecautions: apiData.safetyAndPrecautions ?? '',
    }))
    setDraftDocuments(apiData.draftDocuments ?? {})
    setDraftDelete(Array.isArray(apiData.draftDelete) ? apiData.draftDelete : Object.values(apiData.draftDelete ?? {}).flat())
  }, [assemblyWorkInstructionData])

  // Fetch draft on mount for add mode
  useEffect(() => {
    if (isAddMode) {
      fetchDraft()
    }
  }, [isAddMode, fetchDraft])

  const handleDraftSave = useCallback((formDataToSave: AssemblyWorkInstructionFormData, fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = isAddMode ? draftData : assemblyWorkInstructionData
    
    const draftConfig = {
      fileFieldToSectionMap: { 'supporting_file_documents': 'supporting_file_documents' },
      sectionTypeToNameMap: { 'supporting_file_documents': 'supporting_file_documents' },
      responseDataKeyMap: { 'supporting_file_documents': 'supporting_file_documents' },
    }

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, supporting_file_documents: formDataToSave.supporting_file_documents ?? [] },
      { supporting_file_documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )

    if (draftPreparation.draftDocuments) {
      setDraftDocuments(draftPreparation.draftDocuments)
    }
    if (draftPreparation.draftDelete) {
      const deleteArray = Array.isArray(draftPreparation.draftDelete)
        ? draftPreparation.draftDelete
        : Object.values(draftPreparation.draftDelete).flat()
      setDraftDelete(deleteArray)
    }

    const fieldsToRemove = ['supporting_file_documents']
    const Obj = { ...formDataToSave }
    const cleaned = Object.fromEntries(
      Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key))
    )

    const payload = {
      id: contextInstanceIdForDraft ?? Date.now(),
      ...cleaned,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      type: 'draft',
    }
    draftSave({
      form_data: payload,
      upload_documents: {
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: draftPreparation.updateMetaData,
        documents_to_delete: [],
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }, [draftDocuments, draftDelete, finalFileData, isAddMode, draftData, assemblyWorkInstructionData, contextInstanceIdForDraft, draftSave])

  const updateFormData = useCallback((updates: Partial<AssemblyWorkInstructionFormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...updates }
      // Auto-save draft when form data changes (debounced)
      handleDraftSave(updated)
      return updated
    })
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates) as Array<keyof AssemblyWorkInstructionFormData>
    setErrors((prev) => {
      const newErrors = { ...prev }
      updatedFields.forEach((field) => {
        if (newErrors[field]) {
          delete newErrors[field]
        }
      })
      return newErrors
    })
  }, [handleDraftSave])
  const handleFileRemoveFromFormData = useCallback((fileIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      supporting_file_documents: prev?.supporting_file_documents?.filter((file) => !fileIds.includes(file.file_id ?? file?.file?.name?.split('.')[NUMBERMAP.ZERO] ?? '')) ?? [],
    }))
  }, [])
  const handleFileUploadChange = useCallback((fileData: FinalFileData) => {
    handleFileRemoveFromFormData([...fileData.local_files_to_delete, ...fileData.documents_to_delete])
    setFinalFileData((prev) => {
      const mergedData = mergeFinalFileData(prev, fileData)
      // Auto-save draft when file data changes
      handleDraftSave(formData, mergedData)
      return mergedData
    })
    // Clear file upload error when files are uploaded
    if (errors.fileUpload) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.fileUpload
        return newErrors
      })
    }
  }, [errors.fileUpload, formData, handleDraftSave])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AssemblyWorkInstructionFormData | 'fileUpload', string>> = {}

    // Description of Assembly* - required string
    if (!formData.descriptionOfAssembly?.trim()) {
      newErrors.descriptionOfAssembly = 'Description of Assembly is required'
    }

    // Part Legend* - required string
    if (!formData.partLegend?.trim()) {
      newErrors.partLegend = 'Part Legend is required'
    }

    // Jigs and Settings Usage* - required string
    if (!formData.jigsAndSettingsUsage?.trim()) {
      newErrors.jigsAndSettingsUsage = 'Jigs and Settings Usage is required'
    }

    // Skill Required* - required array
    if (!Array.isArray(formData.skillRequired) || formData.skillRequired.length === NUMBERMAP.ZERO) {
      newErrors.skillRequired = 'Skill Required is required'
    }

    // Tool Type - required array
    if (!Array.isArray(formData.toolType) || formData.toolType.length === NUMBERMAP.ZERO) {
      newErrors.toolType = 'Tool Type is required'
    }

    // Equipment Type - required array
    if (!Array.isArray(formData.equipmentType) || formData.equipmentType.length === NUMBERMAP.ZERO) {
      newErrors.equipmentType = 'Equipment Type is required'
    }

    // Jig Type - required array
    if (!Array.isArray(formData.jigType) || formData.jigType.length === NUMBERMAP.ZERO) {
      newErrors.jigType = 'Jig Type is required'
    }

    // File/documents validation
    if (!isDocumentUploadValid(finalFileData, formData?.supporting_file_documents ??[])) {
      newErrors.fileUpload = 'File/documents are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(`/production/part-assembly-settings/${partAssemblyDetailId}`)
  }

  const handleSave = useCallback(() => {
    // Validate form before saving
    if (!validateForm()) {
      return
    }
    clearDraftSave()

    // Prepare file metadata at save time (vendor list pattern) so files are included in normal save
    const rawData = assemblyWorkInstructionData?.data
    const normalizedRecord =
      rawData && (Array.isArray(rawData) ? rawData[NUMBERMAP.ZERO] : rawData)
    const existingDataForFile = {
      data: normalizedRecord
        ? {
            ...normalizedRecord,
            supporting_file_documents: formData.supporting_file_documents ?? [],
            draftDocuments,
            draftDelete:
              typeof draftDelete === 'object' && draftDelete !== null && !Array.isArray(draftDelete)
                ? draftDelete
                : { supporting_file_documents: Array.isArray(draftDelete) ? draftDelete : [] },
          }
        : {
            supporting_file_documents: formData.supporting_file_documents ?? [],
            draftDocuments,
            draftDelete: { supporting_file_documents: Array.isArray(draftDelete) ? draftDelete : [] },
          },
    }
    const fileMetadata = createFileMetadataUtil({
      isEditMode: !!assemblyPartItemDetailId,
      draftData,
      existingData: existingDataForFile,
      finalFileData,
      dataPath: 'supporting_file_documents',
    })
    const updatedFileData: FinalFileData = {
      ...finalFileData,
      create_meta_data: fileMetadata.create_meta_data,
      update_meta_data: fileMetadata.update_meta_data,
      documents_to_delete: fileMetadata.documents_to_delete.map(String),
    }

    // Build FormData for assembly work instruction
    const formDataPayload = new FormData()

    if (!assemblyPartItemDetailId) {
      return
    }

    // Append basic fields
    formDataPayload.append('applicable_settings_id', assemblyPartItemDetailId.toString())
    formDataPayload.append('description_of_assembly', formData.descriptionOfAssembly ?? '')
    formDataPayload.append('part_legend', formData.partLegend ?? '')
    formDataPayload.append('jigs_and_settings', formData.jigsAndSettingsUsage ?? '')
    formDataPayload.append('estimated_hours', formData.estimateHours ?? '')

    // Append arrays as JSON strings
    formDataPayload.append('tool_type', JSON.stringify(formData.toolType))
    formDataPayload.append('jig_type', JSON.stringify(formData.jigType))
    formDataPayload.append('equipment_type', JSON.stringify(formData.equipmentType))
    formDataPayload.append('skills_required', JSON.stringify(formData.skillRequired))

    // Append steps as JSON string
    const stepsPayload = formData.steps.map((step) => ({
      step_id: step?.id?.toString()?.startsWith('step-') ? '' : step.id,
      step_no: step.stepNumber,
      assembly_step_visuals: step.assemblyStepVisual ?? '',
      assembly_instruction: step.assemblyInstruction,
      safety_precautions: step.safetyAndPrecautions ?? '',
    }))
    formDataPayload.append('add_steps', JSON.stringify(stepsPayload))

    // Append file data (using updatedFileData so create_meta_data, update_meta_data, documents_to_delete and documents_to_create are included)
    populateFormData(formDataPayload, updatedFileData)
    upsertAssemblyWorkInstruction(formDataPayload, {
      onSuccess: () => {
       showActionAlert("success")
      },
      onError: () => {
        showActionAlert("failed")
      },
    })
  }, [formData, finalFileData, assemblyPartItemDetailId, upsertAssemblyWorkInstruction, onSaveSuccess, clearDraftSave, draftData, draftDocuments, draftDelete, assemblyWorkInstructionData])


  // Part Details columns
  const partDetailColumns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'part_number',
      headerName: 'Part Code',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'part_name',
      headerName: 'Part Name',
      flex: NUMBERMAP.ONE,
    },
  ]

  // Steps columns
  const stepsColumns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF,
    },
    {
      field: 'stepNumber',
      headerName: 'Step Number',
      flex: NUMBERMAP.HALF,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        stripHtml(params.value) ?? ''
      )
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <ActionButton
          onDelete={() => handleDeleteStep(params.row.id)}
          onEdit={() => handleEditStep(params.row)}
        />
      ),
    },
  ]



  const handleDeleteStep = (id: string) => {
    showActionAlert('delete').then((result) => {
      if (!result.isConfirmed) return
      const updatedSteps = formData.steps
        .filter(item => item.id !== id)
        .map((item, index) => ({
          ...item,
          sno: index + 1
        }))
      updateFormData({ steps: updatedSteps })
    })
  }

  const handleEditStep = (row: StepDetail) => {
    setEditingStep(row)
    updateFormData({ 
      stepNumber: row.stepNumber,
      assemblyInstruction: row.assemblyInstruction ?? '',
      assemblyStepVisual: row.assemblyStepVisual ?? '',
      safetyAndPrecautions: row.safetyAndPrecautions ?? '',
    })
    setOpenStepModal(true)
  }

  // Helper function to get the next unique step number
  const getNextStepNumber = (): string => {
    if (!formData.steps || formData.steps.length === NUMBERMAP.ZERO) {
      return '1'
    }
    // Extract all step numbers, convert to numbers, and find the maximum
    const stepNumbers = formData.steps
      .map(step => {
        const num = parseInt(step.stepNumber, 10)
        return isNaN(num) ? NUMBERMAP.ZERO : num
      })
      .filter(num => num > NUMBERMAP.ZERO)
    
    if (stepNumbers.length === NUMBERMAP.ZERO) {
      return '1'
    }
    
    const maxStepNumber = Math.max(...stepNumbers)
    return (maxStepNumber + NUMBERMAP.ONE).toString()
  }

  // Helper function to check if step number is unique
  const isStepNumberUnique = (stepNumber: string, excludeId?: string): boolean => {
    if (!stepNumber?.trim()) {
      return false
    }
    return !formData.steps.some(
      step => step.stepNumber === stepNumber && step.id !== excludeId
    )
  }

  const handleAddStep = () => {
    setEditingStep(null)
    const nextStepNumber = getNextStepNumber()
    updateFormData({ 
      stepNumber: nextStepNumber, 
      assemblyStepVisual: '', 
      assemblyInstruction: '', 
      safetyAndPrecautions: '' 
    })
    setOpenStepModal(true)
  }

  const handleSaveStep = () => {
    if(!formData.safetyAndPrecautions?.trim()) {
      setErrors({ ...errors, safetyAndPrecautions: 'Safety and Precautions is required' })
      return
    }
    
    if (editingStep) {
      // Edit mode - validate step number uniqueness
      if (!isStepNumberUnique(formData.stepNumber, editingStep.id)) {
        setErrors({ ...errors, stepNumber: 'Step Number must be unique' })
        return
      }
      
      const updatedSteps = formData.steps.map(item =>
        item.id === editingStep.id
          ? {
              ...item,
              stepNumber: formData.stepNumber,
              description: formData.safetyAndPrecautions,
              assemblyInstruction: formData.assemblyInstruction,
              assemblyStepVisual: formData.assemblyStepVisual,
              safetyAndPrecautions: formData.safetyAndPrecautions,
            }
          : item
      )
      updateFormData({ steps: updatedSteps })
    } else {
      // Add mode - use the next unique step number
      const nextStepNumber = getNextStepNumber()
      const newStep: StepDetail = {
        id: `step-${Date.now()}`,
        sno: formData?.steps?.length + NUMBERMAP.ONE,
        stepNumber: nextStepNumber,
        description: formData.safetyAndPrecautions,
        assemblyInstruction: formData.assemblyInstruction,
        assemblyStepVisual: formData.assemblyStepVisual,
        safetyAndPrecautions: formData.safetyAndPrecautions,
      }
      updateFormData({ steps: [...formData.steps, newStep] })
    }
    setOpenStepModal(false)
    setEditingStep(null)
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.stepNumber
      delete newErrors.safetyAndPrecautions
      return newErrors
    })
    updateFormData({ stepNumber: '', assemblyStepVisual: '', assemblyInstruction: '', safetyAndPrecautions: '' })
  }

  return (
    <>
      {isDraftSaving && <DraftLoading />}
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ padding: P20P40 }}>
        {/* Product name - InfoField */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField label="Product Name" value={formData.productName ?? 'N/A'} />
        </Grid2>



        {/* Assembly Part Name - InfoField */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField label="Assembly Part Name" value={formData.assemblyPartName ?? 'N/A'} />
        </Grid2>

        {/* Assembly Part Code - InfoField */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InfoField label="Assembly Part Code" value={formData.assemblyPartCode ?? 'N/A'} />
        </Grid2>

        {/* Description of Assembly * - Description */}
        <Grid2 size={{ xs: NUMBERMAP.SIX }}>
          <Description
            label={'Description of Assembly*'}
            placeholder={'Enter Description of Assembly'}
            value={formData.descriptionOfAssembly}
            onChange={(value: string) => updateFormData({ descriptionOfAssembly: value })}
            error={errors.descriptionOfAssembly}
          />
        </Grid2>

        {/* Part Legend* - InputField */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <InputField
            label={'Part Legend*'}
            placeholder={'Enter Part Legend'}
            value={formData.partLegend}
            onChange={(value: string) => updateFormData({ partLegend: value })}
            error={errors.partLegend}
          />
        </Grid2>

        {/* Part Details - DataGridTable */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title="Part Details"
            rows={formData.partDetails}
            columns={partDetailColumns}
            idField="part_number"
            loading={false}
            hideFooter={true}
          />
        </Grid2>

        {/* Jigs and Settings Usage* - Description */}
        <Grid2 size={{ xs: NUMBERMAP.SIX }}>
          <Description
            label={'Jigs and Settings Usage*'}
            placeholder={'Enter Jigs and Settings Usage'}
            value={formData.jigsAndSettingsUsage}
            onChange={(value: string) => updateFormData({ jigsAndSettingsUsage: value })}
            error={errors.jigsAndSettingsUsage}
          />
        </Grid2>

        {/* Skill Required * - MultiSelect dropdown */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <MultiSelect
            label={'Skill Required*'}
            placeholder={'Select Skill Required'}
            options={skillsData?.data ?? []}
            idField="skill_id"
            valueField="skill_name"
            value={formData.skillRequired}
            onChange={(value: (string | number)[]) => updateFormData({ skillRequired: value })}
            error={errors.skillRequired ?? ''}
          />
        </Grid2>

        {/* Estimate Hours - InputField */}
        <Grid2 size={{ md: NUMBERMAP.SIX }}>
          <InputField
            label={'Estimate Hours'}
            placeholder={'Enter Estimate Hours'}
            value={formData.estimateHours}
            onChange={(value: string) => {
              // Only allow numbers for Estimate Hours field
              if (!numberValidation.test(value) && value !== '') return
              updateFormData({ estimateHours: value })
            }}
          />
        </Grid2>

        {/* Tool type * - MultiSelect */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <MultiSelect
            label={'Tool Type*'}
            placeholder={'Select Tool Type'}
            options={toolsData?.data ?? []}
            idField="tool_id"
            valueField="tool_name"
            value={formData.toolType}
            onChange={(value: (string | number)[]) => updateFormData({ toolType: value })}
            error={errors.toolType ?? ''}
          />
        </Grid2>

        {/* Equipment Type* - MultiSelect */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <MultiSelect
            label={'Equipment Type*'}
            placeholder={'Select Equipment Type'}
            options={equipmentData?.data ?? []}
            idField="equipment_id"
            valueField="equipment_name"
            value={formData.equipmentType}
            onChange={(value: (string | number)[]) => updateFormData({ equipmentType: value })}
            error={errors.equipmentType ?? ''}
          />
        </Grid2>

        {/* Jig Type* - MultiSelect */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <MultiSelect
            label={'Jig Type*'}
            placeholder={'Select Jig Type'}
            options={(jigsTypeData?.data ?? []) as any}
            idField="jigs_type_id"
            valueField="jigs_type_name"
            value={formData.jigType}
            onChange={(value: (string | number)[]) => updateFormData({ jigType: value })}
            error={errors.jigType ?? ''}
          />
        </Grid2>

        {/* Steps - DataGridTable */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <DataGridTable
            title="Steps"
            rows={formData.steps}
            showAddButton
            onAddRow={handleAddStep}
            columns={stepsColumns}
            idField="id"
            loading={false}
            hideFooter={true}
          />
        </Grid2>

        {/* FileUpload Manager */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
          <FileUploadManager
            subHeader='Upload Documents*'
            initialFiles={formData?.supporting_file_documents??[]}
            onFileUpload={(newFile) => handleFileUpload(newFile, setFormData, setErrors, errors, 'supporting_file_documents', 'supporting_file_documents')}
            onFileEdit={(updatedFile) => handleFileEdit(updatedFile, setFormData, 'supporting_file_documents')}
            onSubmit={handleFileUploadChange}
            uploadMandError={errors.fileUpload}
          />
        </Grid2>

        {/* Save Button */}
        <Grid2 size={{ xs: NUMBERMAP.TWELVE }} sx={{ padding: P20P40 }}>
          <ButtonGroup
            buttons={[
              {
                label: 'Save',
                onClick: handleSave,
                disabled: isSaving ?? isLoadingData,
              },
              {
                label: 'Cancel',
                onClick: handleCancel,
              },
            ]}
          />
        </Grid2>
      </Grid2>
      {/* Step Modal */}
      <CommonModal
        open={openStepModal}
        title={editingStep ? 'Edit Step' : 'Add Step'}
        onClose={() => {
          setOpenStepModal(false)
          setEditingStep(null)
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.safetyAndPrecautions
            delete newErrors.stepNumber
            return newErrors
          })
          updateFormData({ stepNumber: '', assemblyStepVisual: '', assemblyInstruction: '', safetyAndPrecautions: '' })
        }}
        onSave={handleSaveStep}
        buttonRequired={true}
        modalMaxWidth="900px"
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={{ ...POPUP_STYLE }}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InfoField 
              label="Step Number" 
              value={editingStep ? formData.stepNumber : getNextStepNumber()} 
            />
          </Grid2>

          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Assembly step Visual'}
              toolbaroptions={{items:['imageUpload']}}
              placeholder={'Enter Assembly step Visual'}
              value={formData.assemblyStepVisual}
              onChange={(value: string) => updateFormData({ assemblyStepVisual: value })}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Assembly Instruction'}
              placeholder={'Enter Assembly Instruction'}
              value={formData.assemblyInstruction}
              onChange={(value: string) => updateFormData({ assemblyInstruction: value })}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={'Safety and Precautions*'}
              error={errors.safetyAndPrecautions ?? ''}
              placeholder={'Enter Safety and Precautions'}
              value={formData.safetyAndPrecautions}
              onChange={(value: string) => updateFormData({ safetyAndPrecautions: value })}
            />
          </Grid2>
        </Grid2>
      </CommonModal>
    </>
  )
}

export default AssemblyWorkInstructionForm

