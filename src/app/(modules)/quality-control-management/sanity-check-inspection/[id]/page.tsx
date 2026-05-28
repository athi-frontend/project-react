/**
 * Classification : Confidential
 **/
'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Grid2, Box, IconButton } from '@mui/material'
import { useRouter, useParams } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import { Edit } from 'iconsax-react'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import {
  InputField,
  Label,
  RichTextEditor,
  Description,
  RadioButtonGroup,
} from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { GridRenderCellParams } from '@mui/x-data-grid'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import {
  NUMBERMAP,
  FINALFILEINITIALDATA,
  BUTTONSTYLE,
  BUTTON_LABEL,
  PERMISSION_ACTIONS,
  DRAFT,
} from '@/constants/common'
import {
  mergeFinalFileData,
  FinalFileData,
  stripHtml,
  isDocumentUploadValid,
  numberValidation,
} from '@/lib/utils/common'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { useUpsertSanityCheckInspection } from '@/hooks/modules/quality-control-management/useSanityCheckInspection'
import {
  useAllVendorTypes,
  useAllVendors,
} from '@/hooks/modules/vendor-management/useCommonDropdown'
import {
  usePurchaseOrders,
  usePurchaseOrderDetails,
  useGetPartDetails,
} from '@/hooks/modules/quality-control-management/useCommonDropdown'
import {
  SANITY_CHECK_FORM_LABELS,
  SANITY_CHECK_FORM_PLACEHOLDERS,
  SANITY_CHECK_INITIAL_DATA,
  SANITY_CHECK_DROPDOWN_CONFIG,
  SANITY_CHECK_ERROR_MESSAGES,
  SANITY_CHECK_PAGE_CONSTANTS,
  SANITY_CHECK_TABLE_HEADERS,
  SANITY_CHECK_TABLE_FIELDS,
  SANITY_CHECK_MODAL_CONSTANTS,
  SANITY_CHECK_RESULT_OPTIONS,
  SANITY_CHECK_DISPLAY_VALUES,
  CREATE_MODE_ID,
  SANITY_CHECK_FIELD_MAPPING_DATA,
  SANITY_CHECK_FORM_FIELD_NAMES,
  SANITY_CHECK_TRANSFORM_CONFIG,
  SANITY_CHECK_UI_CONSTANTS,
  SANITY_CHECK_PATHS,
  SANITY_CHECK_PAYLOAD_KEYS,
  SANITY_CHECK_CONTEXT_TYPE,
} from '@/constants/modules/quality-control-management/sanityCheckInspection'
import {
  SanityCheckInspectionFormData,
  SpecificationData,
} from '@/types/modules/quality-control-management/sanityCheckInspection'
import {
  OBSERVATION_CELL_STYLES,
  OBSERVATION_TEXT_STYLES,
  RESULT_CELL_STYLES,
  OBSERVATION_EDIT_ICON_STYLES,
} from '@/styles/modules/quality-control-management/sanityCheckInspection'
import { ErrorText } from '@/styles/common'
import { buildSanityCheckInspectionPayload } from '@/lib/modules/quality-control-management/sanityCheckInspectionPayloadBuilder'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'
import VendorSelectionCriteriaCommonTable from '@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaCommonTable'
import { NestedTransformConfig } from '@/lib/modules/vendor-management/transformNestedHierarchicalData'
import { TruncatedLabelValue } from '@/styles/modules/dnd/projectPlan'
import QCReviewerModalManager from '@/components/modules/quality-control-management/reviewer-modal/QCReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { QC_CONTEXT_TYPE } from '@/constants/commonContextType'

