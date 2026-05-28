'use client'
import React, { useState, useEffect } from 'react'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import { useParams, useRouter } from 'next/navigation'
import { Grid2, Box } from '@mui/material'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import dayjs from 'dayjs'
import {
  InputField,
  ButtonGroup,
  Label,
  DataTable,
  showActionAlert,
} from '@/components/ui'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import { NUMBERMAP, BUTTON_LABEL, DATE_FORMATS } from '@/constants/common'
import {
  useGoodsInwardById,
  useUpsertGoodsInward,
  useGetPurchaseOrdersList,
  useSanityCheckInspection,
} from '@/hooks/modules/quality-control-management/useGoodsInward'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import {
  GOODS_INWARD_CONSTANTS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  PAGE_TITLES,
  CREATE,
  DROPDOWN_FIELD_CONFIG,
  GOODS_INWARD_DETAILS_COLUMNS_BASE,
  VALIDATION_MESSAGES,
  TABLE_COLUMN_LABELS,
  FORM_FIELD_NAMES,
  TABLE_FIELD_NAMES,
  DEFAULT_FORM_DATA,
  ID_PART_DETAILS_FIELDS,
} from '@/constants/modules/quality-control-management/goodsInward'
import {
  GoodsInwardFormData,
  GoodsInwardUpsertPayload,
  GoodsInwardFormErrors,
} from '@/types/modules/quality-control-management/goodsInward'
import { formatDate, normalizeFormatString, convertMuiDayjsToUTC, numberValidation } from '@/lib/utils/common'
import { useSelector } from 'react-redux'
import { selectProfileData } from '@/store/slices/menuSlice'
import { FAILED_ALERT, SUCCESS_ALERT } from '@/constants/modules/dnd/formTeam'
import { useAllVendors, useAllVendorTypes } from '@/hooks/modules/vendor-management/useCommonDropdown'
import { GRID_STYLES } from '@/styles/common'

/**
 * Classification : Confidential
 **/

const PurchaseGoodsInwardForm: React.FC = () => {
  const router = useRouter()
  const { id } = useParams()
  const isAddMode = id === CREATE
  const goodsInwardId =
    isAddMode || !id || Number.isNaN(Number(id))
      ? null
      : Number(id)  // ---- Draft Save (Like VendorForm) ----
  const goodsInwardDraftId = isAddMode ? null : goodsInwardId;
  const { draftSave, clearDraftSave, isFetchingDraft, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'goods_inward',
    context_instance_id: goodsInwardDraftId,
    enableFetch: false
  });


  const profileData = useSelector(selectProfileData) 
  const orgDateFormat = profileData?.organization_date_format
    ? normalizeFormatString(profileData.organization_date_format)
    : DATE_FORMATS.DD_MM_YYYY

  // Communications for form data
  const [formData, setFormData] =
    useState<GoodsInwardFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<GoodsInwardFormErrors>({})
  const [vendorTypeId, setVendorTypeId] = useState<number | undefined>(undefined)

  // Fetch goods inward data by ID (only in edit mode)
  const { data: goodsInwardData, isLoading, refetch: goodsInwardRefetch } = useGoodsInwardById(
    goodsInwardId ?? NUMBERMAP.ZERO
  )

  // Fetch dropdown data
  const { data: vendorTypesData } = useAllVendorTypes(NUMBERMAP.ONE)
  const { data: vendorListData } = useAllVendors(
      NUMBERMAP.ONE,
      vendorTypeId ? parseInt(vendorTypeId) : undefined,
      true
  )
  const vendorIdForPO = formData.vendor_id
    ? Number(formData.vendor_id)
    : undefined

  // Use purchase order hook with status=1&vendor_id params
  const { data: purchaseOrdersData } = useGetPurchaseOrdersList(vendorIdForPO)
  const purchaseOrderId = formData.purchase_order_id
    ? Number(formData.purchase_order_id)
    : undefined

  // Fetch sanity check inspection data after purchase order is selected
  const { data: sanityCheckInspectionData, isLoading: isLoadingPartDetails } = useSanityCheckInspection(
    purchaseOrderId,
    !!purchaseOrderId
  )


  // Fetch status options from API
  const { data: statusData } = useOrganizationStatus()

  // Upsert mutation
  const upsertMutation = useUpsertGoodsInward()


  // Goods inward details table rows - use response directly, maintain state for updates
  const [tableRows, setTableRows] = useState<any[]>([])
  
  // Track initial purchase order ID in edit mode to detect changes
  const [initialPurchaseOrderId, setInitialPurchaseOrderId] = useState<number | null>(null)

  // Initialize rows from response (edit mode - initial load only)
  // This runs once when the page loads with existing data
