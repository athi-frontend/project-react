'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import type {
  FormData,
  FunctionalSpecFormErrors,
  keyValueType,
  BaseFrame,
} from '@/types/components/modules/dirSpecifications'
import {
  useFetchModels,
  useFetchFunctionalBlocks,
  useFetchPerformanceSpecificationByProjectID,
  useCreateSpecification,
  useFetchAccessoriesByUsabilityType,
} from '@/hooks/modules/dnd/useDirSpecificataion'
import { initialFormData } from '@/lib/modules/dnd/digSpecification'
import { showActionAlert } from '@/components/ui'
import { DocumentStructure } from '@/types/common'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { UploadedFileData } from '@/types/modules/dnd/hld'
import { magicFormSave } from '@/lib/utils/magicSave'
import {
  restructureData,
  COMMON_CONSTANTS,
  mergeFinalFileData,
} from '@/lib/utils/common'
import {
  SPECIFICATION_SCHEMA,
  SPECIFICATION_FIELDS,
  SPECIFICATION_REQUIRED_MESSAGE,
  SPECIFICATION_FORM_ID,
  SPECIFICATION_NAMES,
  SPECIFICATION_CONTAINER,
  DATA_FIELD_NAMES,
  PERFORMANCE_SPECIFICATION_LABELS
} from '@/constants/modules/dnd/dirSpecificataion'
import { NUMBERMAP, STATUS } from '@/constants/common'
import magicSaveConstants from '@/constants/magicSave'
import CommonSpecificationForm from './CommonForm'
import { magicReadAPI } from '@/lib/utils/magicRead'

/**
 Classification : Confidential
**/

