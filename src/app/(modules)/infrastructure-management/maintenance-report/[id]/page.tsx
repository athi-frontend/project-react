'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Box, Grid2, IconButton, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard'
import InputField from '@/components/ui/input-field/InputField'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import {
  DataTable,
  Label,
  showActionAlert,
} from '@/components/ui'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import SalesReviewerModalManager from '@/components/modules/sales/reviewer-modal/SalesReviewerModalManager'
import { INFRASTRUCTURE_CONTEXT_TYPE } from '@/constants/commonContextType'
import ActionsCarriedOutModal from '@/components/modules/infrastructure-management/maintenance-report/ActionsCarriedOutModal'
import { GridColDef } from '@mui/x-data-grid'
import { NUMBERMAP, FINALFILEINITIALDATA, PERMISSION_ACTIONS } from '@/constants/common'
import { ACTION_ICONS_WRAPPER_SX, BOX_STYLES, UnderLineButton } from '@/styles/common'
import { LabelContainer, LabelText, LabelValue } from '@/styles/components/modules/prototypeForm'
import { ButtonContainer } from '@/styles/components/ui/button'
import { Edit } from 'iconsax-react'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { useInfrastructureCategory, useInfrastructureType } from "@/hooks/modules/infrastructure-management/useMaintenancePlan"
import { useInfrastructureSerialNumbers } from '@/hooks/modules/infrastructure-management/useCommonDropdown'
import { useDownloadFile, useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { useGetMaintenanceReportById, useGetMaintenanceReportByInfrastructureId, useSaveMaintenanceReport, useGetEquipmentItems, useGetEquipmentCalibration } from '@/hooks/modules/infrastructure-management/useMaintenanceReport'
import { FinalFileData, mergeFinalFileData, COMMON_CONSTANTS, stripHtml, handleDownloadSuccess, isDocumentUploadValid } from '@/lib/utils/common'
import { FileData as FileDataV3 } from '@/types/components/ui/fileUploadV3'
import { EquipmentDataItem, MaintenanceDetailsDataItem, MaintenanceReportFormData } from '@/types/modules/infrastructure-management/maintenanceReport'
import {
  INITIAL_ERRORS,
  VALIDATION_MESSAGES,
  MAINTENANCE_REPORT_LIST_PATH,
  EQUIPMENT_COLUMN_HEADERS,
  MAINTENANCE_COLUMN_HEADERS,
  EQUIPMENT_COLUMN_FIELDS,
  MAINTENANCE_COLUMN_FIELDS,
  TABLE_HEADER_CLASS_NAME,
  KEY_FIELDS,
  VALUE_FIELDS,
  PLACEHOLDERS,
  LABELS,
  MODAL_TITLES,
  ARIA_LABELS,
  PAGE_TITLES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  DATA_TABLE_ID_FIELD,
  FILE_UPLOAD_SUBHEADER,
  FORM_BUTTON_LABELS,
  INITIAL_FORM_DATA,
} from '@/constants/modules/infrastructure-management/maintenanceReport'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import CalibrationDetails from '@/components/ui/data-table/SingleRowTable'
import { Download } from '@mui/icons-material'
import { DownloadIconSx, STYLES } from '@/styles/components/ui/fileUploadManagerV3'
import { useInfrastructureOnboardingById } from '@/hooks/modules/infrastructure-management/infrastructureOnboardingTabs'
import { Input_Field } from '@/styles/modules/hr/inductionTraining'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { createFileMetadata as createFileMetadataUtil } from '@/lib/utils/draftSave'

const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS
/**
 * Classification : Confidential
 **/

const MaintenanceReportPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const reportId = params?.id
  const isEditMode = reportId && reportId !== 'add' && reportId !== 'create'
  const isCreateMode = !isEditMode
  const theme = useTheme()
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(true)
  const { data: infrastructureCategoryData } = useInfrastructureCategory()
  const { data: infrastructureTypeData } = useInfrastructureType()
  const { data: statusData } = useOrganizationStatus()
  const [maintenanceReportIdForUpadte, setMaintenanceReportIdForUpadte] = useState<number | null>(null)
  // Fetch maintenance report data when in edit mode
  const maintenanceReportId = isEditMode && reportId ? Number(reportId) : undefined
  const { data: maintenanceReportData, refetch: refetchMaintenanceReport, isLoading } = useGetMaintenanceReportById(maintenanceReportId)

  // Modal state
  const [calibrationModalOpen, setCalibrationModalOpen] = useState(false)
  const [selectedCalibrationData, setSelectedCalibrationData] = useState<any>(null)
  const [actionsModalOpen, setActionsModalOpen] = useState(false)
  const [selectedActionData, setSelectedActionData] = useState<any>(null)
  const [editingRowId, setEditingRowId] = useState<number | null>(null)
  const [selectedEquipmentItemId, setSelectedEquipmentItemId] = useState<number | undefined>(undefined)
  const { refetch: downloadDocument } = useDownloadFile(selectedCalibrationData?.documentId ?? null)
  // Form state
  const [formData, setFormData] = useState<MaintenanceReportFormData>(INITIAL_FORM_DATA)

  // Validation errors state
  const [errors, setErrors] = useState<typeof INITIAL_ERRORS>(INITIAL_ERRORS)

  // Fetch serial numbers based on selected infrastructure type
  const selectedTypeId = formData.infrastructureType ? Number(formData.infrastructureType) : undefined
  const { data: serialNumbersData } = useInfrastructureSerialNumbers(selectedTypeId)

  // Fetch infrastructure details based on selected serial number
  const selectedSerialNoId = formData.serialNo ? Number(formData.serialNo) : undefined
  const { data: infrastructureDetailsData } = useInfrastructureOnboardingById(selectedSerialNoId)

  // Fetch maintenance report data by infrastructure_id when serial number is selected (only in create mode)
  const { data: maintenanceReportByInfrastructureData } = useGetMaintenanceReportByInfrastructureId(
    !isEditMode ? (selectedSerialNoId ?? null) : null
  )

  // Fetch equipment items for Equipment Serial No dropdown
  // Note: equipment_id parameter is optional - can be added later if filtering by equipment type is needed
  const { data: equipmentItemsData } = useGetEquipmentItems(undefined, NUMBERMAP.ONE)

  // Fetch calibration details for selected equipment item
  const { data: calibrationData } = useGetEquipmentCalibration(selectedEquipmentItemId, NUMBERMAP.ONE)
  // Equipment data
  const [equipmentData, setEquipmentData] = useState<EquipmentDataItem[]>([])
  // Maintenance details data
  const [maintenanceDetailsData, setMaintenanceDetailsData] = useState<MaintenanceDetailsDataItem[]>([])
  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
  // Draft save state
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // Save mutation
  const { mutate: saveMaintenanceReport } = useSaveMaintenanceReport()

  // Draft save hook
  const maintenanceReportIdForDraft = isEditMode ? (maintenanceReportId ?? null) : null
  const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'infrastructure_id',
    context_instance_id: selectedSerialNoId,
    enableFetch: false
  })

  // Equipment columns
  const equipmentColumns: GridColDef[] = [
    {
      field: EQUIPMENT_COLUMN_FIELDS.SNO,
      headerName: EQUIPMENT_COLUMN_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
      headerClassName: TABLE_HEADER_CLASS_NAME,
    },
    {
      field: EQUIPMENT_COLUMN_FIELDS.EQUIPMENT_CATEGORY,
      headerName: EQUIPMENT_COLUMN_HEADERS.EQUIPMENT_CATEGORY,
      flex: NUMBERMAP.ONE,
      headerClassName: TABLE_HEADER_CLASS_NAME,
    },
    {
      field: EQUIPMENT_COLUMN_FIELDS.EQUIPMENT_TYPE,
      headerName: EQUIPMENT_COLUMN_HEADERS.EQUIPMENT_TYPE,
      flex: NUMBERMAP.ONE,
      headerClassName: TABLE_HEADER_CLASS_NAME,
    },
    {
      field: EQUIPMENT_COLUMN_FIELDS.EQUIPMENT_SERIAL_NO,
      headerName: EQUIPMENT_COLUMN_HEADERS.EQUIPMENT_SERIAL_NO,
      flex: NUMBERMAP.ONE_HALF,
      headerClassName: TABLE_HEADER_CLASS_NAME,
      renderCell: (params) => (
        <Box sx={Input_Field}>
          <InputField
            label=""
            placeholder={PLACEHOLDERS.SELECT_EQUIPMENT_SERIAL_NO}
            isDropdown
            value={params.value ?? ''}
            onChange={(value: string) => {
              if (!hasEditPermission) return
              const updatedData = equipmentData.map((row) =>
                row.id === params.row.id ? { ...row, equipmentSerialNo: value } : row
              )
              setEquipmentData(updatedData)
              // Trigger draft save with updated equipment data
              handleDraftSave(formData, finalFileData, maintenanceDetailsData, updatedData)
            }}
            hasEditable={!hasEditPermission}
            options={equipmentItemsData?.data ?? []}
            keyField={KEY_FIELDS.EQUIPMENT_ITEM_ID}
            valueField={VALUE_FIELDS.EQUIPMENT_ITEM}
          />
        </Box>
      ),
    },
    {
      field: EQUIPMENT_COLUMN_FIELDS.CALIBRATION_DETAILS,
      headerName: EQUIPMENT_COLUMN_HEADERS.CALIBRATION_DETAILS,
      flex: NUMBERMAP.ONE,
      headerClassName: TABLE_HEADER_CLASS_NAME,
      renderCell: (params) => {
        const equipmentItemId = params.row.equipmentSerialNo ? Number(params.row.equipmentSerialNo) : undefined
        return (
          <UnderLineButton
            onClick={() => {
              if (equipmentItemId) {
                setSelectedEquipmentItemId(equipmentItemId)
                setCalibrationModalOpen(true)
              } else {
                setSelectedCalibrationData({
                  status: "",
                  date: "",
                  due: "",
                  certificateUrl: '',
                })
                setCalibrationModalOpen(true)
              }
            }}>
            View Details
          </UnderLineButton>
        )
      },
    },
  ]

  // Maintenance details columns
  const maintenanceColumns: GridColDef[] = [
    {
      field: MAINTENANCE_COLUMN_FIELDS.SNO,
      headerName: MAINTENANCE_COLUMN_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
      headerClassName: TABLE_HEADER_CLASS_NAME,
    },
    {
      field: MAINTENANCE_COLUMN_FIELDS.MAINTENANCE_DESCRIPTION,
      headerName: MAINTENANCE_COLUMN_HEADERS.MAINTENANCE_DESCRIPTION,
      flex: NUMBERMAP.ONE_HALF,
      tooltip: true,
      renderCell: (params) => (
        stripHtml(params?.value ?? '' as string)
      ),
    },
    {
      field: MAINTENANCE_COLUMN_FIELDS.TO_BE_DONE_BY,
      headerName: MAINTENANCE_COLUMN_HEADERS.TO_BE_DONE_BY,
      flex: NUMBERMAP.ONE,
      headerClassName: TABLE_HEADER_CLASS_NAME,
    },
    {
      field: MAINTENANCE_COLUMN_FIELDS.FREQUENCY,
      headerName: MAINTENANCE_COLUMN_HEADERS.FREQUENCY,
      flex: NUMBERMAP.ONE,
      headerClassName: TABLE_HEADER_CLASS_NAME,
    },
    {
      field: MAINTENANCE_COLUMN_FIELDS.NEXT_SCHEDULE_DATE,
      headerName: MAINTENANCE_COLUMN_HEADERS.NEXT_SCHEDULE_DATE,
      flex: NUMBERMAP.ONE,
    },
    {
      field: MAINTENANCE_COLUMN_FIELDS.ACTIONS,
      headerName: MAINTENANCE_COLUMN_HEADERS.ACTIONS,
      flex: NUMBERMAP.HALF,
      headerClassName: TABLE_HEADER_CLASS_NAME,
      renderCell: (params) => {
        const actionData = params.row.actionData
        return (
          <Box sx={BOX_STYLES}>
            <Box sx={ACTION_ICONS_WRAPPER_SX}>
              <IconButton
                onClick={() => {
                  if (!hasEditPermission) return
                  setEditingRowId(params.row.id)
                  if (actionData) {
                    setSelectedActionData({
                      actionCarriedOut: actionData.actionCarriedOut ?? '',
                      maintenanceDate: actionData.maintenanceDate ?? null,
                      byWhom: actionData.byWhom ?? '',
                    });
                  } else {
                    setSelectedActionData({
                      actionCarriedOut: '',
                      maintenanceDate: null,
                      byWhom: '',
                    });
                  }
                  setActionsModalOpen(true);
                }}
                aria-label={ARIA_LABELS.EDIT}
                disabled={!hasEditPermission}
              >
                <Edit size={NUMBERMAP.EIGHTEEN} color={theme.palette.primary.main} />
              </IconButton>
            </Box>
          </Box>
        )
      },
    },
  ]

  // Update form data when infrastructure details are fetched (only in create mode)
  useEffect(() => {
    if (
      !isEditMode &&
      infrastructureDetailsData?.data &&
      infrastructureDetailsData.data.length > NUMBERMAP.ZERO &&
      selectedSerialNoId
    ) {
      const infrastructure = infrastructureDetailsData.data[NUMBERMAP.ZERO]
      // Verify the infrastructure_id matches the selected serial number
      if (infrastructure.infrastructure_id === selectedSerialNoId) {
        setFormData((prev) => ({
          ...prev,
          infrastructureName: infrastructure.name_of_infrastructure ?? '',
          functionDepartment: infrastructure.department_function_name ?? '',
          status: null
        }))
      }
    }
  }, [infrastructureDetailsData])

  // Helper function to map equipment data
  const mapEquipmentData = useCallback((equipment: any[]) => {
    if (!equipment || equipment.length === NUMBERMAP.ZERO) {
      return []
    }
    return equipment.map((equip, index) => ({
      id: equip.report_equipment_id ?? crypto.randomUUID(),
      equipmentCategory: equip.equipment_category ?? '',
      equipmentType: equip.equipment_type ?? '',
      equipmentSerialNo: equip.equipment_item_id ? String(equip.equipment_item_id) : '',
      calibrationDetails: equip.calibration_details && equip.calibration_details.length > NUMBERMAP.ZERO ? LABELS.VIEW_DETAILS : LABELS.NO_DETAILS,
      calibrationData: equip.calibration_details && equip.calibration_details.length > NUMBERMAP.ZERO ? equip.calibration_details[NUMBERMAP.ZERO] : null,
      reportEquipmentId: equip.report_equipment_id,
    }))
  }, [])

  // Helper function to map maintenance details data
  const mapMaintenanceDetailsData = useCallback((maintenanceDetails: any[]) => {
    if (!maintenanceDetails || maintenanceDetails.length === NUMBERMAP.ZERO) {
      return []
    }
    return maintenanceDetails.map((detail, index) => ({
      id: detail.maintenance_report_detail_id ?? crypto.randomUUID(),
      maintenanceDescription: detail.description ?? '',
      toBeDoneBy: detail.to_be_done ?? '',
      frequency: detail.frequency ?? '',
      nextScheduleDate: detail.next_schedule_date ? new Date(detail.next_schedule_date).toLocaleDateString() : "",
      maintenancePlanDetailId: detail.maintenance_plan_detail_id,
      maintenanceReportDetailId: detail.maintenance_report_detail_id ?? '',
      actionData: {
        actionCarriedOut: detail.action_carried_out ?? '',
        maintenanceDate: detail.maintenance_date ? dayjs(detail.maintenance_date) : null,
        byWhom: detail.service_type_id ? String(detail.service_type_id) : '',
      },
    }))
  }, [])

  // Populate equipment and maintenance details when maintenance report data is fetched by infrastructure_id (only in create mode)
  useEffect(() => {
    if (
      !isEditMode &&
      maintenanceReportByInfrastructureData?.data &&
      maintenanceReportByInfrastructureData.data.length > NUMBERMAP.ZERO &&
      selectedSerialNoId
    ) {
      const report = maintenanceReportByInfrastructureData.data[NUMBERMAP.ZERO]
      // Verify the infrastructure_id matches the selected serial number
      setMaintenanceReportIdForUpadte(report?.maintenance_report_id ?? null)
      if (report.infrastructure_id === selectedSerialNoId) {
        setEquipmentData(mapEquipmentData(report.equipment))
        setMaintenanceDetailsData(mapMaintenanceDetailsData(report.maintenance_details))
      }
      if (report?.maintenance_report_id) {
        setFormData({
          infrastructureCategory: String(report.infrastructure_category_id ?? ''),
          infrastructureType: String(report.infrastructure_type_id ?? ''),
          serialNo: String(report.infrastructure_id ?? ''),
          infrastructureName: report.infrastructure_name ?? '',
          functionDepartment: report.function_department ?? '',
          status: report.status_id ?? null,
        })
        setUploadedFiles(report?.document ?? [])
      }
    } else if (!isEditMode && !selectedSerialNoId) {
      // Clear equipment and maintenance details when serial number is cleared
      setEquipmentData([])
      setMaintenanceReportIdForUpadte(null)
      setMaintenanceDetailsData([])
    }
  }, [maintenanceReportByInfrastructureData])

  // Load draft data when in create mode
  useEffect(() => {
    if (draftData?.data && !isEditMode) {
      loadDraftData(draftData)
    }
  }, [draftData, isEditMode])

  const loadDraftData = (draftData) => {
    const draft = draftData.data
    if (draft.infrastructureCategory) {
      setFormData({
        infrastructureCategory: draft.infrastructureCategory ?? '',
        infrastructureType: draft.infrastructureType ?? '',
        serialNo: draft.serialNo ?? '',
        infrastructureName: draft.infrastructureName ?? '',
        functionDepartment: draft.functionDepartment ?? '',
        status: draft.status ?? '',
      })
    }
    if (draft.equipmentData && Array.isArray(draft.equipmentData)) {
      setEquipmentData(draft.equipmentData)
    }
    if (draft.maintenanceDetailsData && Array.isArray(draft.maintenanceDetailsData)) {
      setMaintenanceDetailsData(draft.maintenanceDetailsData)
    }
    setMaintenanceReportIdForUpadte(draft?.maintenance_report_id ?? null)

    setDraftDocuments(draft.draftDocuments ?? {})
    setDraftDelete(draft.draftDelete ?? [])
    setUploadedFiles([
      ...(draft?.documents ?? []),
      ...(draft?.draftDocuments?.documents ?? [])
    ])
  }
  // Populate form data when maintenance report is fetched
  useEffect(() => {
    if (
      maintenanceReportData?.data &&
      maintenanceReportData.data.length > NUMBERMAP.ZERO &&
      isEditMode
    ) {
      const report = maintenanceReportData.data[NUMBERMAP.ZERO]

      // Populate form fields
      setFormData({
        infrastructureCategory: String(report.infrastructure_category_id ?? ''),
        infrastructureType: String(report.infrastructure_type_id ?? ''),
        serialNo: String(report.infrastructure_id ?? ''),
        infrastructureName: report.infrastructure_name ?? '',
        functionDepartment: report.function_department ?? '',
        status: report.status_id ?? '',
      })
      setMaintenanceReportIdForUpadte(report?.maintenance_report_id ?? null)

      // Populate equipment data
      if (report.equipment && report.equipment.length > NUMBERMAP.ZERO) {
        const mappedEquipment = report.equipment.map((equip, index) => ({
          id: equip.report_equipment_id ?? index + NUMBERMAP.ONE,
          equipmentCategory: equip.equipment_category ?? '',
          equipmentType: equip.equipment_type ?? '',
          equipmentSerialNo: String(equip.equipment_item_id ?? ''),
          calibrationDetails: equip.calibration_details && equip.calibration_details.length > NUMBERMAP.ZERO ? LABELS.VIEW_DETAILS : LABELS.NO_DETAILS,
          calibrationData: equip.calibration_details && equip.calibration_details.length > NUMBERMAP.ZERO ? equip.calibration_details[NUMBERMAP.ZERO] : null,
          reportEquipmentId: equip.report_equipment_id,
        }))
        setEquipmentData(mappedEquipment)
      }

      // Populate maintenance details data
      if (report.maintenance_details && report.maintenance_details.length > NUMBERMAP.ZERO) {
        const mappedMaintenance = report.maintenance_details.map((detail, index) => ({
          id: detail.maintenance_report_detail_id ?? index + NUMBERMAP.ONE,
          maintenanceDescription: detail.description ?? '',
          toBeDoneBy: detail.to_be_done ?? '',
          frequency: detail.frequency ?? '',
          nextScheduleDate: detail.next_schedule_date ? new Date(detail.next_schedule_date).toLocaleDateString() : "",
          maintenancePlanDetailId: detail.maintenance_plan_detail_id,
          maintenanceReportDetailId: detail.maintenance_report_detail_id,
          actionData: {
            actionCarriedOut: detail.action_carried_out ?? '',
            maintenanceDate: detail.maintenance_date ? dayjs(detail.maintenance_date) : null,
            byWhom: String(detail.service_type_id ?? ''),
          },
        }))
        setMaintenanceDetailsData(mappedMaintenance)
      }

      // Populate files
      if (report.document && report.document.length > NUMBERMAP.ZERO) {
        setUploadedFiles(report.document)
      }
    } else if (maintenanceReportData?.data && !Array.isArray(maintenanceReportData?.data)) {
      loadDraftData(maintenanceReportData)
    }
  }, [maintenanceReportData])

  // Fetch draft on mount in create mode
  useEffect(() => {
    if (!isEditMode) {
      fetchDraft()
    }
  }, [isEditMode, formData.serialNo])


  // Update calibration data when API response is received
  useEffect(() => {
    if (calibrationData?.data && calibrationData.data.length > NUMBERMAP.ZERO) {
      const calibration = calibrationData.data[NUMBERMAP.ZERO]
      setSelectedCalibrationData({
        status: calibration.calibration_status ?? "",
        date: calibration.calibration_date ?? "",
        due: calibration.calibration_due_date ?? "",
        documentId: calibration.document_id ?? '',
      })
    } else if (calibrationData?.data && calibrationData.data.length === NUMBERMAP.ZERO) {
      // No calibration data found
      setSelectedCalibrationData({
        status: "",
        date: "",
        due: "",
        documentId: '',
      })
    }
  }, [calibrationData])

  const handleDraftSave = (formDataToSave: MaintenanceReportFormData, fileData?: FinalFileData, maintenanceDetails?: MaintenanceDetailsDataItem[], equipmentDetails?: EquipmentDataItem[]) => {
    if (formData.serialNo) {
      const finalFileDataValue = fileData ?? finalFileData
      let draftDatas = isEditMode ? maintenanceReportData : draftData
      const draftConfig = {
        fileFieldToSectionMap: { 'documents': 'documents' },
        sectionTypeToNameMap: { 'documents': 'documents' },
        responseDataKeyMap: { 'documents': 'documents' },
      }

      const draftPreparationMaintenanceReport = prepareDraftDocumentsGeneric(
        draftDocuments,
        draftDelete,
        { ...formDataToSave, documents: uploadedFiles },
        { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
        draftDatas,
        draftConfig
      )

      if (draftPreparationMaintenanceReport.draftDocuments) {
        setDraftDocuments(draftPreparationMaintenanceReport.draftDocuments)
      }
      if (draftPreparationMaintenanceReport.draftDelete) {
        setDraftDelete(draftPreparationMaintenanceReport.draftDelete ?? {})
      }

      const fieldsToRemoveMaintenanceReport = ['documents']
      const ObjMaintenanceReport = { ...formDataToSave }
      const cleanedMaintenanceReport = Object.fromEntries(
        Object.entries(ObjMaintenanceReport).filter(([key]) => !fieldsToRemoveMaintenanceReport.includes(key))
      )

      const payload = {
        id: maintenanceReportIdForDraft ?? new Date().getTime(),
        ...cleanedMaintenanceReport,
        equipmentData: equipmentDetails ?? equipmentData,
        maintenance_report_id: maintenanceReportIdForUpadte,
        maintenanceDetailsData: maintenanceDetails ?? maintenanceDetailsData,
        draftDocuments: draftPreparationMaintenanceReport.draftDocuments,
        draftDelete: draftPreparationMaintenanceReport.draftDelete,
        type: 'draft',
      }
      draftSave({
        form_data: payload,
        upload_documents: {
          documents_to_create: finalFileDataValue?.documents_to_create ?? [],
          create_meta_data: draftPreparationMaintenanceReport.createMetaData,
          update_meta_data: draftPreparationMaintenanceReport.updateMetaData,
          documents_to_delete: [],
          documents_to_preserve: draftPreparationMaintenanceReport?.documentsToPreserve ?? [],
        },
        timestamp: new Date().toISOString(),
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (!isCreateMode && !hasEditPermission) return
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      }
      // Clear serial number and related fields when infrastructure type changes
      if (field === 'infrastructureType') {
        updated.serialNo = ''
        updated.infrastructureName = ''
        updated.functionDepartment = ''
        // Clear equipment and maintenance details when infrastructure type changes
        if (!isEditMode) {
          setEquipmentData([])
          setMaintenanceDetailsData([])
        }
      }
      // Clear infrastructure name and function/department when serial number changes
      if (field === 'serialNo') {
        setMaintenanceReportIdForUpadte(null)
        updated.infrastructureName = ''
        updated.functionDepartment = ''
        // Clear equipment and maintenance details when serial number changes (only in create mode)
        if (!isEditMode) {
          setEquipmentData([])
          setMaintenanceDetailsData([])
        }
      }
      // Trigger draft save with updated form data
      if (!['infrastructureType', 'infrastructureCategory', 'serialNo'].includes(field)) {
        handleDraftSave(updated)
      }
      return updated
    })

    // Clear error for the changed field
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleFileUpload = (newFile: FileDataV3) => {
    if (!hasEditPermission) return
    setUploadedFiles((prev) => [...prev, newFile])
  }

  const handleFileEdit = (updatedFile: FileDataV3) => {
    if (!hasEditPermission) return
    setUploadedFiles((prev) => {
      const updatedFiles = prev.map((file: any) => {
        const currentId = file.id ?? file.file_id
        const updatedId = updatedFile.id ?? updatedFile.file_id

        return currentId === updatedId ? { ...file, ...updatedFile } : file
      })
      return updatedFiles
    })
  }

  const handleFileRemove = useCallback((data: any) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setUploadedFiles((prev) => {
        return prev.filter((file) => {
          const fileName = file.file?.name?.split('.')[NUMBERMAP.ZERO]
          return !data.local_files_to_delete.includes(fileName)
        })
      })
    }
    if (finalFileData.documents_to_delete?.length > EMPTY_ARRAY_LENGTH) {
      setUploadedFiles((prev) => {
        return prev.filter((file: any) => {
          const fileId = file.file_id ?? file.id
          return !finalFileData.documents_to_delete.includes(String(fileId))
        })
      })
    }
  }, [])

  // Validate required fields
  const validateForm = () => {
    const newErrors = { ...INITIAL_ERRORS }
    let isValid = true

    // Validate Infrastructure Category
    if (!formData?.infrastructureCategory?.trim()) {
      newErrors.infrastructureCategory = VALIDATION_MESSAGES.INFRASTRUCTURE_CATEGORY_REQUIRED
      isValid = false
    }

    // Validate Infrastructure Type
    if (!formData?.infrastructureType?.trim()) {
      newErrors.infrastructureType = VALIDATION_MESSAGES.INFRASTRUCTURE_TYPE_REQUIRED
      isValid = false
    }

    // Validate Serial No.
    if (!formData?.serialNo?.trim()) {
      newErrors.serialNo = VALIDATION_MESSAGES.SERIAL_NO_REQUIRED
      isValid = false
    }

    // Validate Status
    if (!formData?.status) {
      newErrors.status = VALIDATION_MESSAGES.STATUS_REQUIRED
      isValid = false
    }
    if (!isDocumentUploadValid(finalFileData, uploadedFiles)) {
      errors.fileUpload = VALIDATION_MESSAGES.FILE_UPLOAD_REQUIRED
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }
  const createFileMetadata = () => {
    return createFileMetadataUtil({
      isEditMode: isEditMode,
      draftData: draftData,
      existingData: maintenanceReportData,
      finalFileData: finalFileData,
    })
  }
  const handleSave = () => {
    // Validate required fields
    if (!validateForm()) {
      return
    }

    clearDraftSave()

    // Prepare FormData
    const formDataForAPI = new FormData()

    // Add maintenance_report_id if in edit mode
    if (maintenanceReportIdForUpadte) {
      formDataForAPI.append('maintenance_report_id', maintenanceReportIdForUpadte?.toString())
    }

    // Add infrastructure_id
    formDataForAPI.append('infrastructure_id', formData.serialNo)

    // Add status
    formDataForAPI.append('status', formData.status)

    // Prepare equipment_required array
    const equipmentRequired = equipmentData
      .filter((equip) => equip.equipmentSerialNo)
      .map((equip) => {
        const equipmentPayload: any = {
          equipment_item_id: Number(equip.equipmentSerialNo),
        }
        // Include report_equipment_id if it exists (for updates)
        if (equip.reportEquipmentId && typeof equip.reportEquipmentId === 'number' && equip.reportEquipmentId > NUMBERMAP.ZERO) {
          equipmentPayload.report_equipment_id = equip.reportEquipmentId
        }
        return equipmentPayload
      })

    formDataForAPI.append('equipment_required', JSON.stringify(equipmentRequired))

    // Prepare maintenance_detail array
    const maintenanceDetail = maintenanceDetailsData.map((detail) => {
      const maintenancePayload: any = {
        maintenance_plan_detail_id: detail.maintenancePlanDetailId ?? NUMBERMAP.ZERO,
        action_carried_out: detail.actionData?.actionCarriedOut ?? '',
        maintenance_date: detail.actionData?.maintenanceDate
          ? dayjs(detail.actionData.maintenanceDate).format('YYYY-MM-DD')
          : '',
        service_type_id: detail.actionData?.byWhom ? Number(detail.actionData.byWhom) : NUMBERMAP.ZERO,
      }
      // Include maintenance_report_detail_id if it exists (for updates)
      // Empty string or 0 means new item, so we only include if it's a valid ID
      const reportDetailId = detail.maintenanceReportDetailId
      if (reportDetailId && reportDetailId !== NUMBERMAP.ZERO && reportDetailId !== '' && reportDetailId !== '0') {
        maintenancePayload.maintenance_report_detail_id = reportDetailId
      } else {
        // For new items, set empty string as shown in API response example
        maintenancePayload.maintenance_report_detail_id = ''
      }
      return maintenancePayload
    })

    formDataForAPI.append('maintenance_detail', JSON.stringify(maintenanceDetail))

    const finalFileDatas = createFileMetadata()
    // Add file upload data
    if (finalFileData.documents_to_create?.length > NUMBERMAP.ZERO) {
      finalFileData.documents_to_create.forEach((file: File) => {
        if (file instanceof File) {
          formDataForAPI.append('documents_to_create', file, file.name)
        }
      })
    }

    // Add documents_to_delete as JSON string
    if (finalFileDatas.documents_to_delete && finalFileDatas.documents_to_delete.length > NUMBERMAP.ZERO) {
      formDataForAPI.append('documents_to_delete', JSON.stringify(finalFileDatas.documents_to_delete))
    }

    // Add create_meta_data as JSON string
    if (finalFileDatas.create_meta_data && Object.keys(finalFileDatas.create_meta_data).length > NUMBERMAP.ZERO) {
      formDataForAPI.append('create_meta_data', JSON.stringify(finalFileDatas.create_meta_data))
    }

    // Add update_meta_data as JSON string
    if (finalFileDatas.update_meta_data && Object.keys(finalFileDatas.update_meta_data).length > NUMBERMAP.ZERO) {
      formDataForAPI.append('update_meta_data', JSON.stringify(finalFileDatas.update_meta_data))
    }

    // Call save API
    saveMaintenanceReport(formDataForAPI, {
      onSuccess: () => {
        // Reset form data after successful save
        setFinalFileData(FINALFILEINITIALDATA)
        // Refetch maintenance report data if in edit mode
        if (maintenanceReportId) {
          refetchMaintenanceReport()
        }
        // Redirect to maintenance report list page after successful save
        router.push(MAINTENANCE_REPORT_LIST_PATH)
      },
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(MAINTENANCE_REPORT_LIST_PATH)
  }

  const handleDownloadCertificate = async () => {
    if (selectedCalibrationData.documentId) {
      const response = await downloadDocument()
      if (response?.data) {
        await handleDownloadSuccess(
          response.data.data[NUMBERMAP.ZERO].assetUrl,
          ''
        )
      } else {
        showActionAlert('failed')
      }
    } else {
      showActionAlert('customAlert', {
        icon: "error",
        "text": "File/Document Not available for download",
        title: 'No File/Document Found',
        cancelButton: false,
        confirmButton: false
      })
    }

  }

  const menuData = isCreateMode ? maintenanceReportByInfrastructureData : maintenanceReportData
  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <Label title={PAGE_TITLES.MAINTENANCE_REPORT}></Label>
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            {/* Form Fields */}
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_CATEGORY}
                placeholder={FORM_PLACEHOLDERS.SELECT_INFRASTRUCTURE_CATEGORY}
                isDropdown={true}
                value={formData.infrastructureCategory}
                onChange={(value: string) => handleInputChange('infrastructureCategory', value)}
                options={infrastructureCategoryData?.data ?? []}
                keyField={KEY_FIELDS.INFRASTRUCTURE_CATEGORY_ID}
                valueField={VALUE_FIELDS.INFRASTRUCTURE_CATEGORY_NAME}
                error={errors.infrastructureCategory}
                hasEditable={!hasEditPermission && !isCreateMode}
                disabled = {!isCreateMode}
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_TYPE}
                placeholder={FORM_PLACEHOLDERS.SELECT_INFRASTRUCTURE_TYPE}
                isDropdown={true}
                value={formData.infrastructureType}
                onChange={(value: string) => handleInputChange('infrastructureType', value)}
                options={infrastructureTypeData?.data ?? []}
                keyField={KEY_FIELDS.INFRASTRUCTURE_TYPE_ID}
                valueField={VALUE_FIELDS.INFRASTRUCTURE_TYPE_NAME}
                error={errors.infrastructureType}
                hasEditable={!hasEditPermission && !isCreateMode}
                disabled = {!isCreateMode}
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.SERIAL_NO}
                placeholder={FORM_PLACEHOLDERS.SELECT_SERIAL_NO}
                isDropdown={true}
                value={formData.serialNo}
                onChange={(value: string) => handleInputChange('serialNo', value)}
                options={serialNumbersData?.data ?? []}
                keyField={KEY_FIELDS.INFRASTRUCTURE_ID}
                valueField={VALUE_FIELDS.SERIAL_NUMBER}
                hasEditable={!hasEditPermission && !isCreateMode}
                disabled={!formData.infrastructureType || !isCreateMode}
                error={errors.serialNo}
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <LabelContainer>
                <LabelText>{FORM_LABELS.INFRASTRUCTURE_NAME}</LabelText>
                <LabelValue>{formData.infrastructureName}</LabelValue>
              </LabelContainer>
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <LabelContainer>
                <LabelText>{FORM_LABELS.FUNCTION_DEPARTMENT}</LabelText>
                <LabelValue>{formData.functionDepartment}</LabelValue>
              </LabelContainer>
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                isDropdown={true}
                value={formData.status}
                onChange={(value: string) => handleInputChange('status', value)}
                options={statusData?.data ?? []}
                keyField={KEY_FIELDS.STATUS_ID}
                valueField={VALUE_FIELDS.STATUS_NAME}
                error={errors.status}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
          </Grid2>
        </FormContent>

        {/* Equipment Required Section */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <Label title={PAGE_TITLES.EQUIPMENT_REQUIRED}></Label>
          <DataTable
            rows={equipmentData}
            columns={equipmentColumns}
            IdField={DATA_TABLE_ID_FIELD}
            checkbox={false}
            loading={false}
            pagination={true}
          />
        </Grid2>

        {/* Maintenance Details Section */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <Label title={PAGE_TITLES.MAINTENANCE_DETAILS}></Label>
          <DataTable
            rows={maintenanceDetailsData}
            columns={maintenanceColumns}
            IdField={DATA_TABLE_ID_FIELD}
            checkbox={false}
            loading={false}
            pagination={true}
          />
        </Grid2>

        {/* File Upload Section */}
        <FormContent>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <FileUploadManager
              initialFiles={uploadedFiles}
              onFileUpload={handleFileUpload}
              onFileEdit={handleFileEdit}
              uploadMandError={errors?.fileUpload ?? ''}
              onSubmit={(data) => {
                setFinalFileData((prev) => {
                  const mergedData = mergeFinalFileData(prev, data)
                  handleDraftSave(formData, mergedData)
                  return mergedData
                })
                handleFileRemove(data)
                setErrors((prev) => ({ ...prev, fileUpload: '' }))
              }}
              subHeader={FILE_UPLOAD_SUBHEADER}
              hasEditable={!hasEditPermission}
            />
          </Grid2>
        </FormContent>

        {/* Comments History */}
        {!!maintenanceReportId && (
          <Grid2 size={NUMBERMAP.TWELVE} p={NUMBERMAP.TWO}>
            <CommentsHistory
              comments={((maintenanceReportData)?.meta_info?.task_info?.task_comments ?? []) as any}
            />
          </Grid2>
        )}

        {/* Action Buttons */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <ButtonContainer>
            <SalesReviewerModalManager
              module='infrastructure'
              isLoading={isLoading}
              permissions={(((menuData)?.meta_info?.action_control?.permissions ?? (isCreateMode ? [{ action: FORM_BUTTON_LABELS.SAVE }, { action: FORM_BUTTON_LABELS.CANCEL }, { action: PERMISSION_ACTIONS.VIEW }] : [])) as any)}
              taskInfo={(((menuData)?.meta_info?.task_info ?? { task_comments: [], reviewer_list: [], task_id: undefined }) as any)}
              menuId={((menuData)?.meta_info?.action_control?.menuId)}
              menuName={((menuData)?.meta_info?.action_control?.formName)}
              contextType={INFRASTRUCTURE_CONTEXT_TYPE.MAINTENANCE_REPORT}
              contextId={maintenanceReportId ?? NUMBERMAP.ZERO}
              customHandlers={{
                handleCancel: handleCancel,
                handleSave: handleSave,
              }}
              onPermissionChange={setHasEditPermission}
              refetch={refetchMaintenanceReport}
              hideSaveButton={false}
            />
          </ButtonContainer>
        </Grid2>

      </FormWrapper>

      {/* Calibration Details Modal */}
      <CommonModal
        open={calibrationModalOpen}
        onClose={() => {
          setCalibrationModalOpen(false)
          setSelectedEquipmentItemId(undefined)
          setSelectedCalibrationData(null)
        }}
        title={MODAL_TITLES.CALIBRATION_DETAILS}
      >
        <Box >
          <CalibrationDetails
            data={[selectedCalibrationData ?? {
              status: "",
              date: "",
              due: "",
              certificateUrl: '',
            }]}
            config={[
              {
                field: 'status',
                label: 'Status',
                type: 'text'
              },
              {
                field: 'date',
                label: 'Date',
                type: 'text'
              },
              {
                field: 'due',
                label: 'Due',
                type: 'text'
              },
              {
                field: 'documentId',
                label: 'Calibration Certificate',
                type: 'custom',
                render: (value: string) => {
                  if (value && value !== '') {
                    return (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadCertificate()
                        }}
                        size={STYLES.SIZE}
                        color={STYLES.colour}
                        sx={DownloadIconSx}
                      >
                        <Download style={STYLES.FONTSIZE_24} />
                      </IconButton>
                    )
                  }
                  return 'N/A'
                }
              }
            ]}
          />
        </Box>
      </CommonModal>

      {/* Actions Carried Out Modal */}
      <CommonModal
        open={actionsModalOpen}
        onClose={() => setActionsModalOpen(false)}
        title={MODAL_TITLES.ACTIONS_CARRIED_OUT}
      >
        <Box sx={POPUP_STYLE}>
          <ActionsCarriedOutModal
            onSave={(data) => {
              if (!isCreateMode && !hasEditPermission) return
              // Update the row that was being edited
              if (editingRowId !== null) {
                const updatedData = maintenanceDetailsData.map((row) =>
                  row.id === editingRowId
                    ? { ...row, actionData: data }
                    : row
                )
                setMaintenanceDetailsData(updatedData)
                // Trigger draft save with updated maintenance details data
                handleDraftSave(formData, finalFileData, updatedData)
              }
              setActionsModalOpen(false)
              setEditingRowId(null)
            }}
            onCancel={() => {
              setActionsModalOpen(false)
              setEditingRowId(null)
            }}
            initialData={selectedActionData}
            byWhomOptions={[]}
          />
        </Box>
      </CommonModal>
    </FormContainer>
  )
}

export default MaintenanceReportPage