const SanityCheckInspectionForm: React.FC = () => {
  const router = useRouter()
  const params = useParams()
  const theme = useTheme()
  const purchaseOrderId = params?.id
  const isCreateMode = purchaseOrderId === CREATE_MODE_ID
  const isEditMode = purchaseOrderId !== CREATE_MODE_ID

  // Get purchase_order_id from path params
  const purchaseOrderIdFromUrl = isEditMode ? Number(purchaseOrderId) : null
  const partDetailIdFromUrl = null

  const [formData, setFormData] = useState<SanityCheckInspectionFormData>(
    SANITY_CHECK_INITIAL_DATA
  )
  const [tableData, setTableData] = useState<any[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [finalFileData, setFinalFileData] =
    useState<FinalFileData>(FINALFILEINITIALDATA)
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // Observation modal state
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false)
  const [selectedObservationRow, setSelectedObservationRow] =
    useState<any>(null)
  const [observationText, setObservationText] = useState('')

  // Workflow permission state
  const [hasEditPermission, setHasEditPermission] = useState(true)

  // API hooks
  const { data: vendorTypesData } = useAllVendorTypes(NUMBERMAP.ONE)
  const { data: vendorsData } = useAllVendors(
    NUMBERMAP.ONE,
    formData.vendor_type_id ?? undefined
  )
  const { data: purchaseOrdersData } = usePurchaseOrders(
    formData.vendor_id ?? undefined
  )
  const { data: purchaseOrderDetailsData } = usePurchaseOrderDetails(
    isEditMode ? purchaseOrderIdFromUrl : formData.purchase_order_id
  )
  // Single hook call for both edit and create modes
  let selectedPurchaseOrderId: number | null = null
  if (isEditMode) {
    selectedPurchaseOrderId = purchaseOrderIdFromUrl ? Number(purchaseOrderIdFromUrl) : null
  } else {
    selectedPurchaseOrderId = formData.purchase_order_id
  }
  const {
    data: partDetailsData,
    refetch: refetchPartDetailsData,
    isLoading: isLoadingSanityCheck,
  } = useGetPartDetails(
    selectedPurchaseOrderId ?? null,
    formData.part_detail_id ? Number(formData.part_detail_id) : null
  )

  const radioOptions = [
    {
      value: SANITY_CHECK_RESULT_OPTIONS.PASS,
      label: SANITY_CHECK_RESULT_OPTIONS.PASS,
    },
    {
      value: SANITY_CHECK_RESULT_OPTIONS.FAIL,
      label: SANITY_CHECK_RESULT_OPTIONS.FAIL,
    },
  ]

  const refetchWorkflow = () => {
    refetchPartDetailsData()
  }

  const { mutate: upsertSanityCheck, isPending: isUpsertLoading } =
    useUpsertSanityCheckInspection()

  // Draft save hook
  const partDetailIdForDraft = formData.part_detail_id ? Number(formData.part_detail_id) : null
  const { draftSave, clearDraftSave, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: SANITY_CHECK_CONTEXT_TYPE,
    context_instance_id: partDetailIdForDraft
  })

  // Reset form for create mode
  useEffect(() => {
    if (isCreateMode) {
      // Reset form for create mode
      setFormData({
        ...SANITY_CHECK_INITIAL_DATA,
        purchase_order_id: purchaseOrderIdFromUrl
          ? Number(purchaseOrderIdFromUrl)
          : null,
        part_detail_id: partDetailIdFromUrl
          ? Number(partDetailIdFromUrl)
          : null,
      })
      setTableData([])
      setErrors({})
      setFinalFileData(FINALFILEINITIALDATA)
    }
  }, [isCreateMode])

  // Load purchase order data for edit mode
  useEffect(() => {
    if (isEditMode && purchaseOrderDetailsData?.data?.[NUMBERMAP.ZERO]) {
      const poData = purchaseOrderDetailsData.data[NUMBERMAP.ZERO]
      // Prefill basic purchase order data
      setFormData((prev) => {
        // Preserve purchase_order_id from URL in edit mode
        const preservedPurchaseOrderId = isEditMode && purchaseOrderIdFromUrl 
        const updated = {
          ...prev,
          purchase_order_id: preservedPurchaseOrderId ? purchaseOrderIdFromUrl : poData?.purchase_order_id ?? prev.purchase_order_id,
          purchase_order_number: poData.purchase_order_number ?? prev.purchase_order_number,
          purchase_order_date: poData.purchase_order_date ?? prev.purchase_order_date,
          vendor_id: poData.vendor_id ?? prev.vendor_id,
          vendor_type_id: poData.vendor_type_id ?? prev.vendor_type_id,
        }
        return updated
      })
    }
  }, [purchaseOrderDetailsData])

  // Load sanity check inspection data for edit mode (when part_detail_id is set)
  useEffect(() => {
    let existingData = null
    if (partDetailsData?.data && typeof partDetailsData?.data === 'object' && (partDetailsData?.data as any).type === DRAFT) {
      existingData = partDetailsData?.data
    } else if (Array.isArray(partDetailsData?.data) && partDetailsData?.data.length > NUMBERMAP.ZERO) {
      existingData = partDetailsData?.data[NUMBERMAP.ZERO] ?? null
    }
    if (existingData) {
        if (existingData?.draftDocuments) {
          setDraftDocuments(existingData.draftDocuments ?? {})
        }
        if (existingData?.draftDelete) {
          const deleteArray = existingData?.draftDelete ?? []
          setDraftDelete(deleteArray)
        }
        setFormData({
          ...existingData,
          purchase_order_id: purchaseOrderIdFromUrl ?? existingData.purchase_order_id, // Preserve purchase_order_id from URL
          supply_reference_number: existingData.supply_reference_number ?? null,
          part_number_id: existingData.purchase_order_part_detail_id,
          part_detail_id: existingData.purchase_order_part_detail_id ?? existingData.part_detail_id, // Set part_detail_id for workflow condition
          sanity_check_inspection_id: existingData.sanity_check_inspection_id, // Set sanity_check_inspection_id for workflow contextId
          // Prefill part-related fields from API response
          part_type: existingData.part_type ?? null,
          part_category_sub_type: existingData.part_category_sub_type ?? null,
          part_sub_class: existingData.part_sub_class ?? null,
          part_category: existingData.part_category ?? null,
          order_quantity: existingData.order_quantity ?? null,
          po_reference_number: existingData.po_reference_number ?? null,
          safety_critical: existingData.safety_critical ?? null,
          aql: existingData.aql ?? null,
          supply_received: existingData.supply_received ?? null,
          supporting_files: [...(existingData.documents ?? []),...(existingData.supporting_files ?? []),...(existingData.draftDocuments?.supporting_files??[])],
        })
        setFinalFileData(FINALFILEINITIALDATA)
        // Set spec_results for table if available
        if (existingData?.spec_results && Array.isArray(existingData?.spec_results)) {
          setTableData(existingData?.spec_results ?? [])
        }
    }
  }, [partDetailsData])

  // Refetch part details data when part_detail_id changes
  useEffect(() => {
    if (formData.part_detail_id) {
      refetchPartDetailsData()
    }
  }, [formData.part_detail_id])

  // Auto-populate fields when part details are fetched (after part selection - for both create and edit mode)
 

  const handleObservationClick = (row: any) => {
    if (row.isParent) return // Don't allow editing parent rows
    if (!hasEditPermission) return // Don't allow editing without permission
    setSelectedObservationRow(row)
    setObservationText(
      row.observation ??
      row.observations ??
      SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
    )
    setIsObservationModalOpen(true)
  }

  // Helper function to update specification detail with observation
  const updateSpecificationWithObservation = (
    spec: any,
    specificationDetailId: string | number,
    observationText: string
  ) => {
    if (
      String(spec.specification_detail_id) === String(specificationDetailId)
    ) {
      return {
        ...spec,
        observation: observationText,
        observations: observationText,
      }
    }
    return spec
  }

  // Helper function to update group with observation
  const updateGroupWithObservation = (
    group: any,
    specificationDetailId: string | number,
    observationText: string
  ) => {
    if (
      !group?.specification_details ||
      !Array.isArray(group?.specification_details)
    ) {
      return group
    }

    return {
      ...group,
      specification_details: group?.specification_details?.map((spec: any) =>
        updateSpecificationWithObservation(
          spec,
          specificationDetailId,
          observationText
        )
      ) ?? [],
    }
  }

  // Returns true if all criteria have both observation and result, false otherwise
  const checkAllCriteriaValid = (data: any[]) => {
    // If spec_results is empty (length 0), no validation needed
    if (!data || data.length === NUMBERMAP.ZERO) {
      return true
    } else {
      // Validate when spec_results has data
      let hasCriteriaErrors = false
      data?.forEach((group) => {
        if (group?.specification_details && Array.isArray(group?.specification_details)) {
          hasCriteriaErrors = group?.specification_details?.some((spec: any) => spec.verification_result_id != null && spec.observation != null)
        }
      })
      return hasCriteriaErrors
    }
  }

  const handleObservationSave = () => {
    if (!selectedObservationRow) {
      handleObservationCancel()
      return
    }

    // Get the specification_detail_id from the transformed row
    // Try group_criteria_mapper_id first (set from specification_detail_id by transform)
    // Then try specification_detail_id directly, then fall back to sub_group_id
    const specificationDetailId =
      selectedObservationRow.group_criteria_mapper_id ??
      selectedObservationRow.specification_detail_id ??
      selectedObservationRow.sub_group_id

    if (!specificationDetailId) {
      handleObservationCancel()
      return
    }

    setTableData((prev) => {
      const updated = prev.map((group) =>
        updateGroupWithObservation(
          group,
          specificationDetailId,
          observationText
        )
      )

      // Clear error if all criteria are now valid
      if (errors.criteriaValidation && checkAllCriteriaValid(updated)) {
        setErrors((prev) => {
          const updatedErrors = { ...prev }
          delete updatedErrors.criteriaValidation
          return updatedErrors
        })
      }
      handleDraftSave(formData,updated)
      return updated
    })

    handleObservationCancel()
  }

  const handleObservationCancel = () => {
    setIsObservationModalOpen(false)
    setSelectedObservationRow(null)
    setObservationText(SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING)
  }

  // Helper function to update specification detail with result
  const updateSpecificationWithResult = (
    spec: any,
    specificationDetailId: string | number,
    value: string,
    resultId: string | null
  ) => {
    if (
      String(spec.specification_detail_id) === String(specificationDetailId)
    ) {
      return {
        ...spec,
        result: value,
        result_id: resultId,
        verification_result_id: resultId,
      }
    }
    return spec
  }

  // Helper function to update group with result
  const updateGroupWithResult = (
    group: any,
    specificationDetailId: string | number,
    value: string,
    resultId: string | null
  ) => {
    if (
      !group.specification_details ||
      !Array.isArray(group.specification_details)
    ) {
      return group
    }

    return {
      ...group,
      specification_details: group?.specification_details?.map((spec: any) =>
        updateSpecificationWithResult(
          spec,
          specificationDetailId,
          value,
          resultId
        )
      )??[],
    }
  }

  // Handle result change
  const handleResultChange = (
    specificationDetailId: string | number,
    value: string
  ) => {
    if (!hasEditPermission) return // Don't allow editing without permission

    const resultId: string | null = (() => {
      if (value === SANITY_CHECK_RESULT_OPTIONS.PASS) {
        return String(NUMBERMAP.ONE)
      }
      if (value === SANITY_CHECK_RESULT_OPTIONS.FAIL) {
        return String(NUMBERMAP.TWO)
      }
      return null
    })()

    setTableData((prev) => {
      const updated = prev.map((group) =>
        updateGroupWithResult(group, specificationDetailId, value, resultId)
      )

      // Clear error if all criteria are now valid
      if (errors.criteriaValidation && checkAllCriteriaValid(updated)) {
        setErrors((prev) => {
          const updatedErrors = { ...prev }
          delete updatedErrors.criteriaValidation
          return updatedErrors
        })
      }
      handleDraftSave(formData,updated)
      return updated
    })
  }

  // Custom column renderers
  const renderObservationsCell = (params: GridRenderCellParams) => {
    const row = params.row as any
    if (row.isParent) {
      return <Box />
    }

    const hasObservation = row.observation ?? row.observations

    if (!hasObservation) {
      return (
        <IconButton
          sx={OBSERVATION_EDIT_ICON_STYLES}
          onClick={() => handleObservationClick(row)}
          size="small"
          aria-label={SANITY_CHECK_UI_CONSTANTS.ARIA_LABEL_EDIT_OBSERVATION}
        >
          <Edit size={NUMBERMAP.EIGHTEEN} color={theme.palette.primary.main} />
        </IconButton>
      )
    }

    // Strip HTML tags for display
    const textContent = stripHtml(hasObservation)

    return (
      <Box sx={OBSERVATION_CELL_STYLES}>
        <TruncatedLabelValue
          sx={OBSERVATION_TEXT_STYLES}
          onClick={() => handleObservationClick(row)}
        >
          {textContent}
        </TruncatedLabelValue>
      </Box>
    )
  }

  const renderResultCell = (params: GridRenderCellParams) => {
    const row = params.row as any
    if (row.isParent) {
      return <Box />
    }

    // Determine current result value
    // Check result field first, then result_id (mapped from verification_result_id), then verification_result_id directly
    let resultValue = row.result
    if (
      !resultValue ||
      resultValue === SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
    ) {
      // Check result_id (mapped from verification_result_id by transform) or verification_result_id directly
      const resultId = row.result_id ?? row.verification_result_id
      if (resultId === NUMBERMAP.ONE) {
        resultValue = SANITY_CHECK_RESULT_OPTIONS.PASS
      } else if (resultId === NUMBERMAP.TWO) {
        resultValue = SANITY_CHECK_RESULT_OPTIONS.FAIL
      } else {
        resultValue = SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
      }
    }

    // Ensure value matches one of the radio options or is empty
    const currentValue =
      resultValue === SANITY_CHECK_RESULT_OPTIONS.PASS ||
        resultValue === SANITY_CHECK_RESULT_OPTIONS.FAIL
        ? resultValue
        : SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING

    // Get the specification_detail_id from the transformed row
    // Try group_criteria_mapper_id first (set from specification_detail_id by transform)
    // Then try specification_detail_id directly, then fall back to sub_group_id
    const specificationDetailId =
      row.group_criteria_mapper_id ??
      row.specification_detail_id ??
      row.sub_group_id

    return (
      <Box sx={RESULT_CELL_STYLES}>
        <RadioButtonGroup
          label={SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING}
          name={`${SANITY_CHECK_UI_CONSTANTS.RADIO_BUTTON_NAME_PREFIX}${specificationDetailId}`}
          options={radioOptions}
          value={currentValue}
          onChange={(value) => {
            if (specificationDetailId) {
              handleResultChange(specificationDetailId, value as string)
            }
          }}
          disabled={!hasEditPermission}
        />
      </Box>
    )
  }

  // Helper function to reset part-related fields
  const resetPartFields = (updated: any) => {
    updated.part_number_id = null
    updated.part_detail_id = null
    updated.part_type = null
    updated.part_category_sub_type = null
    updated.part_sub_class = null
    updated.part_category = null
    updated.order_quantity = null
    updated.po_reference_number = null
    updated.safety_critical = null
    updated.aql = null
    updated.supply_reference_number = null
    updated.supply_received = null
    updated.supporting_files = []
    updated.remarks = null
    updated.spec_results = []
    setTableData([])
    setErrors({})
  }

  // Helper function to reset purchase order fields
  const resetPurchaseOrderFields = (updated: any) => {
    updated.purchase_order_id = null
    updated.purchase_order_number = null
    updated.purchase_order_date = null
  }

  // Helper function to clear table data if in create mode
  const clearTableDataIfCreateMode = () => {
    if (isCreateMode) {
      setTableData([])
    }
  }

  // Helper function to handle vendor type change
  const handleVendorTypeChange = (updated: any) => {
    updated.vendor_id = null
    resetPurchaseOrderFields(updated)
    resetPartFields(updated)
    // Clear additional form fields
    updated.supply_reference_number = null
    updated.supply_received = null
    updated.remarks = null
    // Clear file data
    updated.supporting_files = []
    // Clear table data when vendor type is changed/cleared
    setTableData([])
  }

  // Helper function to handle vendor change
  const handleVendorChange = (updated: any) => {
    resetPurchaseOrderFields(updated)
    resetPartFields(updated)
    clearTableDataIfCreateMode()
  }

  // Helper function to handle purchase order change
  const handlePurchaseOrderChange = (updated: any, value: any) => {
    const selectedPO = purchaseOrdersData?.data?.find(
      (po: any) => po.purchase_order_id === value
    )
    if (selectedPO) {
      updated.purchase_order_number = selectedPO.purchase_order_number
      updated.purchase_order_date = selectedPO.purchase_order_date
    }
    resetPartFields(updated)
    clearTableDataIfCreateMode()
  }

  // Helper function to handle part number change
  const handlePartNumberChange = (updated: any, value: any) => {
    const partDetailId = value ? Number(value) : null
    const partNumberId = value ? Number(value) : null
    resetPartFields(updated)
    updated.part_number_id = partNumberId
    updated.part_detail_id = partDetailId
  }

  const handleDraftSave = (formDataToSave: SanityCheckInspectionFormData, tableDataToSave?: any[], fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    const draftConfig = {
      fileFieldToSectionMap: { 'supporting_files': 'supporting_files' },
      sectionTypeToNameMap: { 'supporting_files': 'supporting_files' },
      responseDataKeyMap: { 'supporting_files': 'supporting_files' },
    }

    // Use partDetailsData for draft data source
    const draftDatas = partDetailsData

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, documents: formDataToSave.supporting_files ?? [] },
      { supporting_files: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )

    if (draftPreparation.draftDocuments) {
      setDraftDocuments(draftPreparation.draftDocuments)
    }
    if (draftPreparation.draftDelete) {
      setDraftDelete(draftPreparation?.draftDelete??[])
    }

    const fieldsToRemove = ['supporting_files']
    const Obj = { ...formDataToSave }
    const cleaned = Object.fromEntries(
      Object.entries(Obj).filter(([key]) => !fieldsToRemove.includes(key))
    )

    const payload = {
      id: partDetailIdForDraft ?? new Date().getTime(),
      ...cleaned,
      spec_results: tableDataToSave ?? tableData ?? [],
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
  }

  const handleInputChange = (field: string, value: any) => {
    // Allow part number selection even without edit permission (needed to fetch permissions)
    // For other fields, require edit permission
    if (field !== SANITY_CHECK_FORM_FIELD_NAMES.PART_NUMBER_ID && !hasEditPermission) {
      return
    }

    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value }

      if (field === SANITY_CHECK_FORM_FIELD_NAMES.VENDOR_TYPE_ID) {
        handleVendorTypeChange(updated)
        // Clear file-related states when vendor type is changed/cleared
        setFinalFileData(FINALFILEINITIALDATA)
      } else if (field === SANITY_CHECK_FORM_FIELD_NAMES.VENDOR_ID) {
        handleVendorChange(updated)
      } else if (field === SANITY_CHECK_FORM_FIELD_NAMES.PURCHASE_ORDER_ID) {
        handlePurchaseOrderChange(updated, value)
      } else if (field === SANITY_CHECK_FORM_FIELD_NAMES.PART_NUMBER_ID) {
        handlePartNumberChange(updated, value)
      } else if (field === SANITY_CHECK_FORM_FIELD_NAMES.SUPPLY_REFERENCE_NO || field === SANITY_CHECK_FORM_FIELD_NAMES.SUPPLY_RECEIVED || field === SANITY_CHECK_FORM_FIELD_NAMES.REMARKS) {
        if (updated?.part_detail_id) {
          handleDraftSave(updated)
        }
      }

      return updated
    })

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING,
      }))
    }
  }

  const createFileMetadata = () => {
    return createFileMetadataUtil({
      isEditMode: !!isEditMode,
      draftData: partDetailsData,
      existingData:  partDetailsData,
      finalFileData: finalFileData,
      dataPath: 'supporting_files',
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.vendor_type_id) {
      newErrors.vendor_type_id =
        SANITY_CHECK_ERROR_MESSAGES.VENDOR_TYPE_REQUIRED
    }
    if (!formData.vendor_id) {
      newErrors.vendor_id = SANITY_CHECK_ERROR_MESSAGES.VENDOR_NAME_REQUIRED
    }
    if (!formData.purchase_order_id) {
      newErrors.purchase_order_id =
        SANITY_CHECK_ERROR_MESSAGES.PURCHASE_ORDER_NUMBER_REQUIRED
    }
    if (!formData.part_number_id) {
      newErrors.part_number_id =
        SANITY_CHECK_ERROR_MESSAGES.PART_NUMBER_REQUIRED
    }
    if (!formData.supply_reference_number) {
      newErrors.supply_reference_number =
        SANITY_CHECK_ERROR_MESSAGES.SUPPLY_REFERENCE_NO_REQUIRED
    }
    if (!formData.supply_received) {
      newErrors.supply_received =
        SANITY_CHECK_ERROR_MESSAGES.SUPPLY_RECEIVED_REQUIRED
    }
    // File/documents validation (no error message shown, just returns false)
    if (!isDocumentUploadValid(finalFileData, formData.supporting_files)) {
      // Optionally set a toast or dialog here if you want user feedback
      newErrors.fileUpload = 'File/documents are required'
    }

    // Validate criteria: each criteria must have both observation and result
    if (!checkAllCriteriaValid(tableData)) {
      newErrors.criteriaValidation = SANITY_CHECK_ERROR_MESSAGES.CRITERIA_VALIDATION_ERROR
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }
    clearDraftSave()
    // Transform specifications from nested table data structure
    const specifications: SpecificationData[] = tableData.flatMap(
      (group: any) => {
        if (
          group?.specification_details &&
          Array.isArray(group?.specification_details)
        ) {
          return group?.specification_details?.map((spec: any) => {
            // Get result_id from verification_result_id (API field) or result_id (UI-updated field)
            const resultIdValue =
              spec.verification_result_id ??
              spec.result_id ??
              SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING

            return {
              specification_detail_id: String(spec.specification_detail_id),
              observation:
                spec.observation ??
                spec.observations ??
                SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING,
              result_id: String(resultIdValue),
              status: spec.status ?? NUMBERMAP.ONE,
            }
          })
        }
        return []
      }
    )

    // Build FormData payload (always use FormData, following vendor-selection-criteria pattern)
    const payload = buildSanityCheckInspectionPayload(
      !!isEditMode,
      isEditMode && formData.sanity_check_inspection_id
        ? formData.sanity_check_inspection_id
        : null,
      formData,
      specifications,
      finalFileData
    )

    // Handle file uploads - supporting_files (documents_to_create)
    if (
      finalFileData.documents_to_create &&
      finalFileData.documents_to_create.length > NUMBERMAP.ZERO
    ) {
      finalFileData.documents_to_create.forEach((file) => {
        payload.append(SANITY_CHECK_PAYLOAD_KEYS.DOCUMENTS_TO_CREATE, file, file.name)
      })
    }

    // Get file metadata using createFileMetadata (handles draft documents)
    const fileMetadata = createFileMetadata()
    if (fileMetadata) {
      payload.append(
        SANITY_CHECK_PAYLOAD_KEYS.DOCUMENTS_TO_DELETE,
        JSON.stringify(fileMetadata.documents_to_delete)
      )
      payload.append(
        SANITY_CHECK_PAYLOAD_KEYS.CREATE_META_DATA,
        JSON.stringify(fileMetadata.create_meta_data)
      )
      payload.append(
        SANITY_CHECK_PAYLOAD_KEYS.UPDATE_META_DATA,
        JSON.stringify(fileMetadata.update_meta_data)
      )
    }

    upsertSanityCheck(payload as any, {
      onSuccess: () => {
        // In workflow mode, refetch to update workflow state (don't navigate)
        // In create mode or non-workflow mode, navigate away
        if (partDetailsData?.meta_info) {
          // Call refetchWorkflow to update workflow state after successful save
          // This ensures workflow state is refreshed after Save action, similar to how
          // QCReviewerModalManager calls refetch for other workflow actions
          refetchWorkflow()
          router.push(SANITY_CHECK_PATHS.BASE_PATH)
        } else {
          router.push(SANITY_CHECK_PATHS.BASE_PATH)
        }
      },
    })
  }

  const handleCancel = async () => {
    if (hasEditPermission) {
      await checkUnsavedDraftBeforeLeave()
    }
    router.push(SANITY_CHECK_PATHS.BASE_PATH)
  }

  const handleFileUpload = (newFile: any) => {
    setErrors((prev) => ({
      ...prev,
      fileUpload: '',
    }))
    const supportingFiles = formData?.supporting_files ?? []
    setFormData((prev) => {
      const updated = {
        ...prev,
        supporting_files: [...supportingFiles, newFile],
      };
      return updated;
    })
  }

  const handleFileEdit = useCallback((documents: any) => {
    setFormData((prev) => {
      const updatedFiles = (prev.supporting_files ?? []).map((file: any) => {
        const currentId =
          typeof file === 'object' ? (file.file_id ?? file.id) : undefined
        const updatedId = documents.file_id ?? documents.id

        return currentId === updatedId ? { ...file, ...documents } : file
      })

      const updated = {
        ...prev,
        supporting_files: updatedFiles,
      };
      return updated;
    })
  }, [tableData, finalFileData])

  const handleFileUploadSubmit = (data: any) => {
    const merged = mergeFinalFileData(finalFileData, data)
    setFinalFileData(merged)

    if (formData?.part_detail_id) {
      handleDraftSave(formData, tableData, merged)
    }

    // Clear file upload error when files are present (same pattern as handleInputChange clears errors for other fields)
    if (isDocumentUploadValid(merged, formData.supporting_files)) {
      setErrors((prev) => ({ ...prev, fileUpload: '' }))
    }
  }

  const getButtonPermissions = () => {
    if (isCreateMode) {
      return [
        { action: BUTTON_LABEL.SAVE },
        { action: BUTTON_LABEL.CANCEL },
        { action: PERMISSION_ACTIONS.VIEW },
      ]
    }
    return partDetailsData?.meta_info?.action_control?.permissions ?? []
  }
  // Define action buttons for create mode (when no workflow permissions are available)


  // Transform config for spec_results
  const transformConfig: NestedTransformConfig = useMemo(
    () => ({
      groupIdField: SANITY_CHECK_TRANSFORM_CONFIG.GROUP_ID_FIELD,
      groupNameField: SANITY_CHECK_TRANSFORM_CONFIG.GROUP_NAME_FIELD,
      groupOrderField: SANITY_CHECK_TRANSFORM_CONFIG.GROUP_ORDER_FIELD,
      criteriaArrayField: SANITY_CHECK_TRANSFORM_CONFIG.CRITERIA_ARRAY_FIELD,
      childIdField: SANITY_CHECK_TRANSFORM_CONFIG.CHILD_ID_FIELD,
      childNameField: SANITY_CHECK_TRANSFORM_CONFIG.CHILD_NAME_FIELD,
      childOrderField: SANITY_CHECK_TRANSFORM_CONFIG.CHILD_ORDER_FIELD,
      fieldMappings: {
        criteria: SANITY_CHECK_TRANSFORM_CONFIG.FIELD_MAPPINGS.CRITERIA,
        observation: SANITY_CHECK_TRANSFORM_CONFIG.FIELD_MAPPINGS.OBSERVATION,
        result_id: SANITY_CHECK_TRANSFORM_CONFIG.FIELD_MAPPINGS.RESULT_ID,
        status: SANITY_CHECK_TRANSFORM_CONFIG.FIELD_MAPPINGS.STATUS,
      },
    }),
    []
  )

  // Define table columns
  const tableColumns = [
    {
      field: SANITY_CHECK_TABLE_FIELDS.SNO,
      headerName: SANITY_CHECK_TABLE_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as any
        if (row.isParent) {
          // Use sno from transformed row data
          const sno = row.sno
          return (
            <Box sx={{ paddingLeft: NUMBERMAP.TWO }}>
              {String(sno)}
            </Box>
          )
        }
        return <Box />
      },
    },
    {
      field: SANITY_CHECK_TABLE_FIELDS.CRITERIA,
      headerName: SANITY_CHECK_TABLE_HEADERS.CRITERIA,
      flex: NUMBERMAP.ONE_HALF,
      headerAlign: SANITY_CHECK_UI_CONSTANTS.HEADER_ALIGN_CENTER,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as any
        return (
          <Box
            sx={{ paddingLeft: row.isParent ? NUMBERMAP.TWO : NUMBERMAP.FOUR }}
          >
            {params.value}
          </Box>
        )
      },
    },
    {
      field: SANITY_CHECK_TABLE_FIELDS.OBSERVATIONS,
      headerName: SANITY_CHECK_TABLE_HEADERS.OBSERVATIONS,
      flex: NUMBERMAP.ONE_HALF,
      headerAlign: SANITY_CHECK_UI_CONSTANTS.HEADER_ALIGN_CENTER,
      renderCell: renderObservationsCell,
    },
    {
      field: SANITY_CHECK_TABLE_FIELDS.RESULT,
      headerName: SANITY_CHECK_TABLE_HEADERS.RESULT,
      flex: NUMBERMAP.ONE_HALF,
      headerAlign: SANITY_CHECK_UI_CONSTANTS.HEADER_ALIGN_CENTER,
      renderCell: renderResultCell,
    },
  ]
  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <Label title={SANITY_CHECK_PAGE_CONSTANTS.PAGE_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={SANITY_CHECK_FORM_LABELS.VENDOR_TYPE}
                placeholder={SANITY_CHECK_FORM_PLACEHOLDERS.VENDOR_TYPE}
                isDropdown
                options={vendorTypesData?.data ?? []}
                value={
                  formData.vendor_type_id ?? null
                }
                onChange={(value: any) =>
                  handleInputChange(
                    SANITY_CHECK_FORM_FIELD_NAMES.VENDOR_TYPE_ID,
                    value
                  )
                }
                error={
                  errors.vendor_type_id ??
                  SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                }
                keyField={SANITY_CHECK_DROPDOWN_CONFIG.VENDOR_TYPE.KEY_FIELD}
                valueField={
                  SANITY_CHECK_DROPDOWN_CONFIG.VENDOR_TYPE.VALUE_FIELD
                }
                disabled={!!isEditMode}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={SANITY_CHECK_FORM_LABELS.VENDOR_NAME}
                placeholder={SANITY_CHECK_FORM_PLACEHOLDERS.VENDOR_NAME}
                isDropdown
                options={vendorsData?.data ?? []}
                value={formData.vendor_id ?? null}
                onChange={(value: any) =>
                  handleInputChange(
                    SANITY_CHECK_FORM_FIELD_NAMES.VENDOR_ID,
                    value
                  )
                }
                error={
                  errors.vendor_id ?? SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                }
                keyField={SANITY_CHECK_DROPDOWN_CONFIG.VENDOR.KEY_FIELD}
                valueField={SANITY_CHECK_DROPDOWN_CONFIG.VENDOR.VALUE_FIELD}
                disabled={
                  isEditMode ||
                  !formData.vendor_type_id ||
                  !hasEditPermission
                }
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={SANITY_CHECK_FORM_LABELS.PURCHASE_ORDER_NUMBER}
                placeholder={
                  SANITY_CHECK_FORM_PLACEHOLDERS.PURCHASE_ORDER_NUMBER
                }
                isDropdown
                options={purchaseOrdersData?.data ?? []}
                value={
                  formData.purchase_order_id ?? null
                }
                onChange={(value: any) =>
                  handleInputChange(
                    SANITY_CHECK_FORM_FIELD_NAMES.PURCHASE_ORDER_ID,
                    value
                  )
                }
                error={
                  errors.purchase_order_id ??
                  SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                }
                keyField={SANITY_CHECK_DROPDOWN_CONFIG.PURCHASE_ORDER.KEY_FIELD}
                valueField={
                  SANITY_CHECK_DROPDOWN_CONFIG.PURCHASE_ORDER.VALUE_FIELD
                }
                disabled={isEditMode || !formData.vendor_id || !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={SANITY_CHECK_FORM_LABELS.PART_NUMBER}
                placeholder={SANITY_CHECK_FORM_PLACEHOLDERS.PART_NUMBER}
                isDropdown
                options={
                  purchaseOrderDetailsData?.data?.[NUMBERMAP.ZERO]
                    ?.part_category_details ?? []
                }
                value={
                  formData.part_number_id ?? null
                }
                onChange={(value: any) =>
                  handleInputChange(
                    SANITY_CHECK_FORM_FIELD_NAMES.PART_NUMBER_ID,
                    value
                  )
                }
                error={
                  errors.part_number_id ??
                  SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                }
                keyField={SANITY_CHECK_DROPDOWN_CONFIG.PART_NUMBER.KEY_FIELD}
                valueField={
                  SANITY_CHECK_DROPDOWN_CONFIG.PART_NUMBER.VALUE_FIELD
                }
                disabled={!formData.purchase_order_id}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            {SANITY_CHECK_FIELD_MAPPING_DATA.map((item) => {
              const fieldValue =
                formData[item.key as keyof SanityCheckInspectionFormData]
              // Handle object values - if it's an object, show '-' instead of '[object Object]'
              const displayValue = (fieldValue === null || fieldValue === undefined || typeof fieldValue === 'object')
                ? SANITY_CHECK_DISPLAY_VALUES.DEFAULT_EMPTY
                : String(fieldValue);
              return (
                <Grid2 size={NUMBERMAP.SIX} key={item.key}>
                  <InfoField label={item.label} value={displayValue} />
                </Grid2>
              )
            })}
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={SANITY_CHECK_FORM_LABELS.SUPPLY_REFERENCE_NO}
                placeholder={SANITY_CHECK_FORM_PLACEHOLDERS.SUPPLY_REFERENCE_NO}
                value={
                  formData.supply_reference_number ??
                  SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                }
                onChange={(value: any) =>
                  handleInputChange(
                    SANITY_CHECK_FORM_FIELD_NAMES.SUPPLY_REFERENCE_NO,
                    value
                  )
                }
                disabled={!hasEditPermission}
                error={
                  errors.supply_reference_number ??
                  SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                }
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={SANITY_CHECK_FORM_LABELS.SUPPLY_RECEIVED}
                placeholder={SANITY_CHECK_FORM_PLACEHOLDERS.SUPPLY_RECEIVED}
                value={
                  formData.supply_received
                    ? String(formData.supply_received)
                    : SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                }
                onChange={(value: any) => {
                  if ((numberValidation.test(value) && value) || value == '') {
                    handleInputChange(
                      SANITY_CHECK_FORM_FIELD_NAMES.SUPPLY_RECEIVED,
                      value ? Number(value) : null
                    )
                  }
                }
                }
                disabled={!hasEditPermission}
                error={
                  errors.supply_received ??
                  SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                }
              />
            </Grid2>
          </Grid2>
        </FormContent>
        <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
            <VendorSelectionCriteriaCommonTable
              rawData={tableData}
              transformConfig={transformConfig}
              onCriteriaReorder={() => { }}
              columns={tableColumns}
              enableDragDrop={false}
              hideHeader={true}
              showAddButton={false}
            />
            {errors.criteriaValidation && (
              <ErrorText>
                {errors.criteriaValidation ?? ''}
              </ErrorText>
            )}
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <FormContent>
              <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
                <Grid2 size={NUMBERMAP.SIX}>
                  <Description
                    label={SANITY_CHECK_FORM_LABELS.REMARKS}
                    placeholder={SANITY_CHECK_FORM_PLACEHOLDERS.REMARKS}
                    value={
                      formData.remarks ?? SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                    }
                    onChange={(value: string) =>
                      handleInputChange(
                        SANITY_CHECK_FORM_FIELD_NAMES.REMARKS,
                        value
                      )
                    }
                    disabled={!hasEditPermission}
                    error={
                      errors.remarks ?? SANITY_CHECK_UI_CONSTANTS.EMPTY_STRING
                    }
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <FileUploadManager
                    initialFiles={formData.supporting_files ?? []}
                    uploadMandError={errors.fileUpload}
                    subHeader='Upload Documents*'
                    onFileUpload={handleFileUpload as any}
                    onFileEdit={handleFileEdit}
                    onSubmit={handleFileUploadSubmit}
                    hasEditable={!isCreateMode && !hasEditPermission}
                  />
                </Grid2>
              </Grid2>
            </FormContent>
          </Grid2>
        </Grid2>
        <Box sx={{ p: NUMBERMAP.TWO }}>
          <CommentsHistory
            comments={partDetailsData?.meta_info?.task_info?.task_comments}
          />
          {(formData.part_detail_id || isCreateMode) && (
            <QCReviewerModalManager
              isLoading={isLoadingSanityCheck}
              permissions={getButtonPermissions()}
              taskInfo={{
                task_comments:
                partDetailsData?.meta_info?.task_info?.task_comments ?? [],
                reviewer_list:
                partDetailsData?.meta_info?.task_info?.reviewer_list ?? [],
                task_id: partDetailsData?.meta_info?.task_info?.task_id,
              }}
              menuId={partDetailsData?.meta_info?.action_control?.menuId}
              menuName={partDetailsData?.meta_info?.action_control?.formName}
              contextType={QC_CONTEXT_TYPE.SANITY_CHECK_INSPECTION}
              contextId={formData.purchase_order_id ?? NUMBERMAP.ZERO}
              uniqueId={(formData.part_detail_id ?? formData.part_number_id) ?? undefined}
              customHandlers={{
                handleCancel: handleCancel,
                handleSave: handleSave,
                isDisabled: isUpsertLoading,
              }}
              onPermissionChange={setHasEditPermission}
              refetch={refetchWorkflow}
            />
          )}
        </Box>
      </FormWrapper>

      {/* Observation Edit Modal */}
      <CommonModal
        open={isObservationModalOpen}
        onClose={handleObservationCancel}
        title={SANITY_CHECK_MODAL_CONSTANTS.EDIT_OBSERVATION_TITLE}
        onSave={handleObservationSave}
        buttonRequired={true}
        modalMaxWidth={SANITY_CHECK_MODAL_CONSTANTS.MODAL_MAX_WIDTH}
      >
        <Box>
          <RichTextEditor
            label={SANITY_CHECK_MODAL_CONSTANTS.OBSERVATION_LABEL}
            value={observationText}
            onChange={setObservationText}
            placeholder={SANITY_CHECK_MODAL_CONSTANTS.OBSERVATION_PLACEHOLDER}
          />
        </Box>
      </CommonModal>
    </FormContainer>
  )
}

export default SanityCheckInspectionForm