const loadDraftData = (data: any) => {
  // Handle received_date: convert ISO format to organization format for display
  // Use formatDate for consistency with other date handling in the component
  const formattedReceivedDate = data.received_date
    ? formatDate(data.received_date, orgDateFormat)
    : ''
  
  // Store initial purchase order ID for change detection in edit mode
  if (!isAddMode && data?.purchase_order_id) {
    const initialPOId = Number(data.purchase_order_id)
    setInitialPurchaseOrderId(initialPOId)
  }
  
  setFormData({
    ...data,
    vendor_type_id: data?.vendor_type_id?.toString() ?? '',
    vendor_id: data?.vendor_id?.toString() ?? '',
    purchase_order_id: data?.purchase_order_id?.toString() ?? '',
    received_date: formattedReceivedDate,
    status: data?.status_id ?? data?.status ?? '',
  })
  setTableRows(data?.goods_inward_details??[])
  setVendorTypeId(data?.vendor_type_id ? Number(data.vendor_type_id) : undefined)
}

useEffect(() => {
  setFormData(DEFAULT_FORM_DATA)
  setErrors({})
  setTableRows([])
  setVendorTypeId(undefined)
  setInitialPurchaseOrderId(null) // Reset state when ID changes
  if (!isAddMode){
    goodsInwardRefetch()
  }else{
    fetchDraft()
  }
}, [isAddMode])

useEffect(() => {
  if (draftData?.data && isAddMode) {
  loadDraftData(draftData?.data)
  }
}, [draftData])

