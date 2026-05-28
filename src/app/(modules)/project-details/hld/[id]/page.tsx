'use client'
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  Suspense,
} from 'react'
import { Box, Grid2 } from '@mui/material'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'

import { InputField, ButtonGroup, RichTextEditor, MultiSelect } from '@/components/ui'
import { COMMON_CONSTANTS, mergeFinalFileData, numberValidation, processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {
  SectionHeader,
  CompetitiveLandscapeForm,
  ConversionRateForm,
  SolutionRequirementsForm,
  MarketSegmentDataGrid,
  DemographyDataGrid,
  RegionDataGrid,
  CompetitiveLandscapeDataGrid,
  SolutionRequirementsDataGrid,
  ConversionRateDataGrid,
} from '@/components/modules/dnd/hld'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import {
  MarketSegmentRow,
  CompetitiveLandscapeRow,
  SolutionRequirementsRow,
  ConversionRateRow,
  HldInfo,
  HldMarket,
  DemographyRowData,
  DemographySelectionOutput,
  InputDesignFormData,
  ModalStates,
  EditingStates,
  UploadedFileData,
  DocumentStructure,
} from '@/types/modules/dnd/hld'
import {
  FIELD_LABELS,
  FIELD_PLACEHOLDERS,
  ERROR_MESSAGES,
  SECTION_TITLES,
  MODAL_TITLES,
  API_FIELD_KEYS,
  ALERT_MESSAGES,
  PERCENTAGE,
  FIELD_KEYS,
  FIELD_VALUES,
  MENU_NAME,
  FIELD_ORDER,
  FIELD_IDS,
} from '@/constants/modules/dnd/hld'
import {
  MainContainer,
  ContentContainer,
  HLDContainer,
  HLDTitle,
  FormSection,
  FormRow,
  RegionTitle,
  TableContainer,
  MarketSizeContainer,
  FileUploadContainer,
  FileUploadBox,
  SectionBox
} from '@/styles/modules/dnd/hld'

import {
  INITIAL_FORM_DATA,
  INITIAL_FORM_ERRORS,
  transformMarketDemographyData,
  generateDemographySelections,
  applySelections,
} from '@/lib/modules/dnd/hld'
import { useParams, useRouter } from 'next/navigation'
import {
  useProjectDetailHLDInfo,
  useProjectDetailHLDMarket,
  useProjectDetailHLDMarketDemography,
  useSaveProjectHLD,
} from '@/hooks/modules/dnd/useHLD'
// Import market and regulation hooks from project
import {
  useGetMarketList,
  useGetRegulationList,
} from '@/hooks/modules/dnd/useProject'
import { BUTTON_LABEL, FINALFILEINITIALDATA, getButtonConfig, NUMBERMAP, STATUS } from '@/constants/common'
import { DesignInputRow } from '@/types/modules/dnd/dig'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import { useDebounce } from '@/lib/modules/dnd/project'
import ReviewerModal from '@/components/modules/dnd/reviewer-modal/ReviewerModal'
import { useSubmitReview } from '@/hooks/modules/dnd/useCommonReviewModal'
import { PROJECT_INFO_SCREEN_URL } from '@/lib/modules/dnd/projectScreen'
import { MARGINTOP2 } from '@/styles/modules/hr/healthDeclaration'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import CommentsHistory from '@/components/ui/comments-history/Comments'

/**
 Classification : Confidential
**/
const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS
const {
  CUSTOM_ALERT,
  COMPETITIVE_PRODUCTS,
  PRODUCT_NAME,
  INTENDED_USE,
  APPLICATIONS,
  MARKET_SCENARIO,
  SPECIAL_CATEGORY,
  MARKET_SIZE,
  TARGET_GEOGRAPHY,
  TARGET_SEGMENT,
  TARGET_AUDIENCE,
  INITIAL_SUCCESS_FACTOR,
  GROWTH_SUSTAINING_FACTOR,
  STRATEGIC_MARKETING,
  DEMAND_GENERATIONS,
  POTENTIAL_RISK,
} = FIELD_KEYS


const InputDesign: React.FC = () => {
  const params = useParams()
  const projectId = params.id
  const router = useRouter()

  const [isReviewerModal, setIsReviewerModal] = useState(false)
  const [buttonId, setButtonId] = useState<number | null>(null)
  const [buttonName, setButtonName] = useState<string | null>(null)

  const { data: projectDetailHLDInfo, isError: projectDetailHLDInfoError, isLoading: isDataLoading, isFetching: isProjectDataFetching } =
    useProjectDetailHLDInfo(Number(projectId))
  const { data: projectDetailHLDMarket, isFetching: isMarketFetching } = useProjectDetailHLDMarket()
  const { data: projectDetailHLDMarketDemography, isFetching: isDemographyFetching } =
    useProjectDetailHLDMarketDemography()
  const { mutate: saveProjectHLD, isPending: isSavePending } = useSaveProjectHLD()
  const { mutate: saveReview, isPending: isReviewPending } = useSubmitReview("HLD")


  const [finalFileData, setFinalFileData] =
    useState<DocumentStructure>(FINALFILEINITIALDATA)
  const [formData, setFormData] = useState<InputDesignFormData>({
    ...INITIAL_FORM_DATA,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    ...INITIAL_FORM_ERRORS,
  })
  const [isDisabled, setIsDisabled] = useState(false)
  const [modalStates, setModalStates] = useState<ModalStates>({
    competitiveLandscapeModalOpen: false,
    solutionRequirementsModalOpen: false,
    conversionRateModalOpen: false,
  })
  const [editingStates, setEditingStates] = useState<EditingStates>({
    editingCompetitiveLandscapeRow: null,
    editingSolutionRequirementsRow: null,
    editingConversionRateRow: null,
  })

  const debouncedMarket = useDebounce(formData.markets ?? [], NUMBERMAP.FIVEHUNDRED)

  // Field label mapping for validation focus
  const FIELD_LABEL_MAP = {
    productName: FIELD_LABELS.PRODUCT_NAME,
    intendedUse: FIELD_LABELS.INTENDED_USE,
    applications: FIELD_LABELS.APPLICATIONS,
    marketScenario: FIELD_LABELS.MARKET_SCENARIO,
    competitiveProducts: FIELD_IDS.COMPETITIVE_PRODUCTS,
    targetGeography: FIELD_LABELS.TARGET_GEOGRAPHY,
    targetSegment: FIELD_LABELS.TARGET_SEGMENT,
    targetAudience: FIELD_LABELS.TARGET_AUDIENCE,
    markets: FIELD_LABELS.MARKET,
    regulations: FIELD_LABELS.REGULATIONS,
  }

  // market and regulation hooks
  const { data: marketList, refetch: productMarketRefetch, isFetching: isMarketListFetching } = useGetMarketList()
  const { data: regulationsList, isFetching: isRegulationListFetching } = useGetRegulationList(
    debouncedMarket.length > NUMBERMAP.ZERO ? debouncedMarket : []
  )

  // Get permissions and calculate hasEditPermission early
  const permissions = projectDetailHLDInfo?.meta_info?.action_control?.permissions ?? []
  const { hasEditPermission } = processButtonsWithPermissions(permissions, {})

  const competitiveLandscapeFormRef = useRef<CompetitiveLandscapeRow>(null)
  const solutionRequirementsFormRef = useRef<SolutionRequirementsRow>(null)
  const conversionRateFormRef = useRef<ConversionRateRow>(null)

  useEffect(() => {
    if (projectDetailHLDInfoError) {
      showActionAlert(STATUS.FAILED)
    }
  }, [projectDetailHLDInfoError])

  // market data
  useEffect(() => {
    productMarketRefetch()
  }, [productMarketRefetch])

  // regulation
  useEffect(() => {
    if (!formData.markets?.length && formData.regulations?.length) {
      setFormData((prev) => ({ ...prev, regulations: [] }))
      setErrors((prev) => ({ ...prev, regulations: '' }))
    }
  }, [formData.markets])

  const mergeAndTransformMarketSegmentData = useCallback(
    (hldInfo: HldInfo, hldMarket: HldMarket[]) => {
      if (
        !hldInfo.market_segment ||
        hldInfo.market_segment.length === EMPTY_ARRAY_LENGTH
      ) {
        return hldMarket.map((market) => ({
          id: market.market_segment_id,
          segment_id: market.market_segment_id,
          segment: market.market_segment,
          percentage_of_use: '',
          is_applicable: NUMBERMAP.ZERO,
        }))
      }

      return hldMarket.map((market) => {
        const segmentInfo = hldInfo.market_segment.find(
          (seg) => seg.segment_id === market.market_segment_id
        )

        return {
          id: market.market_segment_id,
          segment_id: market.market_segment_id,
          segment: market.market_segment,
          percentage_of_use: segmentInfo ? segmentInfo.percentage_of_use : '',
          is_applicable: segmentInfo ? segmentInfo.is_applicable : NUMBERMAP.ZERO,
        }
      })
    },
    []
  )

  useEffect(() => {
    const projectDetails = projectDetailHLDInfo?.data?.[NUMBERMAP.ZERO] ?? {}
    const projectDetailHldMarket = projectDetailHLDMarket?.data ?? []

    const marketResult = mergeAndTransformMarketSegmentData(
      projectDetails,
      projectDetailHldMarket
    )

    const competitiveLandscape = projectDetails.competitive_landscape ?? []
    const updatedCompetitiveLandscapeList = competitiveLandscape.map(
      (item: CompetitiveLandscapeRow, index: number) => ({
        ...item,
        id: index + NUMBERMAP.ONE,
      })
    )

    const designRequirements = projectDetails.design_requirements ?? []
    const updatedDesignRequirementList = designRequirements.map(
      (item: DesignInputRow, index: number) => ({
        ...item,
        id: index + NUMBERMAP.ONE,
      })
    )

    const conversionRate = projectDetails.conversion_rate ?? []
    const updatedConversionRateList = conversionRate.map(
      (item: ConversionRateRow, index: number) => ({
        ...item,
        id: index + NUMBERMAP.ONE,
      })
    )

    setFormData((prev) => ({
      ...prev,
      productName: projectDetails.product_generic_name ?? '',
      intendedUse: projectDetails.product_intended_use ?? '',
      applications: projectDetails.product_application ?? '',
      marketScenario: projectDetails.market_scenario ?? '',
      competitiveProducts: projectDetails.competitive_products ?? '',
      marketSize: projectDetails.market_size ?? '',
      targetGeography: projectDetails.target_geography ?? '',
      targetSegment: projectDetails.target_segment ?? '',
      targetAudience: projectDetails.target_audience ?? '',
      initialSuccessFactor: projectDetails.initial_success_factors ?? '',
      growthSustainingFactor: projectDetails.growth_sustaining_factors ?? '',
      strategicMarketing: projectDetails.strategic_marketing_requirements ?? '',
      demandGenerations: projectDetails.demand_generation_plan ?? '',
      potentialRisk: projectDetails.potential_business_risks ?? '',
      uploadedFile: projectDetails.documents ?? [],
      marketSegmentRows: marketResult,
      competitiveLandscapeRows: updatedCompetitiveLandscapeList,
      solutionRequirementsRows: updatedDesignRequirementList,
      conversionRateRows: updatedConversionRateList,
      // market and regulations
      markets: Array.isArray(projectDetails.markets) ? projectDetails.markets : [],
      regulations: Array.isArray(projectDetails.regulations) ? projectDetails.regulations : [],
    }))
  }, [
    projectDetailHLDInfo?.data?.[NUMBERMAP.ZERO],
    projectDetailHLDMarket?.data,
    mergeAndTransformMarketSegmentData,
  ])

  useEffect(() => {
    const marketDemographyData = projectDetailHLDMarketDemography?.data ?? []
    const marketDemographySelections =
      projectDetailHLDInfo?.data?.[NUMBERMAP.ZERO]?.market_demography ?? []

    const {
      demographyRows: transformedDemographyRows,
      regionRows: transformedRegionRows,
    } = transformMarketDemographyData(marketDemographyData)

    const demographyRowsWithId = transformedDemographyRows.map((row) => ({
      ...row,
      id: row.id,
    }))

    const regionRowsWithId = transformedRegionRows.map((row) => ({
      ...row,
      id: row.id,
    }))

    const { updatedDemographyRows, updatedRegionRows, updatedSpecialCategory } =
      applySelections(
        demographyRowsWithId,
        regionRowsWithId,
        marketDemographySelections
      )

    setFormData((prev) => ({
      ...prev,
      demographyRows: updatedDemographyRows,
      regionRows: updatedRegionRows,
      specialCategory: updatedSpecialCategory ?? '',
    }))
  }, [
    projectDetailHLDInfo?.data?.[NUMBERMAP.ZERO]?.market_demography,
    projectDetailHLDMarketDemography?.data,
  ])

  const validateMarketSegment = (
    marketSegmentRows: MarketSegmentRow[]
  ): boolean => {

    const filteredRows = marketSegmentRows.filter((row) => {
      const percentage = Number(row.percentage_of_use)
      return percentage > NUMBERMAP.ZERO && row.is_applicable === NUMBERMAP.ONE
    })

    const totalPercentage = filteredRows.reduce((sum, row) => {
      const percentage = Number(row.percentage_of_use)
      return sum + percentage
    }, 0)

    return totalPercentage === PERCENTAGE
  }

  // Individual field validation functions
  const validateRequiredTextField = (
    value: string,
    errorMessage: string
  ): string => {
    return value.trim() ? '' : errorMessage
  }

  const validateRequiredArrayField = (
    value: (string | number)[] | undefined,
    errorMessage: string
  ): string => {
    return value && value.length > NUMBERMAP.ZERO ? '' : errorMessage
  }

  const validateMarketRegulationConsistency = (
    markets: (string | number)[] | undefined,
    regulations: (string | number)[] | undefined
  ): string => {
    if (!markets || !regulations) return ''
    
    return markets.length !== regulations.length
      ? ERROR_MESSAGES.MARKET_REGULATION_CONSISTENCY
      : ''
  }

  // Main validation function with reduced cognitive complexity
  const validateForm = useCallback(() => {
    const newErrors = { ...INITIAL_FORM_ERRORS }
    let isValid = true

    // Validate required text fields
    const textFieldValidations = [
      { field: FIELD_KEYS.PRODUCT_NAME, value: formData.productName, message: ERROR_MESSAGES.PRODUCT_NAME },
      { field: FIELD_KEYS.INTENDED_USE, value: formData.intendedUse, message: ERROR_MESSAGES.INTENDED_USE },
      { field: FIELD_KEYS.APPLICATIONS, value: formData.applications, message: ERROR_MESSAGES.APPLICATIONS },
      { field: FIELD_KEYS.MARKET_SCENARIO, value: formData.marketScenario, message: ERROR_MESSAGES.MARKET_SCENARIO },
      { field: FIELD_KEYS.COMPETITIVE_PRODUCTS, value: formData.competitiveProducts, message: ERROR_MESSAGES.COMPETITIVE_PRODUCTS },
      { field: FIELD_KEYS.TARGET_GEOGRAPHY, value: formData.targetGeography, message: ERROR_MESSAGES.TARGET_GEOGRAPHY },
      { field: FIELD_KEYS.TARGET_SEGMENT, value: formData.targetSegment, message: ERROR_MESSAGES.TARGET_SEGMENT },
      { field: FIELD_KEYS.TARGET_AUDIENCE, value: formData.targetAudience, message: ERROR_MESSAGES.TARGET_AUDIENCE },
    ]

    textFieldValidations.forEach(({ field, value, message }) => {
      const error = validateRequiredTextField(value, message)
      if (error) {
        newErrors[field as keyof typeof newErrors] = error
      isValid = false
    }
    })

    // Validate required array fields
    const arrayFieldValidations = [
      { field: 'markets', value: formData.markets, message: ERROR_MESSAGES.MARKET },
      { field: 'regulations', value: formData.regulations, message: ERROR_MESSAGES.REGULATIONS },
    ]

    arrayFieldValidations.forEach(({ field, value, message }) => {
      const error = validateRequiredArrayField(value, message)
      if (error) {
        newErrors[field as keyof typeof newErrors] = error
      isValid = false
    }
    })

    // Validate market-regulation consistency
    const marketRegulationError = validateMarketRegulationConsistency(
      formData.markets,
      formData.regulations
    )
    if (marketRegulationError) {
      newErrors.regulations = marketRegulationError
      isValid = false
    }

    setErrors(newErrors)

    // Validate market segment if all mandatory fields are valid
    if (isValid && !validateMarketSegment(formData.marketSegmentRows)) {
      showActionAlert(CUSTOM_ALERT, ALERT_MESSAGES.MARKET_SEGMENT_ERROR)
      isValid = false
    }

    // Handle focus management
    const hasValidationErrors = !isValid
    const focusResult = hasValidationErrors
      ? validateAndFocusFirstEmptyField(formData, FIELD_ORDER, FIELD_LABEL_MAP)
      : true

    return isValid && focusResult
  }, [formData, validateMarketSegment])

   const updateFormData = useCallback(
    (field: keyof InputDesignFormData, value: string | (string | number)[]) => {
      if(!hasEditPermission) return
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }))
      }
    },
    [errors, hasEditPermission]
  )

  // Handle market change with regulation  logic
 const handleMarketChange = useCallback(
  (value: (string | number)[]) => {
      if(!hasEditPermission) return
    const newMarkets: (string | number)[] = value
    const oldMarkets: (string | number)[] = formData.markets ?? []
    const removedMarkets = oldMarkets.filter((m) => !newMarkets.includes(m))

    setFormData((prev) => {
      let newRegulations = prev.regulations ?? []
      if (removedMarkets.length > NUMBERMAP.ZERO) {
        newRegulations = (prev.regulations ?? []).filter(
          (regId): regId is string => !removedMarkets.includes(regId)
        )
      }
      return {
        ...prev,
        markets: newMarkets as string[] | number[],
        regulations: newRegulations as string[] | number[],
      }
    })

    // Fix: Change 'market' to 'markets' to match the error field name
    setErrors((prev) => ({ ...prev, markets: '', regulations: '' }))
  },
  [formData.markets, hasEditPermission]
)