const {
  EQMS_DIR_SUPPORTING_DOCUMENT,
  FK_EQMS_SUPPORTING_FILE_ID,
  REF_ID,
  USABILITY_TYPE,
  EQMS_USABILITY_TYPE,
  EQMS_DIG_SPECIFICATION_USABILITY_TYPE_MAPPER,
  FK_EQMS_DESIGN_SPECIFICATION_TYPE_LK_ID
} = SPECIFICATION_SCHEMA
const {
  PERFORMANCE_SPECIFICATION_FIELD,
  MODELS_FIELD,
  FUNCTIONAL_BLOCK_FIELD,
  DESCRIPTION_FIELD,
  PARAMETER_FIELD,
  UNIT_FIELD,
  VALUE_FIELD,
  ACCURACY_LEVEL_FIELD,
  TYPE_FIELD,
  ADVERSE_EVENT_FIELD,
  CLAUSE_NUMBER,
  APPLICABLE_STANDARDS_FIELD,
  DEVICE_FIELD,
  DEVICE_MULTIPLE_FIELD,
  ACCESSORIES_CONSUMABLES_FIELD,
  LIFETIME_DEVICE_FIELD,
  MODULE_FIELD,
  FUNCTIONAL_BLOCK_MULTISELECT_FIELD,
  CONNECTIVITY_FIELD,
  CONNECTIVITY_MODE_FIELD,
  COMMUNICATION_PROTOCOL_FIELD,
  STANDARDS_FIELD,
} = SPECIFICATION_FIELDS
const {
  PERFORMANCE_SPECIFICATION_REQUIRED,
  MODELS_REQUIRED,
  PARAMETER_REQUIRED,
  ACCESSORIES_REQUIRED,
  FUNCTIONAL_BLOCK_REQUIRED,
  DESCRIPTION_REQUIRED,
  LIFETIME_DEIVICE_REQUIRED,
  ADVERSE_EVENT_REQUIRED,
  MODULE_REQUIRED,
  DEVICE_REQUIRED,
  STANDARDS_REQUIRED,
} = SPECIFICATION_REQUIRED_MESSAGE
const { INSERT, UPDATE, EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS
interface FormInterFaces  {
  pageName: string
  specificationInputId: number
  isopen: boolean
  toggleState: () => void
  specificationApplicabilityId: number
  designSpecificationTypeId: number
  refetchForm: () => void
  accessoriesConsumablesApplicabilityId: number
}
const CommonSpecificationPage: React.FC<FormInterFaces> = ({
  pageName,
  specificationInputId,
  isopen,
  toggleState,
  specificationApplicabilityId,
  designSpecificationTypeId,
  refetchForm,
  accessoriesConsumablesApplicabilityId,
}) => {
  const params = useParams()
  const projectId = params.id
  const formRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FunctionalSpecFormErrors>({
    performanceSpecification: '',
    functionalBlock: '',
    functionalBlockMultiselect: '',
    models: '',
    description: '',
    type: '',
    accessories: '',
    lifeTimeOfDevice: '',
    adverseEvents: '',
    deviceName: '',
  })
  const [finalFileData, setFinalFileData] = useState<DocumentStructure>({
    documents_to_create: [],
    documents_to_delete: [],
    create_meta_data: {},
    update_meta_data: {},
    local_files_to_delete: [],
  })
  const { mutate: createSpecification } = useCreateSpecification()

  const specDIR = (project_id: number, eqms_dig_specification_id: number) => {
    createSpecification(
      { project_id, eqms_dig_specification_id },
      {
        onSuccess: () => showActionAlert(STATUS.SUCCESS),
        onError: () => showActionAlert(STATUS.FAILED),
      }
    )
  }
  const designInputId = specificationInputId.toString()

  const { data: functionalBlockOptions = [] } = useFetchFunctionalBlocks(
    projectId as string
  )

  const { data: modelsData } = useFetchModels(
    projectId as string,
    COMMON_CONSTANTS.ACTIVE_STATUS
  )

  const { data: performanceSpecificationOptions, refetch: perFormanceRefetch } =
    useFetchPerformanceSpecificationByProjectID(Number(projectId))
  const [typeOptions, setTypeOptions] = useState([])
  const [deviceOptions, setDeviceOptions] = useState([])
  const [selectedUsabilityTypeId, setSelectedUsabilityTypeId] = useState<number | null>(null)
  const [shelfLifeAccessoriesOptions, setShelfLifeAccessoriesOptions] = useState([])

  // Hook to fetch accessories by usability type
  const { data: accessoriesByUsabilityType, refetch: refetchAccessories } = 
    useFetchAccessoriesByUsabilityType(accessoriesConsumablesApplicabilityId, selectedUsabilityTypeId ?? NUMBERMAP.ZERO)
  const updateFormData = (
    field: keyof FormData,
    value: string | number | (string|number)[] | null
  ) => {
    setFormData((prevData) => {
      const newData = { ...prevData }
      newData[field] = value
      return newData
    })
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }))
    }

    /**
     * Description: Handle type field change for Shelf Life specification to fetch accessories by usability type,
     * Author: Harsithiga B,
     * Created: 23-08-2025,
     * Classification : Confidential
     */
    if ((field as string) === SPECIFICATION_FIELDS.TYPE_FIELD && pageName === SPECIFICATION_NAMES.SHELF_LIFE) {
      const numericValue = Number(value)
      const isValidNumber = Number.isInteger(numericValue) && numericValue > 0
      
      // Early return for invalid numbers
      if (!isValidNumber) {
        setSelectedUsabilityTypeId(null)
        setShelfLifeAccessoriesOptions([])
        setFormData(prev => ({ ...prev, accessories: 0, accessoriesConsumables: '' }))
        return
      }
      
      // Find the selected usability type to check if it's 'Unit'
      const selectedType = typeOptions.find((type: any) => type.ref_id === numericValue) as { ref_id: number; usability_type: string } | undefined
      
      // Set state based on usability type
      const shouldFetchAccessories = selectedType?.usability_type !== 'Unit'
      setSelectedUsabilityTypeId(shouldFetchAccessories ? numericValue : null)
      
      // Reset accessories field value when type changes
      setFormData(prev => ({ ...prev, accessories: 0, accessoriesConsumables: '' }))
      // Clear accessories error if type is 'Unit'

      if (selectedType?.usability_type === PERFORMANCE_SPECIFICATION_LABELS.UNIT_LABEL) {
        setErrors(prev => ({ ...prev, accessoriesConsumables: '' }))
      }
    }
  }

  const fetchUsabilityType = async () => {
    const result = await magicReadAPI({
      containerId: SPECIFICATION_FORM_ID.USABILITY_FORM_ID,
      data: { [EQMS_USABILITY_TYPE]: [REF_ID, USABILITY_TYPE],  [EQMS_DIG_SPECIFICATION_USABILITY_TYPE_MAPPER]: []},
      keys: {
        [EQMS_DIG_SPECIFICATION_USABILITY_TYPE_MAPPER]: {
          [FK_EQMS_DESIGN_SPECIFICATION_TYPE_LK_ID]: designSpecificationTypeId,
        },
      },
    })
    if (result.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE) {
      const usabilityTypes = result.data[EQMS_DIG_SPECIFICATION_USABILITY_TYPE_MAPPER]?.map((item: { eqms_usability_type: { ref_id: number; usability_type: string } }) => item.eqms_usability_type) ?? []
      setTypeOptions(usabilityTypes)
    } else {
      setTypeOptions([])
    }
  }

  const fetchDeviceNames = async () => {
     /**
   * Description: Added keys to fetch Active records,
   * Author: Harsithiga B,
   * Modified: 21-08-2025,
   * Classification : Confidential
   */
    const result = await magicReadAPI({
      containerId: SPECIFICATION_CONTAINER,
      data: {
        eqms_device_lk: [SPECIFICATION_SCHEMA.ID, DATA_FIELD_NAMES.DEVICE_NAME],
      },
      keys: {
        eqms_device_lk: {
          fk_eqms_project_id: Number(projectId),
          status: COMMON_CONSTANTS.ACTIVE_STATUS,
        },
      },
    })
    const deviceNames = result.data.eqms_device_lk ?? []
    setDeviceOptions(deviceNames)
  }


  useEffect(() => {
    if (!isopen) {
      setFormData(initialFormData)
      setErrors({
        performanceSpecification: '',
        functionalBlock: '',
        functionalBlockMultiselect: '',
        models: '',
        description: '',
        type: '',
        accessories: '',
        lifeTimeOfDevice: '',
        adverseEvents: '',
        deviceName: '',
      })
    }
  }, [isopen])
  useEffect(() => {
    if (pageName === SPECIFICATION_NAMES.FUNCTIONAL_SPECIFICATION) {
      perFormanceRefetch()
    } else if (
      pageName === SPECIFICATION_NAMES.STORAGE_AND_HANDLING_REQUIREMENTS ||
      pageName === SPECIFICATION_NAMES.SHELF_LIFE ||
      pageName === SPECIFICATION_NAMES.ACCESSORIES_CONSUMABLES
    ) {
      fetchUsabilityType()
    }else if (pageName === SPECIFICATION_NAMES.DEVICE_COMPATIBILITY) {
      fetchDeviceNames()
    }
  }, [isopen])

  // Update shelfLifeAccessoriesOptions when accessoriesByUsabilityType data changes
  useEffect(() => {
    if (accessoriesByUsabilityType?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE) {
      // Transform the data to use dig_id as key and specification_parameter as value
      const transformedData = (accessoriesByUsabilityType.data ?? []).map((item: any) => ({
        ref_id: item.dig_id,
        usability_type: item.specification_parameter
      }))
      setShelfLifeAccessoriesOptions(transformedData)
    } else {
      setShelfLifeAccessoriesOptions([])
    }
  }, [accessoriesByUsabilityType])

  // Fetch accessories when selectedUsabilityTypeId changes
  useEffect(() => {
    if (selectedUsabilityTypeId && accessoriesConsumablesApplicabilityId) {
      refetchAccessories()
    }
  }, [selectedUsabilityTypeId, accessoriesConsumablesApplicabilityId, refetchAccessories])

  const validationRules = getValidationRules(pageName, formData, {
    SPECIFICATION_NAMES,
    PARAMETER_FIELD,
    PARAMETER_REQUIRED,
    ACCESSORIES_CONSUMABLES_FIELD,
    ACCESSORIES_REQUIRED,
    FUNCTIONAL_BLOCK_FIELD,
    FUNCTIONAL_BLOCK_REQUIRED,
    MODELS_FIELD,
    MODELS_REQUIRED,
    DESCRIPTION_FIELD,
    DESCRIPTION_REQUIRED,
    LIFETIME_DEVICE_FIELD,
    LIFETIME_DEIVICE_REQUIRED,
    PERFORMANCE_SPECIFICATION_FIELD,
    PERFORMANCE_SPECIFICATION_REQUIRED,
    TYPE_FIELD,
    DEVICE_FIELD,
    DEVICE_REQUIRED,
    DEVICE_MULTIPLE_FIELD,
    ADVERSE_EVENT_FIELD,
    ADVERSE_EVENT_REQUIRED,
    STANDARDS_REQUIRED,
    MODULE_REQUIRED,
    EMPTY_ARRAY_LENGTH,
    typeOptions,
  })

  const handleSave = async () => {
    const newErrors = getValidationErrors()
    setErrors(newErrors)
    if (hasAnyError(newErrors)) return

    const fileMetadata = getFileMetadata(finalFileData)
    const keyValue = buildKeyValue(designInputId, pageName)
    const dataFrame = buildDataFrame(
      formData,
      pageName,
      specificationApplicabilityId,
      designInputId
    )

    setIsLoading(true)
    try {
      const response = await magicFormSave({
        currentFormRef: formRef,
        dataframeworkOperatorType: Number(designInputId) ? UPDATE : INSERT,
        dataframeworkOtherParamsBag: dataFrame,
        keys: keyValue,
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
        fileMetadata,
      })
      const isSuccess =
        response.response.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      if (
        response.response.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      ) {
        const isEditMode = Boolean(Number(designInputId))
        const isPerformanceSpecificationScreen = pageName === SPECIFICATION_NAMES.PERFORMANCE_SPECIFICATION
        // For create operations, get specId from response
        // For edit operations, use the existing designInputId since response might not contain eqms_dig_specification array
        let specId = isEditMode && isPerformanceSpecificationScreen
          ? Number(designInputId) 
          : response?.response?.data?.[NUMBERMAP.ZERO]?.eqms_dig_specification?.[NUMBERMAP.ZERO]?.id

        // Call DIR API for all specifications on create, and for Performance Specification on both create and edit
        // The payload remains the same as createSpecifications: { project_id, dig_specification_id }
        if (specId) {
          specDIR(Number(projectId), specId)
        }
      }
      handleCancel()
  
      showActionAlert(isSuccess ? STATUS.SUCCESS : STATUS.FAILED)
      
    } catch {
      handleCancel()
      showActionAlert(STATUS.FAILED)
    }

    refetchForm()
    setIsLoading(false)
    resetFinalFileData()
  }

  const getValidationErrors = () => {
    return validationRules.reduce(
      (acc, rule) => {
        const isValid = rule.validate(formData[rule.field])
        return { ...acc, [rule.field]: isValid ? '' : rule.message }
      },
      {} as Record<string, string>
    )
  }

  const hasAnyError = (errors: Record<string, string>) => {
    return Object.values(errors).some((error) => error !== '')
  }

  const getFileMetadata = (finalFileData) => {
    if (!Object.keys(finalFileData).length) return undefined

    const hasData = Object.entries(finalFileData).some(([_, val]) => {
      if (Array.isArray(val)) return val.length > EMPTY_ARRAY_LENGTH
      if (val && typeof val === 'object') {
        return Object.values(val).some((nestedVal) => {
          if (nestedVal && typeof nestedVal === 'object') {
            return Object.keys(nestedVal).length > EMPTY_ARRAY_LENGTH
          }
          return !!nestedVal
        })
      }
      return !!val
    })

    if (!hasData) return undefined

    const createTables = [
      {
        table: EQMS_DIR_SUPPORTING_DOCUMENT,
        idColumn: FK_EQMS_SUPPORTING_FILE_ID,
      },
    ]
    const updateTables = [
      {
        table: EQMS_DIR_SUPPORTING_DOCUMENT,
        idColumn: FK_EQMS_SUPPORTING_FILE_ID,
      },
    ]
    const deleteTableColumnMap = {
      eqms_dir_supporting_document: FK_EQMS_SUPPORTING_FILE_ID,
    }
    const output = restructureData(
      finalFileData,
      createTables,
      updateTables,
      deleteTableColumnMap
    )

    return {
      fileOperation: output,
      documents_to_create: finalFileData.documents_to_create,
    }
  }


    const buildKeyValue = (designInputId: number | string, pageName: string) => {
      if (!Number(designInputId)) return {}

      const result: keyValueType = {}

      if (FieldConfig[pageName][DEVICE_FIELD]) {
        result.eqms_device_lk = { id: Number(designInputId) }
      } else {
        result.eqms_dig_specification = { id: Number(designInputId) }
      }

      if (FieldConfig[pageName][MODELS_FIELD]) {
        result.eqms_dig_specification_model_mapper = {
          fk_eqms_dig_specification_id: Number(designInputId),
        }
      }

      if (
        FieldConfig[pageName][FUNCTIONAL_BLOCK_FIELD] ||
        FieldConfig[pageName][FUNCTIONAL_BLOCK_MULTISELECT_FIELD]
      ) {
        result.eqms_dig_specification_functional_block_mapper = {
          fk_eqms_dig_specification_id: Number(designInputId),
        }
      }
      if (FieldConfig[pageName][PERFORMANCE_SPECIFICATION_FIELD] || FieldConfig[pageName][TYPE_FIELD]) {
        result.eqms_dig_specification_mapper = {
          fk_eqms_target_specification_id: Number(designInputId),
        }
      }

      return result
    }

  const buildBaseFrame = (pageName: string, specificationApplicabilityId: string | number): BaseFrame => {
    if (pageName === SPECIFICATION_NAMES.DEVICE_NAME_FORM) {
      return {
        eqms_device_lk: [
          {
            status: COMMON_CONSTANTS.ACTIVE_STATUS,
            fk_eqms_project_id: Number(projectId)
          },
        ],
      }
    }
    
    return {
      eqms_dig_specification: [
        {
          fk_eqms_project_applicable_specification_id: specificationApplicabilityId,
          status: COMMON_CONSTANTS.ACTIVE_STATUS,
        },
      ],
    }
  }

  const addModelMapper = (baseFrame: BaseFrame, formData: FormData, pageName: string, designInputId: string | number) => {
    if (
      formData.models?.length > EMPTY_ARRAY_LENGTH &&
      pageName !== SPECIFICATION_NAMES.LIFETIME_DEVICE &&
      pageName !== SPECIFICATION_NAMES.DEVICE_NAME_FORM
    ) {
      const modelMapper: any = {
        status: COMMON_CONSTANTS.ACTIVE_STATUS,
      }
      
      if (Number(designInputId)) {
        modelMapper.fk_eqms_dig_specification_id = Number(designInputId)
      }
      
      baseFrame.eqms_dig_specification_model_mapper = [modelMapper]
    }
  }

  const addFunctionalBlockMapper = (baseFrame: BaseFrame, formData: FormData, pageName: string, designInputId: string | number) => {
    if (
      formData.functionalBlock?.length > EMPTY_ARRAY_LENGTH &&
      pageName !== SPECIFICATION_NAMES.LIFETIME_DEVICE &&
      pageName !== SPECIFICATION_NAMES.DEVICE_NAME_FORM
    ) {
      const functionalBlockMapper: any = {
        status: COMMON_CONSTANTS.ACTIVE_STATUS,
      }
      
      if (Number(designInputId)) {
        functionalBlockMapper.fk_eqms_dig_specification_id = Number(designInputId)
      }
      
      baseFrame.eqms_dig_specification_functional_block_mapper = [functionalBlockMapper]
    } else if (
      formData.functionalBlockMultiselect?.length > EMPTY_ARRAY_LENGTH &&
      pageName !== SPECIFICATION_NAMES.LIFETIME_DEVICE &&
      pageName !== SPECIFICATION_NAMES.DEVICE_NAME_FORM &&
      pageName !== SPECIFICATION_NAMES.ENVIRONMENTAL_SPECIFICATION
    ) {
      baseFrame.eqms_dig_specification_functional_block_mapper =
        formData.functionalBlockMultiselect?.map((blockId: any) => ({
          status: COMMON_CONSTANTS.ACTIVE_STATUS,
          fk_eqms_dig_specification_id: Number(designInputId),
          fk_eqms_product_functional_block_id: blockId,
        }))
    }
  }

  const addSpecialPageFunctionalBlockMapper = (baseFrame: BaseFrame, pageName: string, designInputId: string | number) => {
    const specialPages = [
      SPECIFICATION_NAMES.REFERENCE_FROM_PREVIOUS_DESIGN,
      SPECIFICATION_NAMES.SERVICING_REQUIREMENTS,
      SPECIFICATION_NAMES.RELIABILITY_REQUIREMENTS,
      SPECIFICATION_NAMES.INSTALLATION_REQUIREMENTS,
      SPECIFICATION_NAMES.OTHER_REQUIREMENTS,
      SPECIFICATION_NAMES.PERFORMANCE_SPECIFICATION,
      SPECIFICATION_NAMES.USER_AND_PATIENT_REQUIREMENTS,
      SPECIFICATION_NAMES.POWER_SUPPLY,
    ]
    
    if (specialPages.includes(pageName)) {
      const functionalBlockMapper: any = {
        status: COMMON_CONSTANTS.ACTIVE_STATUS,
      }
      
      if (Number(designInputId)) {
        functionalBlockMapper.fk_eqms_dig_specification_id = Number(designInputId)
      }
      
      baseFrame.eqms_dig_specification_functional_block_mapper = [functionalBlockMapper]
    }
  }

  const addSpecialPageMapper = (baseFrame: BaseFrame, pageName: string) => {
    if (pageName === SPECIFICATION_NAMES.FUNCTIONAL_SPECIFICATION || pageName === SPECIFICATION_NAMES.SHELF_LIFE) {
      baseFrame.eqms_dig_specification_mapper = [
        {
          status: COMMON_CONSTANTS.ACTIVE_STATUS,
        },
      ]
    }
  }

  const buildDataFrame = (
    formData: FormData,
    pageName: string,
    specificationApplicabilityId: string | number,
    designInputId: string | number
  ) => {
    const baseFrame = buildBaseFrame(pageName, specificationApplicabilityId)
    
    addModelMapper(baseFrame, formData, pageName, designInputId)
    addFunctionalBlockMapper(baseFrame, formData, pageName, designInputId)
    addSpecialPageFunctionalBlockMapper(baseFrame, pageName, designInputId)
    addSpecialPageMapper(baseFrame, pageName)

    return baseFrame
  }

  const resetFinalFileData = () => {
    setFinalFileData({
      documents_to_create: [],
      documents_to_delete: [],
      create_meta_data: {},
      update_meta_data: {},
      local_files_to_delete: [],
    })
  }

  const handleCancel = () => {
    setFormData(initialFormData)
    setErrors({
      performanceSpecification: '',
      functionalBlock: '',
      functionalBlockMultiselect: '',
      models: '',
      description: '',
      type: '',
      accessories: '',
      lifeTimeOfDevice: '',
      adverseEvents: '',
      deviceName: '',
    })
    toggleState()
  }

  const handleFileUpload = (newFile: File | FileData2) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFile: [...prev.uploadedFile, newFile] as File[] | FileDocument[],
    }))
  }

  const handleFileEdit = useCallback(
    (updatedFile: UploadedFileData | FileData2) => {
      setFormData((prev) => {
        const updatedFiles = prev.uploadedFile.map((file) => {
          const currentId =
            typeof file === 'object'
              ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
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


  // 1. Define a base config
  const baseFieldConfig = {
    [PERFORMANCE_SPECIFICATION_FIELD]: false,
    [ACCESSORIES_CONSUMABLES_FIELD]: false,
    [PARAMETER_FIELD]: true,
    [CLAUSE_NUMBER]: false,
    [UNIT_FIELD]: true,
    [VALUE_FIELD]: true,
    [FUNCTIONAL_BLOCK_FIELD]: true,
    [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
    [TYPE_FIELD]: false,
    [MODULE_FIELD]: false,
    [MODELS_FIELD]: true,
    [DEVICE_FIELD]: false,
    [DEVICE_MULTIPLE_FIELD]: false,
    [ACCURACY_LEVEL_FIELD]: true,
    [APPLICABLE_STANDARDS_FIELD]: false,
    [ADVERSE_EVENT_FIELD]: false,
    [LIFETIME_DEVICE_FIELD]: false,
    [DESCRIPTION_FIELD]: true,
    uploadedFile: true,
    [CONNECTIVITY_FIELD] : false,
    [CONNECTIVITY_MODE_FIELD] : false,
    [COMMUNICATION_PROTOCOL_FIELD] : false,
    [STANDARDS_FIELD] : false,
  }

  // 2. Helper to override base config
  function makeFieldConfig(overrides: Partial<typeof baseFieldConfig>) {
    return { ...baseFieldConfig, ...overrides }
  }

  // 3. Centralized FieldConfig
  const FieldConfig = {
    [SPECIFICATION_NAMES.PERFORMANCE_SPECIFICATION]: makeFieldConfig({}),
    [SPECIFICATION_NAMES.FUNCTIONAL_SPECIFICATION]: makeFieldConfig({
      [PERFORMANCE_SPECIFICATION_FIELD]: true,
    }),
    [SPECIFICATION_NAMES.USER_AND_PATIENT_REQUIREMENTS]: makeFieldConfig({}),
    [SPECIFICATION_NAMES.PHYSICAL_CHARACTERSTIC]: makeFieldConfig({
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.POWER_SUPPLY]: makeFieldConfig({}),
    [SPECIFICATION_NAMES.USABILITY_INTERFACE_SPECIFICATION]: makeFieldConfig({
      [FUNCTIONAL_BLOCK_FIELD]: true,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.COMMUNICATION_PROTOCOL]: makeFieldConfig({
      [TYPE_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: true,
    }),
    [SPECIFICATION_NAMES.ENVIRONMENTAL_SPECIFICATION]: makeFieldConfig({}),
    [SPECIFICATION_NAMES.SAFETY]: makeFieldConfig({
      [TYPE_FIELD]: false,
      [MODULE_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: true,
    }),
    [SPECIFICATION_NAMES.STATUTORY]: makeFieldConfig({
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
      [MODELS_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.REGULATIONS]: makeFieldConfig({
      [STANDARDS_FIELD]: true,
      [CLAUSE_NUMBER]: true,
      [UNIT_FIELD]: false,
      [VALUE_FIELD]: false,
      [TYPE_FIELD]: false,
      [MODULE_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
      [FUNCTIONAL_BLOCK_FIELD]: true,
    }),
    [SPECIFICATION_NAMES.RELIABILITY_REQUIREMENTS]: makeFieldConfig({}),
    [SPECIFICATION_NAMES.LABELLING_AND_PACKAGING]: makeFieldConfig({}),
    [SPECIFICATION_NAMES.STORAGE_AND_HANDLING_REQUIREMENTS]: makeFieldConfig({
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
      [TYPE_FIELD]: true,
    }),
    [SPECIFICATION_NAMES.MANUFACTURING_PROCESS]: makeFieldConfig({
      [UNIT_FIELD]: false,
      [VALUE_FIELD]: false,
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
      [MODELS_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.INSTALLATION_REQUIREMENTS]: makeFieldConfig({}),
    [SPECIFICATION_NAMES.SERVICING_REQUIREMENTS]: makeFieldConfig({}),
    [SPECIFICATION_NAMES.ADVERSE_EVENTS]: makeFieldConfig({
      [UNIT_FIELD]: false,
      [VALUE_FIELD]: false,
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
      [TYPE_FIELD]: false,
      [MODULE_FIELD]: false,
      [MODELS_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
      [ADVERSE_EVENT_FIELD]: true,
    }),
    [SPECIFICATION_NAMES.REFERENCE_FROM_PREVIOUS_DESIGN]: makeFieldConfig({
      [UNIT_FIELD]: false,
      [VALUE_FIELD]: false,
      [TYPE_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.TRAINING_REQUIREMENT]: makeFieldConfig({
      [UNIT_FIELD]: false,
      [VALUE_FIELD]: false,
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
      [MODELS_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
      [ADVERSE_EVENT_FIELD]: false,
      [LIFETIME_DEVICE_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.LIFETIME_DEVICE]: makeFieldConfig({
      [PARAMETER_FIELD]: false,
      [UNIT_FIELD]: false,
      [VALUE_FIELD]: false,
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
      [TYPE_FIELD]: false,
      [MODELS_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
      [ADVERSE_EVENT_FIELD]: false,
      [LIFETIME_DEVICE_FIELD]: true,
    }),
    [SPECIFICATION_NAMES.TOXICITY_AND_BIOCOMPATABILITY]: makeFieldConfig({}),
    [SPECIFICATION_NAMES.ACCESSORIES_CONSUMABLES]: makeFieldConfig({
      [ACCESSORIES_CONSUMABLES_FIELD]: true,
      [TYPE_FIELD]: false,
      [MODULE_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.SHELF_LIFE]: makeFieldConfig({
      [PARAMETER_FIELD]: false,
      [TYPE_FIELD]: true,
      [ACCESSORIES_CONSUMABLES_FIELD]: true,
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [MODULE_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.DEVICE_NAME_FORM]: makeFieldConfig({
      [PERFORMANCE_SPECIFICATION_FIELD]: false,
      [ACCESSORIES_CONSUMABLES_FIELD]: false,
      [PARAMETER_FIELD]: false,
      [CLAUSE_NUMBER]: false,
      [UNIT_FIELD]: false,
      [VALUE_FIELD]: false,
      [FUNCTIONAL_BLOCK_FIELD]: false,
      [FUNCTIONAL_BLOCK_MULTISELECT_FIELD]: false,
      [TYPE_FIELD]: false,
      [MODULE_FIELD]: false,
      [MODELS_FIELD]: false,
      [DEVICE_FIELD]: true,
      [DEVICE_MULTIPLE_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
      [ADVERSE_EVENT_FIELD]: false,
      [LIFETIME_DEVICE_FIELD]: false,
      [DESCRIPTION_FIELD]: false,
      uploadedFile: false,
    }),

  /** Author: Harsithiga B
  Date: 12-08-2025
  Description: Removed Models and Accuracy Level in Percentage fields **/
    [SPECIFICATION_NAMES.DEVICE_COMPATIBILITY]: makeFieldConfig({
      [DEVICE_MULTIPLE_FIELD]: true,
      [MODELS_FIELD]: false,
      [ACCURACY_LEVEL_FIELD]: false,
      [CONNECTIVITY_FIELD]: true,
      [CONNECTIVITY_MODE_FIELD]: true,
      [COMMUNICATION_PROTOCOL_FIELD]: true,
      [UNIT_FIELD]: false,
      [VALUE_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.OTHER_REQUIREMENTS]: makeFieldConfig({
      [TYPE_FIELD]: false,
      [MODULE_FIELD]: false,
    }),
    [SPECIFICATION_NAMES.SOFTWARE_REQUIREMENTS]: makeFieldConfig({
      [PARAMETER_FIELD]: false,
      [UNIT_FIELD]: false,
      [VALUE_FIELD]: false,
      [MODULE_FIELD]: true,
      [ACCURACY_LEVEL_FIELD]: false,
      [APPLICABLE_STANDARDS_FIELD]: false,
      [ADVERSE_EVENT_FIELD]: false,
      [LIFETIME_DEVICE_FIELD]: false,
    }),
  }

  const formConfig = Object.keys(FieldConfig[pageName] ?? {}).reduce(
    (config, field) => ({
      ...config,
      [field]: {
        isRequired: FieldConfig[pageName][field],
        validation: FieldConfig[pageName][field],
      },
    }),
    {}
  )

  const getFormId = () => {
    if (pageName === SPECIFICATION_NAMES.FUNCTIONAL_SPECIFICATION || pageName === SPECIFICATION_NAMES.SHELF_LIFE) {
      return SPECIFICATION_FORM_ID.FUNCTIONAL_SPECIFICATION_FORM_ID
    }
    if (pageName === SPECIFICATION_NAMES.DEVICE_NAME_FORM) {
      return SPECIFICATION_FORM_ID.OTHER_SPECIFICATION_DEVICE
    }
    return SPECIFICATION_FORM_ID.OTHER_SPECIFICATION_FORM_ID
  }

  const formId = getFormId()


  return (
    <CommonSpecificationForm
      title={pageName}
      designInputId={designInputId}
      id={
        formId
      }
      ref={formRef}
      open={isopen}
      onClose={toggleState}
      formData={formData}
      updateFormData={updateFormData}
      formConfig={formConfig}
      errors={errors}
      performanceSpecificationOptions={
        performanceSpecificationOptions?.data ?? []
      }
      functionalBlockOptions={functionalBlockOptions}
      modelsOptions={modelsData?.data ?? []}
      accessoriesOptions={pageName === SPECIFICATION_NAMES.SHELF_LIFE ? shelfLifeAccessoriesOptions : typeOptions}
      typeOptions={typeOptions ?? []}
      deviceOptions={deviceOptions}
      handleSave={handleSave}
      handleCancel={handleCancel}
      isLoading={isLoading}
      handleFileUpload={handleFileUpload}
      handleFileEdit={handleFileEdit}
      handleFileSubmit={(data) => {
        setFinalFileData((prev) => mergeFinalFileData(prev, data))
      }}
    />
  )
}

export default CommonSpecificationPage

const createValidationRule = (field: string, message: string, validate: (val: any) => boolean) => ({
  field,
  message,
  validate,
})

const shouldValidateParameter = (pageName: string, SPECIFICATION_NAMES: any) => {
  const excludedPages = [
    SPECIFICATION_NAMES.LIFETIME_DEVICE,
    SPECIFICATION_NAMES.SOFTWARE_REQUIREMENTS,
    SPECIFICATION_NAMES.DEVICE_NAME_FORM,
    SPECIFICATION_NAMES.FUNCTIONAL_SPECIFICATION, 
    SPECIFICATION_NAMES.SHELF_LIFE,
  ]
  return !excludedPages.includes(pageName)
}

const shouldValidateFunctionalBlock = (pageName: string, SPECIFICATION_NAMES: any) => {
  const excludedPages = [
    SPECIFICATION_NAMES.PHYSICAL_CHARACTERSTIC,
    SPECIFICATION_NAMES.STORAGE_AND_HANDLING_REQUIREMENTS,
    SPECIFICATION_NAMES.MANUFACTURING_PROCESS,
    SPECIFICATION_NAMES.TRAINING_REQUIREMENT,
    SPECIFICATION_NAMES.ENVIRONMENTAL_SPECIFICATION,
    SPECIFICATION_NAMES.ADVERSE_EVENTS,
    SPECIFICATION_NAMES.LIFETIME_DEVICE,
    SPECIFICATION_NAMES.SOFTWARE_REQUIREMENTS,
    SPECIFICATION_NAMES.STATUTORY,
    SPECIFICATION_NAMES.DEVICE_NAME_FORM,
    SPECIFICATION_NAMES.COMMUNICATION_PROTOCOL,
    SPECIFICATION_NAMES.SHELF_LIFE
  ]
  return !excludedPages.includes(pageName)
}

const shouldValidateModels = (pageName: string, SPECIFICATION_NAMES: any) => {
  const excludedPages = [
    SPECIFICATION_NAMES.MANUFACTURING_PROCESS,
    SPECIFICATION_NAMES.ADVERSE_EVENTS,
    SPECIFICATION_NAMES.LIFETIME_DEVICE,
    SPECIFICATION_NAMES.TRAINING_REQUIREMENT,
    SPECIFICATION_NAMES.STATUTORY,
    SPECIFICATION_NAMES.DEVICE_NAME_FORM,
    SPECIFICATION_NAMES.DEVICE_COMPATIBILITY
  ]
  return !excludedPages.includes(pageName)
}

const getValidationRules = (
  pageName: string,
  formData: any,
  config: {
    SPECIFICATION_NAMES: any,
    PARAMETER_FIELD: string,
    PARAMETER_REQUIRED: string,
    ACCESSORIES_CONSUMABLES_FIELD: string,
    ACCESSORIES_REQUIRED: string,
    FUNCTIONAL_BLOCK_FIELD: string,
    FUNCTIONAL_BLOCK_REQUIRED: string,
    MODELS_FIELD: string,
    MODELS_REQUIRED: string,
    DESCRIPTION_FIELD: string,
    DESCRIPTION_REQUIRED: string,
    DEVICE_FIELD: string,
    DEVICE_REQUIRED: string,
    DEVICE_MULTIPLE_FIELD: string,
    LIFETIME_DEVICE_FIELD: string,
    LIFETIME_DEIVICE_REQUIRED: string,
    PERFORMANCE_SPECIFICATION_FIELD: string,
    PERFORMANCE_SPECIFICATION_REQUIRED: string,
    TYPE_FIELD: string,
    ADVERSE_EVENT_FIELD: string,
    ADVERSE_EVENT_REQUIRED: string,
    MODULE_REQUIRED: string,
    STANDARDS_REQUIRED: string,
    EMPTY_ARRAY_LENGTH: number
    typeOptions: any[]
  }
) => {
  const {
    SPECIFICATION_NAMES,
    PARAMETER_FIELD,
    PARAMETER_REQUIRED,
    ACCESSORIES_CONSUMABLES_FIELD,
    ACCESSORIES_REQUIRED,
    FUNCTIONAL_BLOCK_FIELD,
    FUNCTIONAL_BLOCK_REQUIRED,
    MODELS_FIELD,
    MODELS_REQUIRED,
    DESCRIPTION_FIELD,
    DESCRIPTION_REQUIRED,
    DEVICE_FIELD,
    DEVICE_REQUIRED,
    DEVICE_MULTIPLE_FIELD,
    LIFETIME_DEVICE_FIELD,
    LIFETIME_DEIVICE_REQUIRED,
    PERFORMANCE_SPECIFICATION_FIELD,
    PERFORMANCE_SPECIFICATION_REQUIRED,
    ADVERSE_EVENT_FIELD,
    ADVERSE_EVENT_REQUIRED,
    MODULE_REQUIRED,
    STANDARDS_REQUIRED,
    EMPTY_ARRAY_LENGTH,
  } = config;

  const validationRules: Array<{
    field: string
    message: string
    validate: (val: any) => boolean
  }> = []

  // Page-specific validation rules
  const pageValidations = {
    [SPECIFICATION_NAMES.COMMUNICATION_PROTOCOL]: [
      createValidationRule(
        FUNCTIONAL_BLOCK_MULTISELECT_FIELD,
        FUNCTIONAL_BLOCK_REQUIRED,
        (val: any) => Array.isArray(val) && val.length > EMPTY_ARRAY_LENGTH
      )
    ],
    [SPECIFICATION_NAMES.ACCESSORIES_CONSUMABLES]: [
      createValidationRule(
        ACCESSORIES_CONSUMABLES_FIELD,
        ACCESSORIES_REQUIRED,
        (val: any) => !!val
      )
    ],
    [SPECIFICATION_NAMES.SOFTWARE_REQUIREMENTS]: [
      createValidationRule(
        FUNCTIONAL_BLOCK_FIELD,
        MODULE_REQUIRED,
        (val: any) => !!val[0]
      )
    ],
    [SPECIFICATION_NAMES.DEVICE_NAME_FORM]: [
      createValidationRule(
        DEVICE_FIELD,
        DEVICE_REQUIRED,
        (val: any) => !!val.trim()
      )
    ],
    [SPECIFICATION_NAMES.DEVICE_COMPATIBILITY]: [
      createValidationRule(
        DEVICE_MULTIPLE_FIELD,
        DEVICE_REQUIRED,
        (val: any) => !!val
      )
    ],
    [SPECIFICATION_NAMES.LIFETIME_DEVICE]: [
      createValidationRule(
        LIFETIME_DEVICE_FIELD,
        LIFETIME_DEIVICE_REQUIRED,
        (val: any) => !!val.trim()
      )
    ],
    [SPECIFICATION_NAMES.FUNCTIONAL_SPECIFICATION]: [
      createValidationRule(
        PERFORMANCE_SPECIFICATION_FIELD,
        PERFORMANCE_SPECIFICATION_REQUIRED,
        (val: any) => val != ''
      )
    ],
    [SPECIFICATION_NAMES.ADVERSE_EVENTS]: [
      createValidationRule(
        ADVERSE_EVENT_FIELD,
        ADVERSE_EVENT_REQUIRED,
        (val: any) => !!val.trim()
      )
    ],
    [SPECIFICATION_NAMES.REGULATIONS]: [
      createValidationRule(
        STANDARDS_FIELD,
        STANDARDS_REQUIRED,
        (val: any) => !!val.trim()
      )
    ]
  }

  // Add page-specific validations
  if (pageValidations[pageName]) {
    validationRules.push(...pageValidations[pageName])
  }

  // Special handling for Shelf Life accessories validation
  if (pageName === SPECIFICATION_NAMES.SHELF_LIFE) {
    const selectedType = config.typeOptions?.find((type: any) => type.ref_id === Number(formData[config.TYPE_FIELD]))
    const isUnitType = selectedType?.usability_type === PERFORMANCE_SPECIFICATION_LABELS.UNIT_LABEL
    
    if (!isUnitType) {
      validationRules.push(createValidationRule(
        ACCESSORIES_CONSUMABLES_FIELD,
        ACCESSORIES_REQUIRED,
        (val: any) => !!val
      ))
    }
  }

  // Conditional validations based on page type
  if (shouldValidateParameter(pageName, SPECIFICATION_NAMES)) {
    validationRules.push(createValidationRule(
      PARAMETER_FIELD,
      PARAMETER_REQUIRED,
      (val: any) => !!val.trim()
    ))
  }

  if (shouldValidateFunctionalBlock(pageName, SPECIFICATION_NAMES)) {
    validationRules.push(createValidationRule(
      FUNCTIONAL_BLOCK_FIELD,
      FUNCTIONAL_BLOCK_REQUIRED,
      (val: any) => {
        if (Array.isArray(val)) {
          return val.length > EMPTY_ARRAY_LENGTH
        }
        return !!val
      }
    ))
  }

  if (shouldValidateModels(pageName, SPECIFICATION_NAMES)) {
    validationRules.push(createValidationRule(
      MODELS_FIELD,
      MODELS_REQUIRED,
      (val: any) => Array.isArray(val) && val.length > EMPTY_ARRAY_LENGTH
    ))
  }

  if (pageName && pageName !== SPECIFICATION_NAMES.DEVICE_NAME_FORM) {
    validationRules.push(createValidationRule(
      DESCRIPTION_FIELD,
      DESCRIPTION_REQUIRED,
      (val: any) => !!val.trim()
    ))
  }

  return validationRules
}