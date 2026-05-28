'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Grid2, Box } from '@mui/material'
import { useRouter, useParams, notFound } from 'next/navigation'
import {
    InputField,
    ButtonGroup,
    Label,
    Description,
    ActionButton,
    showActionAlert,
    DataGridTable,
} from '@/components/ui'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { NUMBERMAP, FINALFILEINITIALDATA } from '@/constants/common'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { processDraftPreparation, removeFieldsFromFormData, appendFileMetadataToFormData, createFileMetadataGenerator } from '@/lib/utils/modules/sales/draftSaveCommon'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import {
    FormContainer,
    FormContent,
    FormWrapper,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import {
    useGetPurchaseOrder,
    usePostPurchaseOrder,
    useOrderTypes,
    usePartNumbers,
} from '@/hooks/modules/purchase/usePurchaseOrder'
import { useAllVendorTypes, useAllVendors } from '@/hooks/modules/vendor-management/useCommonDropdown'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import {
    VALIDATION_MESSAGES,
    FORM_DATA_FIELDS,
    PART_DETAILS_FIELDS,
    PART_DETAILS_HEADERS,
    FORM_LABELS,
    FORM_PLACEHOLDERS,
    FORM_FIELD_NAMES,
    FORM_FIELD_KEYS,
    PAGE_TITLES,
    COMMON_STRINGS,
    ROUTES,
    ORDER_TYPES,
} from '@/constants/modules/purchase/purchaseOrder'
import {
    SUCCESS_ALERT,
    FAILED_ALERT,
    DELETE_ALERT,
} from '@/constants/modules/dnd/formTeam'
import { mergeFinalFileData, FinalFileData, numberValidation, convertMuiDayjsToUTC, isDocumentUploadValid, formatDate } from '@/lib/utils/common'
import { FileDocument, FileData } from '@/types/components/ui/fileUploadV3'
import { FileData as PurchaseOrderFileData } from '@/types/modules/vendor-management/sampleOrders'
import PurchaseOrderPartDetailsModal, { PartDetailsModalFormData } from '@/components/modules/purchase/purchase-order/PurchaseOrderPartDetailsModal'
import {
    PartDetailsContainer,
    TableWrapper,
    CalculationSection,
    CalculationRow,
    CalculationLabel,
    CalculationValue,
    CalculationInput,
    ReadOnlyValue,
    PART_DETAILS_GRID_STYLES,
} from '@/styles/modules/purchase/purchaseOrderPartDetails'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { useVendorById } from '@/hooks/modules/vendor-management/useVendorList'
import { ErrorText } from '@/styles/common'
import { useSelector } from 'react-redux'
import { selectProfileData } from '@/store/slices/menuSlice'
import { useAllInfrastructureRequest, useInfrastructureRequestById, useInfrastructureTypes } from '@/hooks/modules/infrastructure-management/useInfrastructureRequest'

/**
 * Classification : Confidential
 * 
 * Expected Date of Delivery Calculation Feature:
 * 
 * For purchase orders with order type "part", the Expected Date of Delivery 
 * is automatically calculated based on:
 * - Tentative Date of Delivery (from form)
 * - lead_time_days (from selected part data)
 * 
 * Formula: Expected Date = Tentative Date + lead_time_days
 * 
 * This calculation:
 * - Only applies when order type is "part" (not for infrastructure orders)
 * - Automatically updates when tentative date changes
 * - Recalculates when loading existing orders or draft data
 * - Displays dates in the same format as Tentative Date field
 **/

interface PartDetail {
    id: string
    sno: number
    part_number_id?: string
    part_id?: number
    part_number?: string
    infrastructure_type_id?: number
    infrastructure_type?: string
    infrastructure_type_name?: string
    model_number?: string
    quantity: string
    unit_rate: string
    price: string
    status: number
    purchase_order_part_details_id?: number
    infrastructure_detail_id?: number
    expected_date_of_delivery?: dayjs.Dayjs | null
}


interface FileManagerSubmitData {
    documents_to_create: File[]
    documents_to_delete: string[]
    create_meta_data: Record<string, any>
    update_meta_data: Record<string, any>
}

const PurchaseOrderForm: React.FC<{}> = () => {
    const router = useRouter()
    const params = useParams()
    const purchaseOrderId = params?.slug?.[NUMBERMAP.ZERO]
    const purchaseRequisitionId = params?.slug?.[NUMBERMAP.ONE]
    const isEditMode = purchaseOrderId !== 'create'
    const profileData = useSelector(selectProfileData)
    const initialDraftLoading = useRef(true)
    const [formData, setFormData] = useState({
        orderTypeId: '',
        orderType: '',
        vendorType: '',
        vendorId: '',
        vendorName: '',
        infrastructureRequestId: '',
        purchaseOrderDate: null as dayjs.Dayjs | null,
        purchaseOrderNumber: '',
        qtnRef: '',
        tentativeDate: null as dayjs.Dayjs | null,
        invoiceLocation: '',
        invoiceAddress: '',
        shipToContactPerson: '',
        shipToAddress: '',
        shipToLocation: '',
        remarks: '',
        totalExWork: '',
        packagingAndTransport: '',
        subTotal: '',
        gst: '',
        total: '',
        status: '',
        documents: [] as any[],
    })

    const [partDetailsData, setPartDetailsData] = useState<PartDetail[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPartId, setEditingPartId] = useState<string | null>(null)
    const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA)
    const [fileManagerKey, setFileManagerKey] = useState(NUMBERMAP.ZERO)
    const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
    const [draftDelete, setDraftDelete] = useState<string[]>([])

    // Validation errors state
    const [validationErrors, setValidationErrors] = useState({
        orderTypeId: '',
        vendorType: '',
        vendorName: '',
        infrastructureRequestId: '',
        purchaseOrderDate: '',
        purchaseOrderNumber: '',
        qtnRef: '',
        tentativeDate: '',
        invoiceLocation: '',
        invoiceAddress: '',
        shipToContactPerson: '',
        shipToAddress: '',
        shipToLocation: '',
        status: '',
        partDetails: '',
        fileUpload: '',
    })

    const { data: orderTypesData } = useOrderTypes()
    const { data: vendorTypesData } = useAllVendorTypes(NUMBERMAP.ONE)
    const { data: vendorListData } = useAllVendors(
        NUMBERMAP.ONE,
        formData.vendorType ?? null,
        !!formData.vendorType
    )
    const { data: partCategoryData } = useVendorById(formData.vendorName ?? '', !!formData.vendorName)
    const { data: partNumbersData } = usePartNumbers(formData.vendorId ? Number(formData.vendorId) : null)
    const { data: statusData } = useOrganizationStatus()
    const { mutate: postPurchaseOrder, isPending: isSaving } = usePostPurchaseOrder()

    const [partCategory, setPartCategory] = useState<any[]>([])
    const [infraCategory, setInfraCategory] = useState<any[]>([])

    // Infrastructure hooks
    const getInfrastructureRequestId = () => {
        return formData.infrastructureRequestId ? Number(formData.infrastructureRequestId) : NUMBERMAP.ZERO
    }

    const { data: infrastructureRequestListData } = useAllInfrastructureRequest()
    const { data: infrastructureRequestDetailData } = useInfrastructureRequestById(
        getInfrastructureRequestId(),
        false
    )
    const getCategoryId = () => {
        if (infrastructureRequestDetailData?.data?.length > NUMBERMAP.ZERO) {
            return infrastructureRequestDetailData?.data[NUMBERMAP.ZERO]?.category_id
        }
        return null
    }
    const { data: infrastructureTypesData } = useInfrastructureTypes(getCategoryId(), !!formData.infrastructureRequestId)
    // Draft save hook
    const purchaseOrderIdForDraft = isEditMode ? Number(purchaseOrderId) : null
    const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
        context_type: 'purchase_order',
        context_instance_id: purchaseOrderIdForDraft,
        enableFetch: false
    })


    // Fetch purchase order data for edit mode
    const { data: purchaseOrderData, isLoading: isLoadingPurchaseOrder } =
        useGetPurchaseOrder(purchaseOrderIdForDraft ?? NUMBERMAP.ZERO)

    const resetDraftAndDocumentState = () => {
        setDraftDocuments({})
        setDraftDelete([])
        setFinalFileData(FINALFILEINITIALDATA)
    }

    // Fetch draft on mount
    useEffect(() => {
        fetchDraft()
        initialDraftLoading.current = false
    }, [purchaseOrderId, fetchDraft])

    const getId = (part) => {
        if (part?.infrastructure_detail_id?.toString()) {
            return part.infrastructure_detail_id
        } else if (part.infrastructure_type_id?.toString()) {
            return part.infrastructure_type_id?.toString()
        } else if (part.purchase_order_part_details_id?.toString()) {
            return part.purchase_order_part_details_id?.toString()
        } else {
            return part.part_id?.toString() ?? ''
        }
    }
    const loadDraftData = (data: any) => {
        setFormData({
            ...data,
            documents: [...(data?.draftDocuments?.supporting_files ?? []), ...(data?.supporting_files ?? []), ...(data?.documents ?? [])]
        })
        if (data.part_category_details && Array.isArray(data.part_category_details)) {
            const formattedPartDetails = data.part_category_details.map((part: any) => {
                const partDetail = {
                    ...part,
                    id: getId(part),
                    ...(
                        data?.orderType && data?.orderType === ORDER_TYPES.INFRASTRUCTURE ? {
                            infrastructure_type_id: part.infrastructure_type_id,
                            infrastructure_type: part.infrastructure_type_name,
                            infrastructure_type_name: part.infrastructure_type_name,
                            model_number: part.model_no ?? part.model_number,
                            infrastructure_detail_id: part.infrastructure_detail_id
                        } : {}
                    )
                }
                /**
                 * Handle expected date for part order type when loading draft data
                 * 
                 * When loading saved draft data:
                 * - If order type is "part": Recalculate expected dates based on tentative date and lead_time_days
                 * - If order type is not "part": Set expected_date_of_delivery to null
                 */
                if (data?.orderType === ORDER_TYPES.PART) {
                    // Convert tentative date to dayjs if it's stored as string
                    let tentativeDate = null
                    if (data.tentativeDate) {
                        tentativeDate = dayjs.isDayjs(data.tentativeDate) ? data.tentativeDate : dayjs(data.tentativeDate)
                    }
                    // Recalculate expected date using current tentative date and part's lead_time_days
                    partDetail.expected_date_of_delivery = calculateExpectedDate(tentativeDate, part.part_id ?? part.part_number_id)
                } else {
                    // Set expected_date_of_delivery to null for non-part order types
                    partDetail.expected_date_of_delivery = null
                }
                return partDetail
            })
            setPartDetailsData(formattedPartDetails)
        }
        setDraftDocuments(data?.draftDocuments ?? {})
        setDraftDelete(Array.isArray(data?.draftDelete) ? data.draftDelete : [])
    }

    useEffect(() => {
        if (isEditMode && purchaseOrderData?.data && Array.isArray(purchaseOrderData.data) && purchaseOrderData.data.length > NUMBERMAP.ZERO && !draftData?.data) {
            const orderData = purchaseOrderData.data[NUMBERMAP.ZERO]

            setFormData({
                orderTypeId: orderData.order_type_id?.toString() ?? '',
                vendorType: orderData?.vendor_type_id?.toString() ?? '',
                orderType: orderData?.order_type_slug?.toString() ?? '',
                vendorName: orderData.vendor_id?.toString() ?? '',
                vendorId: orderData.vendor_id?.toString() ?? '',
                purchase_infrastructure_request_id: orderData?.purchase_infrastructure_request_id?.toString() ?? '',
                infrastructureRequestId: orderData.infrastructure_request_id?.toString() ?? '',
                purchaseOrderDate: orderData.purchase_order_date ? dayjs(orderData.purchase_order_date) : null,
                purchaseOrderNumber: orderData.purchase_order_number ?? '',
                qtnRef: orderData.qtn_ref ?? '',
                tentativeDate: orderData.tentative_date ? dayjs(orderData.tentative_date) : null,
                invoiceLocation: orderData.invoice_to_location ?? '',
                invoiceAddress: orderData.invoice_to_address ?? '',
                shipToContactPerson: orderData.ship_to_contact_person?.toString() ?? '',
                shipToAddress: orderData.ship_to_address ?? '',
                shipToLocation: orderData.ship_to_location ?? '',
                remarks: orderData.remarks ?? '',
                totalExWork: orderData.total_ex_work?.toString() ?? '',
                packagingAndTransport: orderData.packaging_and_transport?.toString() ?? '',
                subTotal: orderData.sub_total?.toString() ?? '',
                gst: orderData.gst?.toString() ?? '',
                total: orderData.total?.toString() ?? '',
                status: orderData.status_id?.toString() ?? orderData.status?.toString() ?? '',
                documents: orderData.documents ?? orderData.supporting_files ?? [],
            })
            setFileManagerKey(prev => prev + NUMBERMAP.ONE)

            if (orderData.order_type_slug?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE && orderData.infrastructure_details && orderData.infrastructure_details.length > NUMBERMAP.ZERO) {
                const formattedInfraDetails = orderData.infrastructure_details.map((infra: any) => ({
                    ...infra,
                    id: infra.infrastructure_detail_id?.toString() ?? infra.infrastructure_type_id?.toString() ?? infra.part_id?.toString() ?? '',
                    infrastructure_type_id: infra.infrastructure_type_id,
                    infrastructure_type: infra.infrastructure_type_name,
                    infrastructure_type_name: infra.infrastructure_type_name,
                    model_number: infra.model_no ?? infra.model_number,
                    infrastructure_detail_id: infra.infrastructure_detail_id,
                    expected_date_of_delivery: null,
                }))
                setPartDetailsData(formattedInfraDetails)
            } else if (orderData.part_category_details && orderData.part_category_details.length > NUMBERMAP.ZERO) {
                const formattedPartDetails = orderData.part_category_details.map((part: any) => {
                    const partDetail = {
                        ...part,
                        id: part.purchase_order_part_details_id?.toString() ?? part.part_id?.toString() ?? '',
                    }
                    /**
                     * Handle expected date for part order type when loading existing purchase order
                     * 
                     * When editing an existing purchase order:
                     * - If order type is "part": Recalculate expected dates based on tentative date and lead_time_days
                     * - If order type is not "part": Set expected_date_of_delivery to null
                     */
                    if (orderData.order_type_slug?.toLowerCase() === ORDER_TYPES.PART) {
                        // Convert API date string to dayjs object
                        const tentativeDate = orderData.tentative_date ? dayjs(orderData.tentative_date) : null
                        // Recalculate expected date using current tentative date and part's lead_time_days
                        partDetail.expected_date_of_delivery = calculateExpectedDate(tentativeDate, part.part_id)
                    } else {
                        // Set expected_date_of_delivery to null for non-part order types
                        partDetail.expected_date_of_delivery = null
                    }
                    return partDetail
                })
                setPartDetailsData(formattedPartDetails)
            } else {
                setPartDetailsData([])
            }

            if (orderData.infrastructure_request_id) {
                setFormData(prev => ({
                    ...prev,
                    infrastructureRequestId: orderData.infrastructure_request_id?.toString() ?? '',
                }))
            }

        }
    }, [isEditMode, purchaseOrderData])

    // Load draft data
    useEffect(() => {
        if (draftData?.data) {
            loadDraftData(draftData.data)
        }
    }, [draftData])

    // Filter vendors based on selected vendor type
    const filteredVendors = React.useMemo(() => {
        if (!vendorListData?.data || !formData.vendorType) {
            return []
        }
        return vendorListData.data
    }, [vendorListData?.data, formData.vendorType])


    const handleDraftSave = (formDataToSave: typeof formData, partsToSave?: PartDetail[], fileData?: FinalFileData) => {
        const finalFileDataValue = fileData ?? finalFileData
        const partsToUse = partsToSave ?? partDetailsData
        let draftDatas = draftData?.data ? draftData : purchaseOrderData

        const draftConfig = {
            fileFieldToSectionMap: { 'supporting_files': 'supporting_files' },
            sectionTypeToNameMap: { 'supporting_files': 'supporting_files' },
            responseDataKeyMap: { 'supporting_files': 'supporting_files' },
        }

        const draftPreparation = prepareDraftDocumentsGeneric(
            draftDocuments,
            draftDelete,
            { ...formDataToSave, supporting_files: formDataToSave.documents ?? [] },
            { supporting_files: finalFileDataValue ?? FINALFILEINITIALDATA },
            draftDatas,
            draftConfig
        )

        processDraftPreparation(draftPreparation, setDraftDocuments, setDraftDelete)

        const fieldsToRemove = ['documents']
        const cleaned = removeFieldsFromFormData(formDataToSave, fieldsToRemove)

        const payload = {
            id: purchaseOrderIdForDraft ?? new Date().getTime(),
            ...cleaned,
            part_category_details: partsToUse,
            draftDocuments: draftPreparation.draftDocuments,
            draftDelete: draftPreparation.draftDelete,
            type: 'draft',
        }

        draftSave({
            form_type: 'purchase_order',
            form_data: payload,
            upload_documents: {
                documents_to_create: finalFileDataValue?.documents_to_create ?? [],
                create_meta_data: draftPreparation.createMetaData,
                update_meta_data: draftPreparation.updateMetaData,
                documents_to_delete: [],
                documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
            },
        })
    }

    const handleInputChange = (field: string, value: string) => {
        // Only allow numbers for numeric fields
        if (
            field === FORM_FIELD_KEYS.QUANTITY ||
            field === FORM_FIELD_KEYS.UNIT_RATE ||
            field === FORM_FIELD_KEYS.PRICE ||
            field === FORM_FIELD_KEYS.TOTAL_EX_WORK ||
            field === FORM_FIELD_KEYS.PACKAGING_AND_TRANSPORT ||
            field === FORM_FIELD_KEYS.SUB_TOTAL ||
            field === FORM_FIELD_KEYS.GST ||
            field === FORM_FIELD_KEYS.TOTAL) {
            if (!numberValidation.test(value) && value !== '') return
        }
        let shouldClearPartDetails = false
        if (field == FORM_FIELD_KEYS.VENDOR_NAME) {
            setPartCategory([])
            // Clear part detail grid when vendor name changes/removed and order type is part
            if (formData.orderType?.toLowerCase() === ORDER_TYPES.PART) {
                setPartDetailsData([])
                shouldClearPartDetails = true
            }
        }
        if (field === 'infrastructureRequestId') {
            setInfraCategory([])
        }
        setFormData(prev => {
            const newData = { ...prev, [field]: value }
            // Reset vendor name when vendor type changes
            if (field === FORM_FIELD_KEYS.VENDOR_TYPE) {
                newData.vendorName = ''
                // Clear part detail grid when vendor type changes and order type is part
                if (prev.orderType?.toLowerCase() === ORDER_TYPES.PART) {
                    setPartDetailsData([])
                    shouldClearPartDetails = true
                }
            }
            if (!initialDraftLoading.current) {
                handleDraftSave(newData, shouldClearPartDetails ? [] : undefined)
            }
            return newData
        })

        // Clear validation error when user starts typing
        setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }

    /**
     * Helper function to calculate expected date of delivery
     * 
     * This function calculates the expected date by adding the lead_time_days 
     * (from the selected part) to the tentative date of delivery.
     * 
     * Business Rule: This calculation only applies when order type is "part".
     * For infrastructure orders, expected date is not calculated automatically.
     * 
     * Formula: Expected Date = Tentative Date + lead_time_days
     * If lead_time_days is 0 or null, returns the tentative date as-is.
     * 
     * @param tentativeDate - The tentative date of delivery from the form
     * @param partId - The ID of the selected part (used to find lead_time_days)
     * @returns Calculated expected date as dayjs object, tentative date if lead_time_days is 0 or null, or null if calculation cannot be performed
     */
    const calculateExpectedDate = (tentativeDate: dayjs.Dayjs | null, partId: number | string | undefined): dayjs.Dayjs | null => {
        // Only calculate for part order type - infrastructure orders don't use this calculation
        if (!tentativeDate || !dayjs(tentativeDate).isValid() || formData.orderType?.toLowerCase() !== ORDER_TYPES.PART) {
            return null
        }
        // Find the selected part from partNumbersData to get its lead_time_days
        const foundPart = partNumbersData?.data?.find((part: any) => {
            return part.id.toString() === partId?.toString()
        })
        // Get lead_time_days from the part data (defaults to 0 if not found)
        const leadTimeDays = foundPart?.lead_time_days ?? NUMBERMAP.ZERO
        // If lead_time_days is 0 or null, return tentative date (no calculation needed)
        if (leadTimeDays === NUMBERMAP.ZERO || leadTimeDays === null) {
            return tentativeDate
        }
        // Calculate expected date: Tentative Date + lead_time_days
        return dayjs(tentativeDate).add(leadTimeDays, 'days')
    }

    const recalculatePartExpectedDates = (tentativeDate: dayjs.Dayjs | null, formDataToSave: typeof formData) => {
        setPartDetailsData(currentParts => {
            const updatedParts = currentParts.map(part => ({
                ...part,
                expected_date_of_delivery: calculateExpectedDate(tentativeDate, part.part_id ?? part.part_number_id)
            }))
            if (!initialDraftLoading.current) {
                handleDraftSave(formDataToSave, updatedParts)
            }
            return updatedParts
        })
    }

    const handleDateChange = (field: string, value: dayjs.Dayjs | null) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value }
            /**
             * Auto-recalculate expected dates when tentative date changes
             * 
             * When the user changes the Tentative Date of Delivery field:
             * - If order type is "part", automatically recalculate expected dates 
             *   for all parts in the grid using the new tentative date
             * - Each part's expected date = new tentative date + that part's lead_time_days
             * - This ensures all parts stay in sync when the tentative date changes
             */
            const isTentativeDateChange = field === FORM_FIELD_KEYS.TENTATIVE_DATE
            const isPartOrderType = prev.orderType?.toLowerCase() === ORDER_TYPES.PART
            
            if (isTentativeDateChange && isPartOrderType) {
                recalculatePartExpectedDates(value, newData)
            } else if (!initialDraftLoading.current) {
                handleDraftSave(newData)
            }
            return newData
        })
        // Clear validation error when user selects a date
        if (value) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }))
        }
    }


    // Validation functions
    const validateForm = () => {
        const isInfrastructure = formData.orderType === ORDER_TYPES.INFRASTRUCTURE
        const errors = {
            orderTypeId: '',
            vendorType: '',
            vendorName: '',
            ...(isInfrastructure ? { infrastructureRequestId: '' } : {}),
            purchaseOrderDate: '',
            purchaseOrderNumber: '',
            qtnRef: '',
            tentativeDate: '',
            invoiceLocation: '',
            invoiceAddress: '',
            shipToContactPerson: '',
            shipToAddress: '',
            shipToLocation: '',
            status: '',
            fileUpload: '',
            partDetails: '',
        }

        const fieldsToValidate = Object.keys(errors).filter(key => key !== 'fileUpload' && key !== 'partDetails')
        fieldsToValidate.forEach(key => {
            if (!formData[key as keyof typeof formData]) {
                const errorKey = key as keyof typeof VALIDATION_MESSAGES
                if (VALIDATION_MESSAGES[errorKey]) {
                    errors[key as keyof typeof errors] = VALIDATION_MESSAGES[errorKey]
                }
            }
        })

        // Validate Part Details or Infrastructure Details
        if (partDetailsData.length === NUMBERMAP.ZERO) {
            errors.partDetails = isInfrastructure
                ? VALIDATION_MESSAGES.INFRASTRUCTURE_DETAILS_REQUIRED
                : VALIDATION_MESSAGES.PART_DETAILS_REQUIRED
        }

        // Validate File Upload
        if (!isDocumentUploadValid(finalFileData, formData.documents)) {
            errors.fileUpload = VALIDATION_MESSAGES.FILE_UPLOAD_REQUIRED
        }
        setValidationErrors(errors)
        return !Object.values(errors).some(error => error !== '')
    }

    useEffect(() => {
        if (partCategoryData?.data && partCategoryData?.data?.length > NUMBERMAP.ZERO) {
            setPartCategory(partCategoryData.data[NUMBERMAP.ZERO]?.part_categories ?? [])
        }
    }, [partCategoryData])

    useEffect(() => {
        if (infrastructureRequestDetailData?.data && Array.isArray(infrastructureRequestDetailData.data) && infrastructureRequestDetailData.data.length > NUMBERMAP.ZERO) {
            const infraData = infrastructureRequestDetailData.data[NUMBERMAP.ZERO] as any
            if (infraData?.infrastructure_categories && Array.isArray(infraData.infrastructure_categories)) {
                setInfraCategory(infraData.infrastructure_categories)
            }
        }
    }, [infrastructureRequestDetailData])

    /**
     * Recalculate expected dates when partNumbersData becomes available
     * 
     * This handles the case where the form loads with data but partNumbersData
     * hasn't loaded yet. Once partNumbersData is available, recalculate expected
     * dates for all parts using the tentative date and each part's lead_time_days.
     */
    useEffect(() => {
        if (
            partNumbersData?.data &&
            formData.orderType?.toLowerCase() === ORDER_TYPES.PART &&
            formData.tentativeDate
        ) {
            setPartDetailsData(currentParts => {
                if (currentParts.length === NUMBERMAP.ZERO) {
                    return currentParts
                }
                const updatedParts = currentParts.map(part => ({
                    ...part,
                    expected_date_of_delivery: calculateExpectedDate(formData.tentativeDate, part.part_id ?? part.part_number_id)
                }))
                return updatedParts
            })
        }
    }, [partNumbersData, formData.orderType, formData.tentativeDate])

    const createFileMetadata = createFileMetadataGenerator({
        isEditMode: Boolean(isEditMode),
        draftData,
        existingData: purchaseOrderData,
        finalFileData,
        dataPath: 'supporting_files',
    })

    const handleSave = () => {
        // Validate form fields
        if (!validateForm()) {
            return
        }
        // Clear draft on successful save
        clearDraftSave()
        const isInfrastructure = formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE
        // Prepare details array based on order type
        const details = isInfrastructure
            ? partDetailsData.map((part) => ({
                infrastructure_type_id: part.infrastructure_type_id ?? part.part_id ?? NUMBERMAP.ZERO,
                part_id: part.part_id ?? NUMBERMAP.ZERO,
                quantity: Number(part.quantity) || NUMBERMAP.ZERO,
                unit_rate: Number(part.unit_rate) || NUMBERMAP.ZERO,
                price: Number(part.price) || NUMBERMAP.ZERO,
                model_number: part.model_number ?? '',
                status: part.status,
                ...(part?.infrastructure_detail_id && {
                    purchase_order_infrastructure_detail_id: part.infrastructure_detail_id
                }),
            }))
            : partDetailsData.map((part) => ({
                part_id: part.part_id ?? NUMBERMAP.ZERO,
                quantity: Number(part.quantity) || NUMBERMAP.ZERO,
                unit_rate: Number(part.unit_rate) || NUMBERMAP.ZERO,
                price: Number(part.price) || NUMBERMAP.ZERO,
                status: part.status,
                ...(part?.purchase_order_part_details_id && {
                    purchase_order_part_details_id: part.purchase_order_part_details_id
                }),
            }))
        // Create FormData for the API
        const formDataPayload = new FormData()
        const formattedPurchaseOrderDate = convertMuiDayjsToUTC(formData.purchaseOrderDate) ?? ''
        const formattedTentativeDate = convertMuiDayjsToUTC(formData.tentativeDate) ?? ''
        // Common fields for both order types
        if (isEditMode && purchaseOrderId) {
            formDataPayload.append(FORM_DATA_FIELDS.PURCHASE_ORDER_ID, purchaseOrderId)
        }
        formDataPayload.append(FORM_DATA_FIELDS.ORDER_TYPE, formData.orderType.toString().toLowerCase() ?? '')
        formDataPayload.append(FORM_DATA_FIELDS.VENDOR_ID, formData.vendorName)
        formDataPayload.append(FORM_DATA_FIELDS.INVOICE_LOCATION, formData.invoiceLocation)
        formDataPayload.append(FORM_DATA_FIELDS.SHIP_TO_CONTACT_PERSON, formData.shipToContactPerson)
        formDataPayload.append(FORM_DATA_FIELDS.SHIP_TO_ADDRESS, formData.shipToAddress)
        formDataPayload.append(FORM_DATA_FIELDS.SHIP_TO_LOCATION, formData.shipToLocation)
        formDataPayload.append(FORM_DATA_FIELDS.REMARKS, formData.remarks)
        formDataPayload.append(FORM_DATA_FIELDS.QTN_REF, formData.qtnRef)
        formDataPayload.append(FORM_DATA_FIELDS.TENTATIVE_DATE, formattedTentativeDate)
        formDataPayload.append(FORM_DATA_FIELDS.INVOICE_ADDRESS, formData.invoiceAddress)
        formDataPayload.append(FORM_DATA_FIELDS.PURCHASE_ORDER_NUMBER, formData.purchaseOrderNumber)
        formDataPayload.append(FORM_DATA_FIELDS.PURCHASE_ORDER_DATE, formattedPurchaseOrderDate)
        if (formData.purchase_infrastructure_request_id) {
            formDataPayload.append(FORM_DATA_FIELDS.PURCHASE_INFRASTRUCTURE_REQUEST_ID, formData.purchase_infrastructure_request_id)
        }
        if (formData.orderType?.toString()?.toLowerCase() !== ORDER_TYPES.PART) {
            formDataPayload.append(FORM_DATA_FIELDS.INFRASTRUCTURE_REQUEST_ID, formData.infrastructureRequestId)
        }
        // Append order type specific details
        formDataPayload.append(
            isInfrastructure ? 'infrastructure_details' : FORM_DATA_FIELDS.PART_DETAILS,
            JSON.stringify(details)
        )

        // Calculation fields
        formDataPayload.append(FORM_DATA_FIELDS.TOTAL_EX_WORK, formData.totalExWork ?? NUMBERMAP.ZERO)
        formDataPayload.append(FORM_DATA_FIELDS.PACKAGING_AND_TRANSPORT, formData.packagingAndTransport ?? NUMBERMAP.ZERO)
        const totalAmount = calculateGST(
            Number(formData.gst),
            Number(formData.packagingAndTransport) + Number(formData.totalExWork)
        )
        formDataPayload.append(
            FORM_DATA_FIELDS.SUB_TOTAL,
            (Number(formData.packagingAndTransport) + Number(formData.totalExWork))?.toFixed(NUMBERMAP.TWO) ?? NUMBERMAP.ZERO
        )
        formDataPayload.append(FORM_DATA_FIELDS.GST, formData.gst ?? NUMBERMAP.ZERO)
        formDataPayload.append(FORM_DATA_FIELDS.TOTAL, totalAmount.totalAmount?.toString() ?? NUMBERMAP.ZERO)
        formDataPayload.append(FORM_DATA_FIELDS.STATUS_ID, formData.status)
        if (purchaseRequisitionId) {
            formDataPayload.append(FORM_DATA_FIELDS.PURCHASE_REQUISITION_ID, purchaseRequisitionId)
        }

        // Handle file uploads and append file metadata
        appendFileMetadataToFormData(formDataPayload, finalFileData, createFileMetadata)

        postPurchaseOrder(formDataPayload, {
            onSuccess: () => {
                resetDraftAndDocumentState()
                showActionAlert(SUCCESS_ALERT)
                router.push(ROUTES.PURCHASE_ORDERS_LIST)
            },
            onError: () => {
                showActionAlert(FAILED_ALERT)
            },
        })
    }

    const handleCancel = async () => {
        await checkUnsavedDraftBeforeLeave()
        resetDraftAndDocumentState()
        router.push(ROUTES.PURCHASE_ORDERS_LIST)
    }

    const getPurchaseOrderTypeColumn = () => {
        return formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE ? 'infrastructure_type_name' : PART_DETAILS_FIELDS.PART_NUMBER
    }
    const getPurchaseOrderTypeHeader = () => {
        return formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE ? 'Infrastructure Type' : PART_DETAILS_HEADERS.PART_NUMBER
    }
    const partDetailsColumns: GridColDef[] = [
        {
            field: PART_DETAILS_FIELDS.SNO,
            headerName: PART_DETAILS_HEADERS.SNO,
            flex: NUMBERMAP.HALF,
        },
        {
            field: getPurchaseOrderTypeColumn(),
            headerName: getPurchaseOrderTypeHeader(),
            flex: NUMBERMAP.ONE,
            renderCell: (params: GridRenderCellParams) => {
                if (formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE) {
                    return params.row.infrastructure_type_name ?? params.row.infrastructure_type ?? '-'
                }
                return params.row.part_number ?? '-'
            },
        },
        {
            field: PART_DETAILS_FIELDS.EXPECTED_DATE_OF_DELIVERY,
            headerName: PART_DETAILS_HEADERS.EXPECTED_DATE_OF_DELIVERY,
            flex: NUMBERMAP.ONE_HALF,
            /**
             * Custom render cell for Expected Date of Delivery column
             * 
             * This ensures the date is displayed in the same format as the 
             * Tentative Date of Delivery field (using organization date format).
             */
            renderCell: (params: GridRenderCellParams) => {
                if (!params.row.expected_date_of_delivery) return '-'

                // Use formatDate method to handle date formatting consistently
                const formattedDate = formatDate(params.row.expected_date_of_delivery)
                return formattedDate ?? '-'
            },
        },
        {
            field: PART_DETAILS_FIELDS.QUANTITY,
            headerName: PART_DETAILS_HEADERS.QUANTITY,
            flex: NUMBERMAP.ONE,
        },
        {
            field: PART_DETAILS_FIELDS.UNIT_RATE,
            headerName: PART_DETAILS_HEADERS.UNIT_RATE,
            flex: NUMBERMAP.ONE,
        },
        {
            field: PART_DETAILS_FIELDS.STATUS,
            headerName: PART_DETAILS_HEADERS.STATUS,
            flex: NUMBERMAP.ONE,
            renderCell: (params: GridRenderCellParams) => {
                return <StatusTypography value={params.value} />
            },
        },
        {
            field: PART_DETAILS_FIELDS.PRICE,
            headerName: PART_DETAILS_HEADERS.PRICE,
            flex: NUMBERMAP.ONE,
        },
        {
            field: PART_DETAILS_FIELDS.ACTION,
            headerName: PART_DETAILS_HEADERS.ACTION,
            flex: NUMBERMAP.ONE,
            renderCell: (params: GridRenderCellParams) => (
                <ActionButton
                    onDelete={() => handleDeletePart(params.row.id)}
                    onEdit={() => handleEditPart(params.row.id)}
                    deleteDisabled={params.row.status === NUMBERMAP.TWO}
                />
            ),
        },
    ]

    const handleEditPart = (id: string) => {
        setEditingPartId(id)
        setIsModalOpen(true)
    }

    const markPartAsDeleted = (parts: PartDetail[], partId: string): PartDetail[] => {
        return parts.map(part => {
            if (part.id === partId) {
                return {
                    ...part,
                    status: NUMBERMAP.TWO, // Set status to 2 for deleted rows
                };
            }
            return part;
        });
    }

    const handleDeletePart = (id: string) => {
        showActionAlert(DELETE_ALERT).then((result) => {
            if (!result.isConfirmed) return;

            setPartDetailsData(prev => {
                const updated = markPartAsDeleted(prev, id)
                if (!initialDraftLoading.current) {
                    handleDraftSave(formData, updated)
                }
                return updated
            })
        })
    }

    const handleAddPart = () => {
        setEditingPartId(null)
        setIsModalOpen(true)
    }

    const handleInfrastructureDetailsSave = (modalData: PartDetailsModalFormData) => {
        // Infrastructure logic
        const infrastructureTypeId = parseInt(modalData.part_number_id) ?? undefined
        const foundInfraType = infrastructureTypesData?.data?.find((type: any) => {
            return type.infrastructure_type_id?.toString() === modalData.part_number_id.toString()
        })

        if (editingPartId) {
            // Edit existing infrastructure
            setPartDetailsData(prev => {
                const updatedPartDetails = prev.map(part =>
                    part.id === editingPartId
                        ? {
                            ...part,
                            infrastructure_type: foundInfraType?.infrastructure_type_name ?? modalData.part_number ?? '-',
                            infrastructure_type_id: infrastructureTypeId,
                            part_id: infrastructureTypeId,
                            model_number: modalData.model_number ?? '',
                            quantity: modalData.quantity,
                            unit_rate: modalData.unit_rate,
                            price: modalData.price,
                            status: parseInt(modalData.status),
                            expected_date_of_delivery: null,
                        }
                        : part
                )
                if (!initialDraftLoading.current) {
                    handleDraftSave(formData, updatedPartDetails)
                }
                return updatedPartDetails
            })
            showActionAlert(SUCCESS_ALERT)
        } else {
            // Add new infrastructure
            const newPart = {
                id: Date.now().toString(),
                sno: partDetailsData.length + NUMBERMAP.ONE,
                infrastructure_type: ((foundInfraType as any)?.type_name ?? (foundInfraType as any)?.infrastructure_type_name) ?? modalData.part_number ?? '-',
                infrastructure_type_id: infrastructureTypeId,
                part_id: infrastructureTypeId,
                model_number: modalData.model_number ?? '',
                quantity: modalData.quantity,
                unit_rate: modalData.unit_rate,
                price: modalData.price,
                status: parseInt(modalData.status),
                expected_date_of_delivery: null,
            }
            setPartDetailsData(prev => {
                const newPartDetails = [...prev, newPart]
                if (!initialDraftLoading.current) {
                    handleDraftSave(formData, newPartDetails)
                }
                return newPartDetails
            })
            showActionAlert(SUCCESS_ALERT)
        }
    }
    const handlePartDetailsSave = (modalData: PartDetailsModalFormData) => {
        /**
         * Calculate expected date of delivery when saving part details
         * 
         * This calculates: Expected Date = Tentative Date + lead_time_days (from selected part)
         * Only applies when order type is "part" (handled inside calculateExpectedDate)
         * 
         * The calculated date is stored with the part and displayed in the grid.
         */
        const calculatedDate = calculateExpectedDate(formData.tentativeDate, modalData.part_number_id)

        if (editingPartId) {
            // Edit existing part
            const partId = parseInt(modalData.part_number_id) ?? undefined
            setPartDetailsData(prev => {
                const updatedPartDetails = prev.map(part =>
                    part.id === editingPartId
                        ? {
                            ...part,
                            part_number: modalData.part_number ?? '-',
                            part_number_id: modalData.part_number_id,
                            part_id: partId,
                            quantity: modalData.quantity,
                            unit_rate: modalData.unit_rate,
                            price: modalData.price,
                            status: parseInt(modalData.status),
                            expected_date_of_delivery: calculatedDate,
                        }
                        : part
                )
                if (!initialDraftLoading.current) {
                    handleDraftSave(formData, updatedPartDetails)
                }
                return updatedPartDetails
            })
            showActionAlert(SUCCESS_ALERT)
        } else {
            // Add new part
            const partId = parseInt(modalData.part_number_id) ?? undefined
            const newPart = {
                id: Date.now().toString(),
                sno: partDetailsData.length + NUMBERMAP.ONE,
                part_number: modalData.part_number ?? '-',
                part_number_id: modalData.part_number_id,
                part_id: partId,
                quantity: modalData.quantity,
                unit_rate: modalData.unit_rate,
                price: modalData.price,
                status: parseInt(modalData.status),
                expected_date_of_delivery: calculatedDate,
            }
            setPartDetailsData(prev => {
                const newPartDetails = [...prev, newPart]
                if (!initialDraftLoading.current) {
                    handleDraftSave(formData, newPartDetails)
                }
                return newPartDetails
            })
            showActionAlert(SUCCESS_ALERT)
        }
    }
    const handleModalSave = (modalData: PartDetailsModalFormData) => {
        const isInfrastructure = formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE

        if (isInfrastructure) {
            handleInfrastructureDetailsSave(modalData)
        } else {
            // Part logic
            handlePartDetailsSave(modalData)
        }
        // Clear part details validation error when part is added
        setValidationErrors(prev => ({ ...prev, partDetails: '' }))
        // Close modal and reset form
        setIsModalOpen(false)
        setEditingPartId(null)
    }

    const handleModalCancel = () => {
        setIsModalOpen(false)
        setEditingPartId(null)
    }

    // File upload handlers
    const handleFileUpload = (newFile: FileData) => {
        setFormData((prev) => {
            const newData = {
                ...prev,
                documents: [...(prev.documents ?? []), newFile as PurchaseOrderFileData],
            }
            return newData
        })
        // Clear file upload validation error when file is uploaded
        setValidationErrors(prev => ({ ...prev, fileUpload: '' }))
    }

    const handleFileEdit = useCallback((updatedFile: FileData) => {
        setFormData((prev) => {
            const updatedFiles = prev.documents.map((file: any) => {
                const currentId = typeof file === COMMON_STRINGS.OBJECT && COMMON_STRINGS.ID in file
                    ? (file as Record<string, unknown>)[COMMON_STRINGS.ID]
                    : undefined
                const updatedId = updatedFile.id
                return currentId === updatedId ? { ...file, ...updatedFile } : file
            })
            const newData = {
                ...prev,
                documents: updatedFiles as any[],
            }
            return newData
        })
    }, [])

    // Handle file upload manager submit
    const handleFileUploadSubmit = (data: FileManagerSubmitData) => {
        const merged = mergeFinalFileData(finalFileData, data);
        setFinalFileData(merged);

        if (!initialDraftLoading.current) {
            handleDraftSave(formData, partDetailsData, merged);
        }

        // Clear file upload error when files are present (same pattern as handleInputChange clears errors for other fields)
        if (isDocumentUploadValid(merged, formData.documents)) {
            setValidationErrors(prev => ({ ...prev, fileUpload: '' }));
        }
    }

    // Get selected vendor details for Invoice To and Shipping To
    const selectedVendor = React.useMemo(() => {
        if (!formData.vendorName || !vendorListData?.data) return null
        return vendorListData.data.find((vendor: any) => vendor.id?.toString() === formData.vendorName)
    }, [formData.vendorName, vendorListData?.data])

    const buttonConfig = [
        { label: COMMON_STRINGS.CANCEL, onClick: handleCancel },
        { label: COMMON_STRINGS.SAVE, onClick: handleSave, loading: isSaving },
    ]
    function calculateGST(amount: number, gstRate: number) {
        const gstAmount = (amount * gstRate) / NUMBERMAP.HUNDRED;
        const totalAmount = amount + gstAmount;

        return {
            gstAmount,
            totalAmount
        };
    }

    const partCategoryColumns: GridColDef[] = [
        {
            field: "sno",
            headerName: "S.No.",
            flex: NUMBERMAP.HALF,
        },
        {
            field: "part_category_type_name",
            headerName: "Part Type",
            flex: NUMBERMAP.ONE,
        },
        {
            field: "part_subcategory_type_name",
            headerName: "Part Sub Type",
            flex: NUMBERMAP.ONE_HALF,
        },
        {
            field: "part_category_subclass_name",
            headerName: "Part Sub Class",
            flex: NUMBERMAP.ONE_HALF,
        },
        {
            field: "part_category_name",
            headerName: "Part Category",
            flex: NUMBERMAP.ONE_HALF,
        },

    ]
    const resetFormData = () => {
        setFormData({
            orderTypeId: '',
            orderType: '',
            infrastructureRequestId: '',
            purchaseOrderDate: null,
            purchaseOrderNumber: '',
            qtnRef: '',
            tentativeDate: null,
            invoiceLocation: '',
            invoiceAddress: '',
            shipToContactPerson: '',
            shipToAddress: '',
            shipToLocation: '',
            remarks: '',
            totalExWork: '',
            packagingAndTransport: '',
            subTotal: '',
            gst: '',
            total: '',
            status: '',
            documents: [],
            vendorType: '',
            vendorId: '',
        })
        setPartDetailsData([])
        setFinalFileData(FINALFILEINITIALDATA)
        setDraftDocuments({})
        setDraftDelete([])
    }

    if (params?.slug?.length > NUMBERMAP.TWO) {
        return notFound()
    }
    return (
        <FormContainer>
            <GlobalLoader loading={isSaving ?? isLoadingPurchaseOrder} />
            <FormWrapper>
                {isDraftSaving && <DraftLoading />}
                <Box>
                    <Label title={isEditMode ? PAGE_TITLES.EDIT_PURCHASE_ORDER : PAGE_TITLES.ADD_PURCHASE_ORDER} />
                </Box>
                <FormContent>
                    <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InputField
                                label={FORM_LABELS.ORDER_TYPE}
                                placeholder={FORM_PLACEHOLDERS.SELECT_ORDER_TYPE}
                                isDropdown
                                options={orderTypesData?.data ?? []}
                                value={formData.orderTypeId}
                                disabled={isEditMode}
                                onChange={(value: string) => {
                                    if (!value) {
                                        resetFormData()
                                    }
                                    const selectedOrderType = orderTypesData?.data?.find((order: { order_type_id: number; order_type: string }) => order.order_type_id?.toString() === value)?.order_type_slug ?? ''
                                    setFormData(prev => {
                                        const updatedata = {
                                            ...prev,
                                            orderTypeId: value,
                                            orderType: selectedOrderType
                                        }
                                        /**
                                         * Clear part details grid when order type changes
                                         * This ensures a clean state when switching between Part and Infrastructure order types
                                         */
                                        setPartDetailsData([])
                                        if (!initialDraftLoading.current) {
                                            handleDraftSave(updatedata, [])
                                        }
                                        return updatedata
                                    })
                                    setValidationErrors(prev => ({ ...prev, orderTypeId: '' }))
                                }}
                                error={validationErrors.orderTypeId}
                                keyField={FORM_DATA_FIELDS.ORDER_TYPE_ID}
                                valueField={FORM_DATA_FIELDS.ORDER_TYPE}
                            />
                        </Grid2>
                    </Grid2>
                </FormContent>
                {formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE && (
                    <>
                        <Label title="Infrastructure Request Details" />
                        <FormContent>
                            <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
                                <Grid2 size={NUMBERMAP.SIX}>
                                    <InputField
                                        label="Infrastructure Request*"
                                        placeholder="Select Infrastructure Request"
                                        isDropdown
                                        options={infrastructureRequestListData?.data ?? []}
                                        value={formData.infrastructureRequestId}
                                        onChange={(value: string) => {
                                            handleInputChange('infrastructureRequestId', value)
                                            setValidationErrors(prev => ({ ...prev, infrastructureRequestId: '' }))
                                        }}
                                        error={validationErrors.infrastructureRequestId}
                                        keyField="infrastructure_request_id"
                                        valueField="infrastructure_name"
                                    />
                                </Grid2>
                                <Grid2 size={NUMBERMAP.SIX}>
                                    <InfoField
                                        value={
                                            infrastructureRequestDetailData?.data && Array.isArray(infrastructureRequestDetailData.data) && infrastructureRequestDetailData.data.length > NUMBERMAP.ZERO
                                                ? infrastructureRequestDetailData.data[NUMBERMAP.ZERO]?.category_name ?? '-'
                                                : '-'
                                        }
                                        label="Infrastructure Category"
                                    />
                                </Grid2>
                                <Grid2 size={NUMBERMAP.SIX}>
                                    <InfoField
                                        value={
                                            infrastructureRequestDetailData?.data && Array.isArray(infrastructureRequestDetailData.data) && infrastructureRequestDetailData.data.length > NUMBERMAP.ZERO
                                                ? (infrastructureRequestDetailData.data[NUMBERMAP.ZERO] as any)?.type_name ?? '-'
                                                : '-'
                                        }
                                        label="Infrastructure Type"
                                    />
                                </Grid2>
                            </Grid2>
                        </FormContent>
                    </>
                )}
                <Label title={PAGE_TITLES.PART_ORDER} />
                <FormContent>
                    <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>

                        <Grid2 size={NUMBERMAP.SIX}>
                            <InputField
                                label={FORM_LABELS.VENDOR_TYPE}
                                placeholder={FORM_PLACEHOLDERS.SELECT_VENDOR_TYPE}
                                isDropdown
                                options={vendorTypesData?.data ?? []}
                                value={formData.vendorType}
                                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.VENDOR_TYPE, value)}
                                error={validationErrors.vendorType}
                                keyField={FORM_FIELD_NAMES.ID}
                                valueField={FORM_FIELD_NAMES.VENDOR_TYPE_NAME}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InputField
                                label={FORM_LABELS.VENDOR_NAME}
                                placeholder={formData.vendorType ? FORM_PLACEHOLDERS.SELECT_VENDOR_NAME : FORM_PLACEHOLDERS.SELECT_VENDOR_NAME_DISABLED}
                                isDropdown
                                options={filteredVendors}
                                value={formData.vendorName}
                                onChange={(value: string) => {
                                    handleInputChange(FORM_FIELD_KEYS.VENDOR_NAME, value)
                                    handleInputChange(FORM_FIELD_KEYS.VENDOR_ID, value)
                                }}
                                disabled={!formData.vendorType}
                                error={validationErrors.vendorName}
                                keyField={FORM_FIELD_NAMES.ID}
                                valueField={FORM_FIELD_NAMES.VENDOR_NAME}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <DatePicker
                                label={FORM_LABELS.TENTATIVE_DATE}
                                value={dayjs(formData.tentativeDate) ?? null}
                                onChange={(value) => handleDateChange(FORM_FIELD_KEYS.TENTATIVE_DATE, value)}
                                error={validationErrors.tentativeDate}
                                readOnly={true}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InputField
                                label={FORM_LABELS.QTN_REF}
                                placeholder={FORM_PLACEHOLDERS.ENTER_QTN_REF}
                                value={formData.qtnRef}
                                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.QTN_REF, value)}
                                error={validationErrors.qtnRef}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InputField
                                label={FORM_LABELS.PURCHASE_ORDER_NUMBER}
                                placeholder={FORM_PLACEHOLDERS.ENTER_PURCHASE_ORDER_NUMBER}
                                value={formData.purchaseOrderNumber}
                                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.PURCHASE_ORDER_NUMBER, value)}
                                error={validationErrors.purchaseOrderNumber}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <DatePicker
                                label={FORM_LABELS.PURCHASE_ORDER_DATE}
                                value={dayjs(formData.purchaseOrderDate) ?? null}
                                onChange={(value) => handleDateChange(FORM_FIELD_KEYS.PURCHASE_ORDER_DATE, value)}
                                error={validationErrors.purchaseOrderDate}
                                readOnly={true}
                            />
                        </Grid2>
                    </Grid2>
                </FormContent>

                <Label title={PAGE_TITLES.INVOICE_TO} />
                <FormContent>
                    <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InfoField value={selectedVendor?.vendor_name ?? '-'} label={'Customer Name'} />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InfoField value={((profileData as any)?.first_name ?? '-') + ((profileData as any)?.last_name ?? '')} label={'Contact Person'} />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <Description
                                label={FORM_LABELS.ADDRESS}
                                placeholder={FORM_PLACEHOLDERS.ENTER_ADDRESS}
                                value={formData.invoiceAddress}
                                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.INVOICE_ADDRESS, value)}
                                error={validationErrors.invoiceAddress}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InputField
                                label={FORM_LABELS.INVOICE_LOCATION}
                                placeholder={FORM_PLACEHOLDERS.ENTER_INVOICE_LOCATION}
                                value={formData.invoiceLocation}
                                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.INVOICE_LOCATION, value)}
                                error={validationErrors.invoiceLocation}
                            />
                        </Grid2>
                    </Grid2>
                </FormContent>
                <Label title={PAGE_TITLES.SHIPPING_TO} />
                <FormContent>
                    <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InfoField value={selectedVendor?.vendor_name ?? '-'} label={'Customer Name'} />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InputField
                                label={FORM_LABELS.SHIP_TO_CONTACT_PERSON}
                                placeholder={FORM_PLACEHOLDERS.ENTER_SHIP_TO_CONTACT_PERSON}
                                value={formData.shipToContactPerson}
                                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.SHIP_TO_CONTACT_PERSON, value)}
                                error={validationErrors.shipToContactPerson}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <Description
                                label={FORM_LABELS.SHIP_TO_ADDRESS}
                                placeholder={FORM_PLACEHOLDERS.ENTER_SHIP_TO_ADDRESS}
                                value={formData.shipToAddress}
                                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.SHIP_TO_ADDRESS, value)}
                                error={validationErrors.shipToAddress}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InputField
                                label={FORM_LABELS.SHIP_TO_LOCATION}
                                placeholder={FORM_PLACEHOLDERS.ENTER_SHIP_TO_LOCATION}
                                value={formData.shipToLocation}
                                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.SHIP_TO_LOCATION, value)}
                                error={validationErrors.shipToLocation}
                            />
                        </Grid2>
                        {formData.orderType?.toLowerCase() === ORDER_TYPES.PART && (
                            <Grid2 size={NUMBERMAP.TWELVE}>
                                <DataGridTable
                                    title={'Approved Part Categories'}
                                    rows={partCategory}
                                    columns={partCategoryColumns}
                                    hideFooter
                                    idField={'id'}
                                />
                            </Grid2>
                        )}
                        {formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE && (
                            <Grid2 size={NUMBERMAP.TWELVE}>
                                <DataGridTable
                                    title={'Approved Infra Categories'}
                                    rows={infraCategory}
                                    columns={[
                                        {
                                            field: "sno",
                                            headerName: "S.No.",
                                            flex: NUMBERMAP.HALF,
                                        },
                                        {
                                            field: "infra_category",
                                            headerName: "Infra Category",
                                            flex: NUMBERMAP.ONE,
                                        },
                                        {
                                            field: "infra_type",
                                            headerName: "Infra Type",
                                            flex: NUMBERMAP.ONE,
                                        },
                                    ]}
                                    hideFooter
                                    idField={'id'}
                                />
                            </Grid2>
                        )}
                    </Grid2>
                </FormContent>
                <PartDetailsContainer>


                    <TableWrapper>
                        <Box sx={PART_DETAILS_GRID_STYLES}>
                            <DataGridTable
                                title={formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE ? PAGE_TITLES.INFRASTRUCTURE_DETAILS : PAGE_TITLES.PART_DETAILS}
                                onAddRow={handleAddPart}
                                showAddButton
                                rows={partDetailsData}
                                columns={partDetailsColumns}
                                hideFooter

                                idField={COMMON_STRINGS.ID}
                            />
                        </Box>

                        <CalculationSection>
                            <CalculationRow>
                                <CalculationLabel>Total EX Work</CalculationLabel>
                                <CalculationValue>
                                    <CalculationInput>
                                        <InputField
                                            label=""
                                            placeholder="Enter Total EX Work"
                                            onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.TOTAL_EX_WORK, value)}
                                            value={formData.totalExWork}
                                        />
                                    </CalculationInput>
                                </CalculationValue>
                            </CalculationRow>

                            <CalculationRow>
                                <CalculationLabel>Packaging and Transport</CalculationLabel>
                                <CalculationValue>
                                    <CalculationInput>
                                        <InputField
                                            label=""
                                            placeholder="Enter Packaging and Transport"
                                            onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.PACKAGING_AND_TRANSPORT, value)}
                                            value={formData.packagingAndTransport}
                                        />
                                    </CalculationInput>
                                </CalculationValue>
                            </CalculationRow>

                            <CalculationRow >
                                <CalculationLabel>Sub Total</CalculationLabel>
                                <CalculationValue>
                                    <ReadOnlyValue>{(Number(formData.packagingAndTransport) + Number(formData.totalExWork)).toFixed(2) ?? 'Label'}</ReadOnlyValue>
                                </CalculationValue>
                            </CalculationRow>

                            <CalculationRow>
                                <CalculationLabel>GST%</CalculationLabel>
                                <CalculationValue>
                                    <CalculationInput>
                                        <InputField
                                            label=""
                                            type="text"
                                            placeholder="Enter GST%"
                                            value={formData.gst}
                                            onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.GST, value)}
                                        />
                                    </CalculationInput>
                                </CalculationValue>
                            </CalculationRow>

                            <CalculationRow >
                                <CalculationLabel>Total</CalculationLabel>
                                <CalculationValue>
                                    <ReadOnlyValue>{calculateGST((Number(formData.packagingAndTransport) + Number(formData.totalExWork)), Number(formData.gst)).totalAmount ?? '-'}</ReadOnlyValue>
                                </CalculationValue>
                            </CalculationRow>
                        </CalculationSection>
                    </TableWrapper>

                    {validationErrors.partDetails && (
                        <ErrorText>
                            {validationErrors.partDetails}
                        </ErrorText>
                    )}
                </PartDetailsContainer>
                <FormContent>
                    <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
                        <Grid2 size={NUMBERMAP.SIX}>
                            <InputField
                                label={FORM_LABELS.STATUS}
                                placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                                isDropdown
                                options={statusData?.data ?? []}
                                value={formData.status}
                                onChange={(value: string) => handleInputChange(FORM_FIELD_KEYS.STATUS, value)}
                                error={validationErrors.status}
                                keyField={FORM_FIELD_NAMES.STATUS_ID}
                                valueField={FORM_FIELD_NAMES.STATUS_NAME}
                            />
                        </Grid2>
                    </Grid2>
                </FormContent>
                <FormContent>
                    <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <FileUploadManager
                                key={`file-manager-${fileManagerKey}`}
                                initialFiles={formData.documents as unknown as FileDocument[]}
                                onFileUpload={handleFileUpload}
                                onFileEdit={handleFileEdit}
                                onSubmit={handleFileUploadSubmit}
                                uploadMandError={validationErrors.fileUpload}
                                subHeader={PAGE_TITLES.FILE_UPLOAD}
                            />
                        </Grid2>
                    </Grid2>
                    <ButtonGroup buttons={buttonConfig} />
                </FormContent>
            </FormWrapper>

            <PurchaseOrderPartDetailsModal
                open={isModalOpen}
                onClose={handleModalCancel}
                onSave={handleModalSave}
                initialData={editingPartId ? (() => {
                    const partToEdit = partDetailsData.find(part => part.id === editingPartId)
                    if (partToEdit) {
                        const isInfrastructure = formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE
                        if (isInfrastructure) {
                            const infraTypeId = partToEdit.infrastructure_type_id ? partToEdit.infrastructure_type_id.toString() : (partToEdit.part_id?.toString() ?? '')
                            return {
                                part_number_id: infraTypeId,
                                part_number: partToEdit.infrastructure_type_name ?? partToEdit.infrastructure_type ?? '-',
                                quantity: partToEdit.quantity,
                                unit_rate: partToEdit.unit_rate,
                                price: partToEdit.price,
                                status: partToEdit.status?.toString(),
                                model_number: partToEdit.model_number ?? '',
                            }
                        } else {
                            // The part_number_id should match the id from partNumbersData (which is the part number id)
                            const partNumberId = partToEdit.part_id ? partToEdit.part_id.toString() : (partToEdit.part_number_id ?? '')
                            return {
                                part_number_id: partNumberId,
                                part_number: partToEdit.part_number ?? '-',
                                quantity: partToEdit.quantity,
                                unit_rate: partToEdit.unit_rate,
                                price: partToEdit.price,
                                status: partToEdit.status.toString(),
                            }
                        }
                    }
                    return undefined
                })() : undefined}
                partNumbersData={formData.orderType?.toLowerCase() === ORDER_TYPES.INFRASTRUCTURE ? { data: infrastructureTypesData?.data ?? [] } : partNumbersData}
                editingPartId={editingPartId}
                orderType={formData.orderType?.toLowerCase()}
            />
        </FormContainer>
    )
}

export default PurchaseOrderForm