// Handle regulation change
const handleRegulationChange = useCallback(
  (value: (string | number)[]) => {
      if(!hasEditPermission) return
    const newRegulations: (string | number)[] = value

    setFormData((prev) => ({
      ...prev,
      regulations: newRegulations as string[] | number[],
    }))

    setErrors((prev) => ({ ...prev, regulations: '' }))
  },
  [hasEditPermission]
)
  const handleMarketSegmentRowChange = useCallback((row: MarketSegmentRow) => {
      if(!hasEditPermission) return
    const percentage = row.percentage_of_use?.toString()
    if(percentage === '' || numberValidation.test(percentage) ){
    setFormData((prev) => ({
      ...prev,
      marketSegmentRows: prev.marketSegmentRows.map((r) =>
        r.segment_id === row.segment_id ? row : r
      ),
    }))}
  }, [hasEditPermission])

  const handleDemographyOptionChange = useCallback(
    (rowId: string, optionId: string, checked: boolean) => {
      if(!hasEditPermission) return
      setFormData((prev) => ({
        ...prev,
        demographyRows: prev.demographyRows.map((row) =>
          row.id === rowId ? updateRowOptions(row, optionId, checked) : row
        ),
      }))
    },
    [hasEditPermission]
  )

  const updateRowOptions = useCallback(
    (row: DemographyRowData, optionId: string, checked: boolean) => {
      return {
        ...row,
        options: row.options.map((option) =>
          option.id === optionId ? { ...option, checked } : option
        ),
      }
    },
    []
  )

  const handleRegionRowChange = useCallback(
    (rowId: string, selected: boolean) => {
      if(!hasEditPermission) return
      setFormData((prev) => ({
        ...prev,
        regionRows: prev.regionRows.map((row) =>
          row.id === rowId ? { ...row, selected } : row
        ),
      }))
    },
    [hasEditPermission]
  )

  const getCurrentSelections = useCallback((): DemographySelectionOutput[] => {
    return generateDemographySelections(
      formData.demographyRows,
      formData.regionRows,
      formData.specialCategory
    )
  }, [formData.demographyRows, formData.regionRows, formData.specialCategory])

  const handleAddCompetitiveLandscapeRow = useCallback(() => {
    setEditingStates((prev) => ({
      ...prev,
      editingCompetitiveLandscapeRow: null,
    }))
    setModalStates((prev) => ({
      ...prev,
      competitiveLandscapeModalOpen: true,
    }))
  }, [])

  const handleEditCompetitiveLandscapeRow = useCallback(
    (row: CompetitiveLandscapeRow) => {
      setEditingStates((prev) => ({
        ...prev,
        editingCompetitiveLandscapeRow: row,
      }))
      setModalStates((prev) => ({
        ...prev,
        competitiveLandscapeModalOpen: true,
      }))
    },
    []
  )

  const handleDeleteCompetitiveLandscapeRow = useCallback(
    async (id: string) => {
      const isDelete = await showActionAlert(STATUS.DELETE)
      if (isDelete.isConfirmed) {
        setFormData((prev) => ({
          ...prev,
          competitiveLandscapeRows: prev.competitiveLandscapeRows.filter(
            (row) => row.id != id
          ),
        }))
      }
    },
    []
  )
  const handleSaveCompetitiveLandscapeRow = useCallback(
    (data: CompetitiveLandscapeRow) => {
      const trimmedData = { ...data }

      ;(Object.keys(trimmedData) as (keyof typeof trimmedData)[]).forEach(
        (key) => {
          if (typeof trimmedData[key] === 'string') {
            trimmedData[key] = trimmedData[key].trim()
          }
        }
      )

      setFormData((prev) => {
        if (editingStates.editingCompetitiveLandscapeRow) {
          return {
            ...prev,
            competitiveLandscapeRows: prev.competitiveLandscapeRows.map(
              (row) =>
                row.id === editingStates.editingCompetitiveLandscapeRow?.id
                  ? { ...trimmedData, id: row.id }
                  : row
            ),
          }
        } else {
          const newId = (prev.competitiveLandscapeRows.length + NUMBERMAP.ONE).toString()
          return {
            ...prev,
            competitiveLandscapeRows: [
              ...prev.competitiveLandscapeRows,
              { ...trimmedData, id: newId },
            ],
          }
        }
      })

      setModalStates((prev) => ({
        ...prev,
        competitiveLandscapeModalOpen: false,
      }))
    },
    [editingStates.editingCompetitiveLandscapeRow]
  )

  const handleAddSolutionRequirementsRow = useCallback(() => {
    setEditingStates((prev) => ({
      ...prev,
      editingSolutionRequirementsRow: null,
    }))
    setModalStates((prev) => ({
      ...prev,
      solutionRequirementsModalOpen: true,
    }))
  }, [])

  const handleEditSolutionRequirementsRow = useCallback(
    (row: SolutionRequirementsRow) => {
      setEditingStates((prev) => ({
        ...prev,
        editingSolutionRequirementsRow: row,
      }))
      setModalStates((prev) => ({
        ...prev,
        solutionRequirementsModalOpen: true,
      }))
    },
    []
  )

  const handleDeleteSolutionRequirementsRow = useCallback(
    async (id: string) => {
      const isDelete = await showActionAlert(STATUS.DELETE)
      if (isDelete.isConfirmed) {
        setFormData((prev) => ({
          ...prev,
          solutionRequirementsRows: prev.solutionRequirementsRows.filter(
            (row) => row.id != id
          ),
        }))
      }
    },
    []
  )
  const handleSaveSolutionRequirementsRow = useCallback(
    (data: SolutionRequirementsRow) => {
      const trimmedData = { ...data }

      ;(Object.keys(trimmedData) as (keyof typeof trimmedData)[]).forEach(
        (key) => {
          if (typeof trimmedData[key] === 'string') {
            trimmedData[key] = trimmedData[key].trim()
          }
        }
      )

      setFormData((prev) => {
        if (editingStates.editingSolutionRequirementsRow) {
          return {
            ...prev,
            solutionRequirementsRows: prev.solutionRequirementsRows.map(
              (row) =>
                row.id === editingStates.editingSolutionRequirementsRow?.id
                  ? { ...trimmedData, id: row.id }
                  : row
            ),
          }
        } else {
          const newId = (prev.solutionRequirementsRows.length + NUMBERMAP.ONE).toString()
          return {
            ...prev,
            solutionRequirementsRows: [
              ...prev.solutionRequirementsRows,
              { ...trimmedData, id: newId },
            ],
          }
        }
      })

      setModalStates((prev) => ({
        ...prev,
        solutionRequirementsModalOpen: false,
      }))
    },
    [editingStates.editingSolutionRequirementsRow]
  )

  const handleAddConversionRateRow = useCallback(() => {
    setEditingStates((prev) => ({
      ...prev,
      editingConversionRateRow: null,
    }))
    setModalStates((prev) => ({
      ...prev,
      conversionRateModalOpen: true,
    }))
  }, [])

  const handleEditConversionRateRow = useCallback((row: ConversionRateRow) => {
    setEditingStates((prev) => ({
      ...prev,
      editingConversionRateRow: row,
    }))
    setModalStates((prev) => ({
      ...prev,
      conversionRateModalOpen: true,
    }))
  }, [])

  const handleDeleteConversionRateRow = useCallback(async (id: string) => {
    const isDelete = await showActionAlert(STATUS.DELETE)
    if (isDelete.isConfirmed) {
      setFormData((prev) => ({
        ...prev,
        conversionRateRows: prev.conversionRateRows.filter(
          (row) => row.id != id
        ),
      }))
    }
  }, [])

  const handleSaveConversionRateRow = useCallback(
    (data: ConversionRateRow) => {
      const trimmedData = { ...data }

      ;(Object.keys(trimmedData) as (keyof typeof trimmedData)[]).forEach(
        (key) => {
          if (typeof trimmedData[key] === 'string') {
            trimmedData[key] = trimmedData[key].trim()
          }
        }
      )

      setFormData((prev) => {
        if (editingStates.editingConversionRateRow) {
          return {
            ...prev,
            conversionRateRows: prev.conversionRateRows.map((row) =>
              row.id === editingStates.editingConversionRateRow?.id
                ? { ...trimmedData, id: row.id }
                : row
            ),
          }
        } else {
          const newId = (prev.conversionRateRows.length + NUMBERMAP.ONE).toString()
          return {
            ...prev,
            conversionRateRows: [
              ...prev.conversionRateRows,
              { ...trimmedData, id: newId },
            ],
          }
        }
      })

      setModalStates((prev) => ({
        ...prev,
        conversionRateModalOpen: false,
      }))
    },
    [editingStates.editingConversionRateRow]
  )

  const handleEditorChange = useCallback(
    (data: string) => {
      updateFormData(COMPETITIVE_PRODUCTS, data)
    },
    [updateFormData]
  )

  const handleFileUpload = (newFile: File | FileData2) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFile: [...prev.uploadedFile, newFile] as File[] | FileDocument[],
    }))

    if (errors.uploadedFile) {
      setErrors((prev) => ({
        ...prev,
        uploadedFile: '',
      }))
    }
  }

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      setFormData((prev) => {
        const updatedFiles = prev.uploadedFile.map((file) => {
          const currentId =
            typeof file === 'object'
              ? ((file as File).file_id ?? (file as UploadedFileData).id)
              : undefined
          const updatedId = updatedFile.document_id ?? updatedFile.id

          return currentId === updatedId ? { ...file, ...updatedFile } : file
        })

        return {
          ...prev,
          uploadedFile: updatedFiles,
        }
      })
    },
    []
  )

    const handleSave = () => {
    if (!validateForm()) return

    setIsDisabled(true)

    const selections = getCurrentSelections()
    const createProjectHLDForm = new FormData()

    const fieldsToAppend = {
      [API_FIELD_KEYS.PROJECT_ID]: projectId?.toString(),
      [API_FIELD_KEYS.PRODUCT_GENERIC_NAME]: formData.productName?.trim(),
      [API_FIELD_KEYS.INITIAL_INTENDED_USE]: formData.intendedUse?.trim(),
      [API_FIELD_KEYS.APPLICATIONS_OF_PRODUCT]: formData.applications?.trim(),
      [API_FIELD_KEYS.MARKET_SCENARIO]: formData.marketScenario?.trim(),
      [API_FIELD_KEYS.COMPETITIVE_PRODUCTS]:
        formData.competitiveProducts?.trim(),
        
      [API_FIELD_KEYS.REGULATIONS]: JSON.stringify(formData.regulations),
      [API_FIELD_KEYS.MARKET_SEGMENT]: JSON.stringify(
        formData.marketSegmentRows
      ),
      [API_FIELD_KEYS.MARKET_DEMOGRAPHY]: JSON.stringify(selections),
      [API_FIELD_KEYS.MARKET_SIZE]: formData.marketSize?.trim(),
      [API_FIELD_KEYS.COMPETITIVE_LANDSCAPE]: JSON.stringify(
        formData.competitiveLandscapeRows
      ),
      [API_FIELD_KEYS.DESIGN_REQUIREMENTS]: JSON.stringify(
        formData.solutionRequirementsRows
      ),
      [API_FIELD_KEYS.DESIGN_CONVERSION_RATE]: JSON.stringify(
        formData.conversionRateRows
      ),
      [API_FIELD_KEYS.INITIAL_SUCCESS_FACTOR]:
        formData.initialSuccessFactor?.trim(),
      [API_FIELD_KEYS.GROWTH_SUSTAINING_FACTOR]:
        formData.growthSustainingFactor?.trim(),
      [API_FIELD_KEYS.STRATEGIC_MARKETING_REQUIREMENTS]:
        formData.strategicMarketing?.trim(),
      [API_FIELD_KEYS.DEMAND_GENERATIONS_FOR_NEXT_YEARS]:
        formData.demandGenerations?.trim(),
      [API_FIELD_KEYS.POTENTIAL_BUSINESS_RISK]: formData.potentialRisk?.trim(),
      [API_FIELD_KEYS.TARGET_GEOGRAPHY]: formData.targetGeography?.trim(),
      [API_FIELD_KEYS.TARGET_SEGMENT]: formData.targetSegment?.trim(),
      [API_FIELD_KEYS.TARGET_AUDIENCE]: formData.targetAudience?.trim(),
      [API_FIELD_KEYS.DOCUMENTS_TO_DELETE]: JSON.stringify(
        finalFileData.documents_to_delete ?? []
      ),
      [API_FIELD_KEYS.CREATE_META_DATA]: JSON.stringify(
        finalFileData.create_meta_data ?? []
      ),
      [API_FIELD_KEYS.UPDATE_META_DATA]: JSON.stringify(
        finalFileData.update_meta_data ?? []
      ),
    }
    finalFileData?.documents_to_create?.forEach((fileData) => {
      if (fileData instanceof File) {
        createProjectHLDForm.append(
          API_FIELD_KEYS.DOCUMENTS_TO_CREATE,
          fileData,
          fileData.name
        )
      }
    })

    Object.entries(fieldsToAppend).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        createProjectHLDForm.append(key, value)
      }
    })

    const payload = { formData: createProjectHLDForm }

    saveProjectHLD(payload, {
      onSuccess: () => {
        setIsDisabled(false)
        showActionAlert(STATUS.SUCCESS)
        setFinalFileData(FINALFILEINITIALDATA)
      },
      onError: () => {
        setIsDisabled(false)
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  const handleCancel = () => {
    router.push(PROJECT_INFO_SCREEN_URL)
  }

   const isLoading = () => {
    if (isDataLoading) return true
    if (isProjectDataFetching) return true
    if (isMarketFetching) return true
    if (isDemographyFetching) return true
    if (isMarketListFetching) return true
    if (isRegulationListFetching) return true
    if (isSavePending) return true
    if (isReviewPending) return true
    return false
  }


  const handleCloseCompetitiveLandscapeModal = useCallback(() => {
    setModalStates((prev) => ({
      ...prev,
      competitiveLandscapeModalOpen: false,
    }))
  }, [])

  const handleCloseSolutionRequirementsModal = useCallback(() => {
    setModalStates((prev) => ({
      ...prev,
      solutionRequirementsModalOpen: false,
    }))
  }, [])

  const handleCloseConversionRateModal = useCallback(() => {
    setModalStates((prev) => ({
      ...prev,
      conversionRateModalOpen: false,
    }))
  }, [])

  const handleSaveCompetitiveLandscapeModal = useCallback(() => {
    if (competitiveLandscapeFormRef.current) {
      competitiveLandscapeFormRef.current.handleSubmit()
    }
  }, [])

  const handleSaveSolutionRequirementsModal = useCallback(() => {
    if (solutionRequirementsFormRef.current) {
      solutionRequirementsFormRef.current.handleSubmit()
    }
  }, [])

  const handleSaveConversionRateModal = useCallback(() => {
    if (conversionRateFormRef.current) {
      conversionRateFormRef.current.handleSubmit()
    }
  }, [])



  const basicInfoSection = useMemo(
    () => (
      <>
        <FormRow>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.PRODUCT_NAME}
                placeholder={FIELD_PLACEHOLDERS.PRODUCT_NAME}
                value={formData.productName}
                onChange={(value: string) =>
                  updateFormData(PRODUCT_NAME, value)
                }
                error={errors.productName}
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.INTENDED_USE}
                placeholder={FIELD_PLACEHOLDERS.INTENDED_USE}
                value={formData.intendedUse}
                onChange={(value: string) =>
                  updateFormData(INTENDED_USE, value)
                }
                error={errors.intendedUse}
              />
            </Grid2>
          </Grid2>
        </FormRow>
        <FormRow>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.APPLICATIONS}
                placeholder={FIELD_PLACEHOLDERS.APPLICATIONS}
                value={formData.applications}
                onChange={(value: string) =>
                  updateFormData(APPLICATIONS, value)
                }
                error={errors.applications}
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.MARKET_SCENARIO}
                placeholder={FIELD_PLACEHOLDERS.MARKET_SCENARIO}
                value={formData.marketScenario}
                onChange={(value: string) =>
                  updateFormData(MARKET_SCENARIO, value)
                }
                error={errors.marketScenario}
              />
            </Grid2>
          </Grid2>
        </FormRow>
        
        <FormRow>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <MultiSelect
                label={FIELD_LABELS.MARKET}
                placeholder={FIELD_PLACEHOLDERS.MARKET}
                options={marketList?.data ?? []}
                value={formData.markets ?? []}
                onChange={handleMarketChange}
                error={errors.markets ?? ''}
                idField={FIELD_KEYS.MARKET}
                valueField={FIELD_VALUES.MARKET}
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <MultiSelect
                label={FIELD_LABELS.REGULATIONS}
                placeholder={FIELD_PLACEHOLDERS.REGULATIONS}
                options={
                  formData.markets && formData.markets.length > NUMBERMAP.ZERO
                    ? (regulationsList?.data ?? [])
                    : []
                }
                value={formData.regulations ?? []}
                onChange={handleRegulationChange}
                error={errors.regulations ?? ''}
                disabled={!formData.markets || formData.markets.length === NUMBERMAP.ZERO}
                idField={FIELD_KEYS.REGULATIONS}
                valueField={FIELD_VALUES.REGULATIONS}
              />
            </Grid2>
          </Grid2>
        </FormRow>
        <FormRow>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={FIELD_LABELS.COMPETITIVE_PRODUCTS}
                value={formData.competitiveProducts}
                onChange={handleEditorChange}
                error={errors.competitiveProducts}
                id={FIELD_IDS.COMPETITIVE_PRODUCTS}
                disabled={!hasEditPermission}
                placeholder={FIELD_PLACEHOLDERS.COMPETITIVE_PRODUCTS}
              />
            </Grid2>
          </Grid2>
        </FormRow>
      </>
    ),
    [
      formData.productName,
      formData.intendedUse,
      formData.applications,
      formData.marketScenario,
      formData.markets,
      formData.regulations,
      formData.competitiveProducts,
      errors.productName,
      errors.intendedUse,
      errors.applications,
      errors.marketScenario,
      errors.market,
      errors.regulations,
      errors.competitiveProducts,
      updateFormData,
      handleMarketChange,
      handleRegulationChange,
      handleEditorChange,
      marketList?.data,
      regulationsList?.data,
    ]
  )

  const marketSegmentSection = useMemo(
    () => (
      <SectionBox>
        <SectionHeader title={SECTION_TITLES.MARKET_SEGMENT} />
        <MarketSegmentDataGrid
          rows={formData.marketSegmentRows}
          onRowChange={handleMarketSegmentRowChange}
        />
      </SectionBox>
    ),
    [formData.marketSegmentRows, handleMarketSegmentRowChange]
  )

  const demographySection = useMemo(
    () => (
      <SectionBox>
        <SectionHeader title={SECTION_TITLES.MARKET_DEMOGRAPHY} />
        <TableContainer>
          <DemographyDataGrid
            rows={formData.demographyRows}
            onOptionChange={handleDemographyOptionChange}
            onSpecialCategoryChange={(value) =>
              updateFormData(SPECIAL_CATEGORY, value)
            }
            specialCategory={formData.specialCategory}
          />
        </TableContainer>
      </SectionBox>
    ),
    [
      formData.demographyRows,
      formData.specialCategory,
      handleDemographyOptionChange,
      updateFormData,
    ]
  )

  const regionSection = useMemo(
    () => (
      <SectionBox>
        <RegionTitle>{SECTION_TITLES.REGION}</RegionTitle>
        <TableContainer>
          <RegionDataGrid
            rows={formData.regionRows}
            onRowChange={handleRegionRowChange}
          />
        </TableContainer>
      </SectionBox>
    ),
    [formData.regionRows, handleRegionRowChange]
  )

    const marketSizeSection = useMemo(
    () => (
      <MarketSizeContainer>
        <SectionHeader title={SECTION_TITLES.MARKET_SIZE} />
        <Grid2 size={{ md: NUMBERMAP.SIX }}>
          <InputField
            label={FIELD_LABELS.MARKET_SIZE}
            placeholder={FIELD_PLACEHOLDERS.MARKET_SIZE}
            value={formData.marketSize}
            onChange={(value: string) => updateFormData(MARKET_SIZE, value)}
          />
        </Grid2>
      </MarketSizeContainer>
    ),
    [formData.marketSize, updateFormData]
  )

  const businessOpportunitySection = useMemo(
    () => (
      <>
        <SectionBox>
          <SectionHeader title={SECTION_TITLES.BUSINESS_OPPORTUNITY} />
        </SectionBox>
        <FormRow>
          <Grid2 container spacing={NUMBERMAP.FOUR}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.TARGET_GEOGRAPHY}
                placeholder={FIELD_PLACEHOLDERS.TARGET_GEOGRAPHY}
                value={formData.targetGeography}
                onChange={(value: string) =>
                  updateFormData(TARGET_GEOGRAPHY, value)
                }
                error={errors.targetGeography}
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.TARGET_SEGMENT}
                placeholder={FIELD_PLACEHOLDERS.TARGET_SEGMENT}
                value={formData.targetSegment}
                onChange={(value: string) =>
                  updateFormData(TARGET_SEGMENT, value)
                }
                error={errors.targetSegment}
              />
            </Grid2>
          </Grid2>
        </FormRow>
        <FormRow>
          <Grid2 container spacing={NUMBERMAP.FOUR}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.TARGET_AUDIENCE}
                placeholder={FIELD_PLACEHOLDERS.TARGET_AUDIENCE}
                value={formData.targetAudience}
                onChange={(value: string) =>
                  updateFormData(TARGET_AUDIENCE, value)
                }
                error={errors.targetAudience}
              />
            </Grid2>
          </Grid2>
        </FormRow>
      </>
    ),
    [
      formData.targetGeography,
      formData.targetSegment,
      formData.targetAudience,
      errors.targetGeography,
      errors.targetSegment,
      errors.targetAudience,
      updateFormData,
    ]
  )

  const additionalInfoSection = useMemo(
    () => (
      <>
        <FormRow>
          <Grid2 container spacing={NUMBERMAP.FOUR}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.INITIAL_SUCCESS_FACTOR}
                placeholder={FIELD_PLACEHOLDERS.INITIAL_SUCCESS_FACTOR}
                value={formData.initialSuccessFactor}
                onChange={(value: string) =>
                  updateFormData(INITIAL_SUCCESS_FACTOR, value)
                }
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.GROWTH_SUSTAINING_FACTOR}
                placeholder={FIELD_PLACEHOLDERS.GROWTH_SUSTAINING_FACTOR}
                value={formData.growthSustainingFactor}
                onChange={(value: string) =>
                  updateFormData(GROWTH_SUSTAINING_FACTOR, value)
                }
              />
            </Grid2>
          </Grid2>
        </FormRow>
        <FormRow>
          <Grid2 container spacing={NUMBERMAP.FOUR}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.STRATEGIC_MARKETING}
                placeholder={FIELD_PLACEHOLDERS.STRATEGIC_MARKETING}
                value={formData.strategicMarketing}
                onChange={(value: string) =>
                  updateFormData(STRATEGIC_MARKETING, value)
                }
              />
            </Grid2>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.DEMAND_GENERATIONS}
                placeholder={FIELD_PLACEHOLDERS.DEMAND_GENERATIONS}
                value={formData.demandGenerations}
                onChange={(value: string) =>
                  updateFormData(DEMAND_GENERATIONS, value)
                }
              />
            </Grid2>
          </Grid2>
        </FormRow>
        <FormRow>
          <Grid2 container spacing={NUMBERMAP.FOUR}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <InputField
                label={FIELD_LABELS.POTENTIAL_RISK}
                placeholder={FIELD_PLACEHOLDERS.POTENTIAL_RISK}
                value={formData.potentialRisk}
                onChange={(value: string) =>
                  updateFormData(POTENTIAL_RISK, value)
                }
              />
            </Grid2>
          </Grid2>
        </FormRow>
      </>
    ),
    [
      formData.initialSuccessFactor,
      formData.growthSustainingFactor,
      formData.strategicMarketing,
      formData.demandGenerations,
      formData.potentialRisk,
      updateFormData,
    ]
  )

  useEffect(() => {
    if (finalFileData.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const prevData = { ...prev }
        prevData.uploadedFile = prevData.uploadedFile.filter(
          (file) => !finalFileData.documents_to_delete.includes(file.file_id)
        )
        return prevData
      })
    }
    if (finalFileData.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const prevData = { ...prev }
        prevData.uploadedFile = prevData.uploadedFile.filter(
          (file) => !finalFileData.local_files_to_delete.includes(file.id)
        )
        return prevData
      })
    }
  }, [finalFileData])



   const handleCloseReviewerModal = () => {
    setIsReviewerModal(false)
    setButtonId(null) // Reset button_id when modal closes
  }

  // Update getButtonConfig to pass trigger_status_id to handleSubmitReviewModal
  const handleButtonChange = (
    button_label: string,
    trigger_status_id?: number
  ) => {
    setButtonId(trigger_status_id || null)
    setButtonName(button_label)
    setIsReviewerModal(true)
  }

  // Update these handler functions to accept trigger_status_id parameter
  const handleSubmitForReview = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.SUBMIT_FOR_REVIEW, trigger_status_id)
  }

  const handleApprove = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.APPROVE, trigger_status_id)
  }

  const handleReject = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.REJECT, trigger_status_id)
  }
  const handleInitiate = (trigger_status_id?: number) => {
    handleButtonChange(BUTTON_LABEL.INITIATE, trigger_status_id)
  }
  const handleSubmitApproval = (trigger_status_id?: number) => {
    const payload = {
      project_id: projectId,
      new_status_id: trigger_status_id,
    }
    saveReview(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }

  const getButtons = getButtonConfig({
    handleSubmitForReview: handleSubmitForReview,
    handleApprove: handleApprove,
    handleReject: handleReject,
    handleCancel: handleCancel,
    handleSave: handleSave,
    handleInitiate: handleInitiate,
    handleSubmitApproval: handleSubmitApproval,
    isDisabled: isDisabled,
  })
  const { buttons: buttonDetails } =
    processButtonsWithPermissions(permissions, getButtons)

    const competitiveLandscapeModal = useMemo(
    () => (
      <CommonModal
        buttonRequired={true}
        open={modalStates.competitiveLandscapeModalOpen}
        onClose={handleCloseCompetitiveLandscapeModal}
        title={MODAL_TITLES.COMPETITIVE_LANDSCAPE}
        onSave={handleSaveCompetitiveLandscapeModal}
      >
        <CompetitiveLandscapeForm
          hasEditable = {!hasEditPermission}
          ref={competitiveLandscapeFormRef}
          initialData={
            editingStates.editingCompetitiveLandscapeRow ?? undefined
          }
          onSubmit={handleSaveCompetitiveLandscapeRow}
        />
      </CommonModal>
    ),
    [
      modalStates.competitiveLandscapeModalOpen,
      handleCloseCompetitiveLandscapeModal,
      handleSaveCompetitiveLandscapeModal,
      editingStates.editingCompetitiveLandscapeRow,
      handleSaveCompetitiveLandscapeRow,
    ]
  )

  const solutionRequirementsModal = useMemo(
    () => (
      <CommonModal
        buttonRequired={true}
        open={modalStates.solutionRequirementsModalOpen}
        onClose={handleCloseSolutionRequirementsModal}
        title={MODAL_TITLES.SOLUTION_REQUIREMENTS}
        onSave={handleSaveSolutionRequirementsModal}
      >
        <SolutionRequirementsForm
          hasEditable = {!hasEditPermission}
          ref={solutionRequirementsFormRef}
          initialData={
            editingStates.editingSolutionRequirementsRow ?? undefined
          }
          onSubmit={handleSaveSolutionRequirementsRow}
        />
      </CommonModal>
    ),
    [
      modalStates.solutionRequirementsModalOpen,
      handleCloseSolutionRequirementsModal,
      handleSaveSolutionRequirementsModal,
      editingStates.editingSolutionRequirementsRow,
      handleSaveSolutionRequirementsRow,
    ]
  )

  const conversionRateModal = useMemo(
    () => (
      <CommonModal
        buttonRequired={true}
        open={modalStates.conversionRateModalOpen}
        onClose={handleCloseConversionRateModal}
        title={
          editingStates.editingConversionRateRow
            ? MODAL_TITLES.EDIT_CONVERSION_RATE
            : MODAL_TITLES.ADD_CONVERSION_RATE
        }
        onSave={handleSaveConversionRateModal}
      >
        <ConversionRateForm
          hasEditable = {!hasEditPermission}
          ref={conversionRateFormRef}
          initialData={editingStates.editingConversionRateRow ?? undefined}
          onSubmit={handleSaveConversionRateRow}
        />
      </CommonModal>
    ),
    [
      modalStates.conversionRateModalOpen,
      handleCloseConversionRateModal,
      handleSaveConversionRateModal,
      editingStates.editingConversionRateRow,
      handleSaveConversionRateRow,
    ]
  )

    const fileUploadSection = useMemo(
    () => (
      <FormRow>
        <FileUploadContainer>
          <FileUploadBox>
            <FileUploadManager
              hasEditable={!hasEditPermission}
              initialFiles={formData.uploadedFile}
              onFileUpload={handleFileUpload}
              onFileEdit={handleFileEdit}
              onSubmit={(data) => {
                setFinalFileData((prev) => mergeFinalFileData(prev, data))
              }}
            />
          </FileUploadBox>
        </FileUploadContainer>
      </FormRow>
    ),
    [
      formData.uploadedFile,
      errors.uploadedFile,
      handleFileUpload,
      handleFileEdit,
    ]
  )
  useEffect(() => {
    if (projectDetailHLDInfo && !buttonDetails) {
      showActionAlert(QUERYCONSTANTS.ALERT_TYPES.CUSTOM_ALERT, {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [buttonDetails, projectDetailHLDInfo])
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalLoader loading = {isLoading()} />
     {buttonDetails && (
       <MainContainer>
        <ContentContainer>
          {}
          {competitiveLandscapeModal}
          {solutionRequirementsModal}
          {conversionRateModal}

          {}
          <HLDContainer>
            <HLDTitle>{SECTION_TITLES.HLD}</HLDTitle>
          </HLDContainer>

          <FormSection>
            <Grid2
                container
              >
              <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
                {}
                {basicInfoSection}

                {}
                {marketSegmentSection}

                {}
                {demographySection}

                {}
                {regionSection}

                {}
                {marketSizeSection}

                {}
                <Box sx={MARGINTOP2}>
                  <CompetitiveLandscapeDataGrid
                    rows={formData.competitiveLandscapeRows}
                    onAddRow={()=>{
                      if(!hasEditPermission) return
                      handleAddCompetitiveLandscapeRow()
                    }}
                    onEditRow={handleEditCompetitiveLandscapeRow}
                    onDeleteRow={(id)=>{
                      if(!hasEditPermission) return
                      handleDeleteCompetitiveLandscapeRow(id)}}
                  />
                </Box>
                {}
                <Box sx={MARGINTOP2}>
                  <SolutionRequirementsDataGrid
                    rows={formData.solutionRequirementsRows}
                    onAddRow={()=>{
                      if(!hasEditPermission) return
                      handleAddSolutionRequirementsRow()}}
                    onEditRow={handleEditSolutionRequirementsRow}
                    onDeleteRow={(id)=>{
                      if(!hasEditPermission) return
                      handleDeleteSolutionRequirementsRow(id)}}
                  />
                </Box>
                {}
                {businessOpportunitySection}

                {}
                <Box sx={MARGINTOP2}>
                  <ConversionRateDataGrid
                    rows={formData.conversionRateRows}
                    onAddRow={()=>{
                      if(!hasEditPermission) return
                      handleAddConversionRateRow()}}
                    onEditRow={handleEditConversionRateRow}
                    onDeleteRow={(id)=>{
                      if(!hasEditPermission) return
                      handleDeleteConversionRateRow(id)}}
                  />
                </Box>
                {}
                {additionalInfoSection}

                {}
                {fileUploadSection}
              </Grid2>
            </Grid2>
            <CommentsHistory
            comments={projectDetailHLDInfo?.meta_info?.task_info?.task_comments}
          />
            {}
           <ButtonGroup buttons={buttonDetails} />
          </FormSection>
          <ReviewerModal
              open={isReviewerModal}
              onClose={handleCloseReviewerModal}
              project_id={projectId}
              button_id={buttonId}
              mode={buttonName}
              menu_id={projectDetailHLDInfo?.meta_info?.action_control?.menuId}
              menu_name={MENU_NAME}
              reviewerList={projectDetailHLDInfo?.meta_info?.task_info?.reviewer_list}
            />
        </ContentContainer>
      </MainContainer>
     )}
    </Suspense>
  )
}

export default React.memo(InputDesign)