useEffect(() => {
  const apiData = goodsInwardData?.data?.[NUMBERMAP.ZERO]
  if(goodsInwardData?.data && !apiData){
    loadDraftData(goodsInwardData.data)
  }
  if (!isAddMode && apiData) {
      // Format received_date to organization date format
      const formattedReceivedDate = apiData.received_date
        ? formatDate(apiData.received_date, orgDateFormat)
        : ''
      
      // Store initial purchase order ID for change detection
      const initialPOId = apiData?.purchase_order_id ? Number(apiData.purchase_order_id) : null
      setInitialPurchaseOrderId(initialPOId)
      
      // Ensure all rows have an id field for MUI DataGrid
      setFormData(() => ({
        ...apiData,
        vendor_type_id: apiData?.vendor_type_id?.toString() ?? '',
        vendor_id: apiData?.vendor_id?.toString() ?? '',
        purchase_order_id: apiData?.purchase_order_id?.toString() ?? '',
        received_date: formattedReceivedDate,
        status: apiData?.status_id ?? apiData?.status ?? '',
      }))
      // Also update vendorTypeId state for vendor dropdown initialization
      setVendorTypeId(apiData?.vendor_type_id ?? undefined)

      // Transform goods_inward_details to match column field names
      const transformedRows = (apiData?.goods_inward_details ?? []).map((row: any) => ({
        ...row,
        quantity: row.po_quantity ?? '', // Map po_quantity to quantity for column compatibility
      }))
      
      setTableRows(transformedRows)
    }
  }, [isAddMode, goodsInwardData?.data, orgDateFormat])

  useEffect(() => {
    if (isAddMode && purchaseOrderId && sanityCheckInspectionData?.data?.[NUMBERMAP.ZERO]?.part_details) {
      // Check if purchase order has changed from draft data
      const draftPurchaseOrderId = draftData?.data?.purchase_order_id 
        ? Number(draftData.data.purchase_order_id) 
        : null
      const purchaseOrderChanged = draftPurchaseOrderId !== purchaseOrderId
      
      // Load part details if purchase order changed or if tableRows is empty
      if (purchaseOrderChanged || tableRows.length === NUMBERMAP.ZERO) {
        const rowsWithId = sanityCheckInspectionData.data[NUMBERMAP.ZERO].part_details.map((row, index) => ({
          ...row,
          goods_inward_detail_id : 'create_'+(index + NUMBERMAP.ONE),
        }))
        
        setTableRows(rowsWithId)
      }
    } 
  }, [isAddMode, purchaseOrderId, sanityCheckInspectionData?.data, draftData?.data?.purchase_order_id])

  // Handle purchase order change in edit mode - update part details when purchase order changes
  useEffect(() => {
    if (!isAddMode && purchaseOrderId && sanityCheckInspectionData?.data?.[NUMBERMAP.ZERO]?.part_details) {
      // Check if purchase order has changed from the initial loaded data
      const purchaseOrderChanged = initialPurchaseOrderId !== null && initialPurchaseOrderId !== purchaseOrderId
      
      // Load part details if purchase order changed or if tableRows is empty
      if (purchaseOrderChanged || tableRows.length === NUMBERMAP.ZERO) {
        const rowsWithId = sanityCheckInspectionData.data[NUMBERMAP.ZERO].part_details.map((row, index) => ({
          ...row,
          goods_inward_detail_id: 'create_' + (index + NUMBERMAP.ONE),
        }))
        
        setTableRows(rowsWithId)
      }
    }
  }, [isAddMode, purchaseOrderId, sanityCheckInspectionData?.data, formData, initialPurchaseOrderId])

  const columns = [
    ...GOODS_INWARD_DETAILS_COLUMNS_BASE.map((col) => {
      if (col.field === TABLE_FIELD_NAMES.ORDER_QUANTITY) {
        return {
          ...col,
          field: TABLE_FIELD_NAMES.PO_QUANTITY,
        }
      }
      return col
    }),
    {
      field: TABLE_FIELD_NAMES.SANITY_INSPECTION_STATUS,
      headerName: TABLE_COLUMN_LABELS.SANITY_INSPECTION_STATUS,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params) => {
        const goodsStatus = params.row.sanity_inspection_status
        if( goodsStatus === null){
          return '-'
      }else {
        return goodsStatus
      }
    }
    },
    {
      field: TABLE_FIELD_NAMES.RECEIVED_QUANTITY,
      headerName: TABLE_COLUMN_LABELS.RECEIVED_QUANTITY,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params) => {
        return (
          <Box  
           sx={GRID_STYLES.CELL_ALIGNMENT}
            onKeyDown={(e) => e.stopPropagation()}
            >
            <InputField
              label={FORM_LABELS.RECEIVED_QUANTITY}
              placeholder={FORM_PLACEHOLDERS.RECEIVED_QUANTITY}
              value={
                String(params.row[TABLE_FIELD_NAMES.RECEIVED_QUANTITY] ?? '')
              }             
              onChange={(val) =>
                handleReceivedQuantityChange(params.row.goods_inward_detail_id, val)
              }
            />
          </Box>
        )
      },
    },
  ]

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: GoodsInwardFormErrors = {}

    // Validate Vendor Type
    if (!formData.vendor_type_id || formData.vendor_type_id.trim() === '') {
      newErrors.vendor_type_id = VALIDATION_MESSAGES.VENDOR_TYPE_REQUIRED
    }

    // Validate Vendor Name
    if (!formData.vendor_id || formData.vendor_id.trim() === '') {
      newErrors.vendor_id = VALIDATION_MESSAGES.VENDOR_NAME_REQUIRED
    }

    // Validate Purchase Order Number
    if (
      !formData.purchase_order_id ||
      formData.purchase_order_id.trim() === ''
    ) {
      newErrors.purchase_order_id =
        VALIDATION_MESSAGES.PURCHASE_ORDER_NUMBER_REQUIRED
    }

    // Validate Received Date
    if (!formData.received_date) {
      newErrors.received_date = VALIDATION_MESSAGES.RECEIVED_DATE_REQUIRED
    }

    if (!formData.status) {
      newErrors.status = VALIDATION_MESSAGES.STATUS_REQUIRED
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleDraftSave = (dataToSave: any, goodsInwardDetailsToSave?: any[]) => {
    let receivedDateISO = dataToSave.received_date
    if (dataToSave.received_date) {
      if (dayjs.isDayjs(dataToSave.received_date)) {
        // If it's a dayjs object, convert to ISO
        receivedDateISO = convertMuiDayjsToUTC(dataToSave.received_date) ?? ''
      } else if (typeof dataToSave.received_date === 'string') {
        // If it's a string, check if it's already in ISO format
        if (dataToSave.received_date.includes('T') || dataToSave.received_date.endsWith('Z')) {
          // Already in ISO format - keep as is
          receivedDateISO = dataToSave.received_date
        } else {
          // Organization format - parse and convert to ISO using convertMuiDayjsToUTC
          const parsedDate = dayjs(dataToSave.received_date, orgDateFormat)
          if (parsedDate.isValid()) {
            receivedDateISO = convertMuiDayjsToUTC(parsedDate) ?? ''
          }
        }
      }
    }
    
    // Only include necessary fields in draft payload, exclude API response fields like status_id, status_name, etc.
    const payload = {
      id: goodsInwardDraftId ?? new Date().getTime(),
      vendor_type_id: dataToSave.vendor_type_id ?? '',
      vendor_id: dataToSave.vendor_id ?? '',
      purchase_order_id: dataToSave.purchase_order_id ?? '',
      received_date: receivedDateISO,
      status: dataToSave.status ?? '',
      goods_inward_details: goodsInwardDetailsToSave ?? tableRows ?? [],
      type: 'draft',
    }
    draftSave({
      form_data: payload,
      upload_documents: {},
      timestamp: new Date().toISOString(),
    });
  };

const handleInputChange = (
    field: keyof GoodsInwardFormData,
    value: string | number
  ) => {
    setFormData((prev: GoodsInwardFormData) => {
      const newData = { ...prev, [field]: value }
      let goodsInwardDetailsToSave: any[] | undefined = undefined

      // Clear error for the field when user starts typing
      if (field in errors && errors[field]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors }
          if (field in newErrors) {
            delete newErrors[field]
          }
          return newErrors
        })
      }

      // Reset dependent fields when parent field changes
      if (field === FORM_FIELD_NAMES.VENDOR_TYPE) {
        newData.vendor_id = ''
        newData.purchase_order_id = ''
        goodsInwardDetailsToSave = []
        setTableRows([])
      } else if (field === FORM_FIELD_NAMES.VENDOR_NAME) {
        newData.purchase_order_id = ''
        goodsInwardDetailsToSave = []
        setTableRows([])
      } else if (field === FORM_FIELD_NAMES.PURCHASE_ORDER_NUMBER) {
        if (isAddMode) {
          newData.goods_inward_details = []
        }
        // Clear table rows when purchase order number changes (removed or changed)
        if (!value || value === '' || prev.purchase_order_id !== value) {
          goodsInwardDetailsToSave = []
          setTableRows([])
        }
      }

      handleDraftSave(newData, goodsInwardDetailsToSave);
      return newData
    })
  }

  // Prepare payload for API
  const preparePayload = (): GoodsInwardUpsertPayload => {
    
    const payload: GoodsInwardUpsertPayload = {
      purchase_order_id:
        Number(formData.purchase_order_id) || NUMBERMAP.ZERO,
      received_date: formData.received_date
        ? convertMuiDayjsToUTC(dayjs(formData.received_date, orgDateFormat)) ?? ''
        : '',
      status_id: Number(formData.status) || NUMBERMAP.ONE,
      goods_inward_details: tableRows
        .map((r) => ({
          ...(r?.goods_inward_detail_id?.toString()?.split("_")[NUMBERMAP.ZERO]!='create'?{goods_inward_details_id: r.goods_inward_detail_id}:{}),
          received_quantity: Number(r.received_quantity) || '',
          sanity_check_inspection_id: Number(
            r.sanity_check_inspection_id ?? 
            NUMBERMAP.ZERO
          ) || NUMBERMAP.ZERO,
        })),
    }

    // Add goods_inward_id for updates (mandatory for update, optional for insert)
    if (!isAddMode && goodsInwardId) {
      payload.goods_inward_id = goodsInwardId
    }

    return payload
  }

  const handleSave = () => {
    // Validate form before saving
    if (!validateForm()) {
      return
    }
    clearDraftSave();
    const payload = preparePayload()

    upsertMutation.mutate(payload, {
     onSuccess: () => {
        showActionAlert(SUCCESS_ALERT);
        router.push(GOODS_INWARD_CONSTANTS.PATH)
      },
      onError: () => {
        showActionAlert(FAILED_ALERT)
      },
    })
  }

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave();
    router.push(GOODS_INWARD_CONSTANTS.PATH);
  }

  const handleReceivedQuantityChange = (
    rowId: number | string,
    value: string 
  ) => {
      setTableRows((prev) => {
        if(numberValidation.test(value)  || value === ''){
        
        const updated = prev.map((r) =>
          (r.goods_inward_detail_id == rowId  )
            ? {
                ...r,
                [TABLE_FIELD_NAMES.RECEIVED_QUANTITY]: value,
              }
            : r
        );
        handleDraftSave(formData, updated);
        return updated;
      }
      return prev; 
      })
  }
  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <GlobalLoader loading={isLoading ?? upsertMutation.isPending ?? isFetchingDraft} />
        <Label title={PAGE_TITLES.LIST} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.VENDOR_TYPE}
                placeholder={FORM_PLACEHOLDERS.VENDOR_TYPE}
                isDropdown
                options={vendorTypesData?.data ?? []}
                value={formData.vendor_type_id}
                onChange={(value) => {
                  handleInputChange(FORM_FIELD_NAMES.VENDOR_TYPE, value)
                  setVendorTypeId(value)
                }}
                error={errors.vendor_type_id ?? ''}
                disabled={!isAddMode}
                keyField={DROPDOWN_FIELD_CONFIG.VENDOR_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELD_CONFIG.VENDOR_TYPE.VALUE_FIELD}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.VENDOR_NAME}
                placeholder={FORM_PLACEHOLDERS.VENDOR_NAME}
                isDropdown
                options={vendorListData?.data ?? []}
                value={formData.vendor_id}
                onChange={(value) =>
                  handleInputChange(FORM_FIELD_NAMES.VENDOR_NAME, value)
                }
                error={errors.vendor_id ?? ''}
                disabled={!isAddMode || (!formData.vendor_type_id && !errors.vendor_id)}
                keyField={DROPDOWN_FIELD_CONFIG.VENDOR_NAME.KEY_FIELD}
                valueField={DROPDOWN_FIELD_CONFIG.VENDOR_NAME.VALUE_FIELD}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PURCHASE_ORDER_NUMBER}
                placeholder={FORM_PLACEHOLDERS.PURCHASE_ORDER_NUMBER}
                isDropdown
                options={purchaseOrdersData?.data ?? []}
                value={formData.purchase_order_id}
                onChange={(value) =>
                  handleInputChange(
                    FORM_FIELD_NAMES.PURCHASE_ORDER_NUMBER,
                    value
                  )
                }
                error={errors.purchase_order_id ?? ''}
                disabled={
                  !isAddMode ||
                  ((!formData.vendor_type_id || !formData.vendor_id) &&
                  !errors.purchase_order_id)
                }
                keyField={DROPDOWN_FIELD_CONFIG.PURCHASE_ORDER_NUMBER.KEY_FIELD}
                valueField={
                  DROPDOWN_FIELD_CONFIG.PURCHASE_ORDER_NUMBER.VALUE_FIELD
                }
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <DatePicker
                label={FORM_LABELS.RECEIVED_DATE}
                value={
                  formData.received_date &&
                  dayjs(formData.received_date, orgDateFormat).isValid()
                    ? dayjs(formData.received_date, orgDateFormat)
                    : null
                }
                onChange={(val) => {
                  // Format to organization date format when date is selected
                  if (val) {
                    // Clear error if date is valid
                    if (errors.received_date) {
                      setErrors((prev) => {
                        const newErrors = { ...prev }
                        delete newErrors.received_date
                        return newErrors
                      })
                    }
                    // Convert dayjs object to organization format string for formData
                    const formattedDate = val.isValid() ? val.format(orgDateFormat) : ''
                    handleInputChange(
                      FORM_FIELD_NAMES.RECEIVED_DATE,
                      formattedDate
                    )
                  }
                }}
                maxDate={dayjs()} // Disable future dates
                error={errors.received_date ?? ''}
                readOnly={true}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.STATUS}
                isDropdown
                options={statusData?.data ?? []}
                value={formData.status?.toString() ?? ''}
                onChange={(value) =>
                  handleInputChange(FORM_FIELD_NAMES.STATUS, value)
                }
                keyField={DROPDOWN_FIELD_CONFIG.STATUS.KEY_FIELD}
                valueField={DROPDOWN_FIELD_CONFIG.STATUS.VALUE_FIELD}
                error={errors.status ?? ''}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>{/* Empty grid for layout */}</Grid2>
          </Grid2>
        </FormContent>
        <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Label title={PAGE_TITLES.PART_DETAILS} />
            <DataTable
            rows={tableRows ?? []}
            columns={columns}
            IdField={ID_PART_DETAILS_FIELDS}
            loading={isLoadingPartDetails}
          />
          </Grid2>
        </Grid2>
        <FormContent>
        <ButtonGroup
          buttons={[
            {
              label: BUTTON_LABEL.CANCEL,
              onClick: handleCancel,
              disabled: upsertMutation.isPending,
            },
            {
              label: BUTTON_LABEL.SAVE,
              onClick: handleSave,
              disabled: upsertMutation.isPending,
            },
          ]}
        />
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default PurchaseGoodsInwardForm
