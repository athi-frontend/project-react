
import { RefObject } from 'react'
import magicSaveConstants from '@/constants/magicSave'
import { AxiosError } from 'axios'
import { apiClient } from '@/shared/apiClient'
import { groupByType } from './modules/hr/common'
const {
  DAIGNOSTICS,
  FORM_ELEMENTS,
  INPUT_TYPES: InputTypes,
  ERRORS,
  ATTRIBUTES,
  TRUE,
  APPENDING_VALUES,
  MAGIC_SAVE_PATH,
} = magicSaveConstants

const TAG_ELEMENTS = [
  FORM_ELEMENTS?.SELECT_TAG as string,
  FORM_ELEMENTS?.TEXTAREA_TAG as string,
  FORM_ELEMENTS?.PARAGRAPH_TAG as string,
  FORM_ELEMENTS?.LABEL_TAG as string,
  FORM_ELEMENTS?.SPAN_TAG as string,
  FORM_ELEMENTS?.DIV_TAG as string,
  FORM_ELEMENTS?.INPUT_TAG as string,
  FORM_ELEMENTS?.FIELDSET_TAG as string,
  FORM_ELEMENTS?.BUTTON_TAG as string,
]

const INPUT_TYPES = [
  InputTypes?.TEXT as string,
  InputTypes?.NUMBER as string,
  InputTypes?.DATE as string,
  InputTypes?.RADIO as string,
  InputTypes?.CHECKBOX as string,
  InputTypes?.HIDDEN as string,
]

type GroupedFieldsInterface = {
  [key: string]: {
    [key: string]: Array<JsonValue>
  }
}

type ValueType = number | string | boolean | null

export interface KeysInterface {
  [key: string]: Record<string, ValueType>
}

interface JsonResult {
  [sourceName: string]: {
    [fieldName: string]: ValueType
  }
}

interface ApiResponse {
  [key: string]: {}
}

interface TransformedJsonResult {
  [sourceName: string]: Array<Record<string, ValueType>>
}

interface SaveDataJsonResult {
  [sourceName: string]: Array<{
    [fieldName: string]: ValueType
  }>
}

type Metadata = {
  fileOperation: {}
  documents_to_create: File[]
}

interface SaveDataParams {
  jsonResult: SaveDataJsonResult
  containerID: string
  dataframeworkOperatorType: string
  dataframeworkOtherParamsBag?: TransformedJsonResult
  keys?: KeysInterface
  headers: Record<string, string>
  diagnosticFlag?: string
  fileMetadata?: Metadata
  draftDocuments?:[]
}

interface ProcessFieldParams {
  tagName: string
  typeName: string
  indexElement: HTMLElement
  sourceName: string
  fieldName: string
  groupedFields: GroupedFieldsInterface
}

interface MagicFormSaveParams {
  currentFormRef: RefObject<HTMLElement | null>
  dataframeworkOperatorType: string
  dataframeworkOtherParamsBag?: TransformedJsonResult
  keys?: KeysInterface
  headers?: Record<string, string>
  diagnosticFlag?: string
  fileMetadata?: Metadata,
  draftDocuments?:[]
}

interface MagicGridRowSaveParams {
  containerID: string
  scopedEvents: EventTarget | null
  eventClass: string
  dataframeworkOperatorType: string
  dataframeworkOtherParamsBag?: TransformedJsonResult
  keys?: KeysInterface
  headers?: Record<string, string>
  diagnosticFlag?: string
}

interface MagicGridSaveParams {
  currentFormRef: RefObject<HTMLElement>
  scopedClasses: string
  dataframeworkOperatorType: string
  dataframeworkOtherParamsBag?: TransformedJsonResult
  keys?: KeysInterface
  headers?: Record<string, string>
  diagnosticFlag?: string
}

interface ProcessGridFieldParams {
  tagName: string
  typeName: string
  indexElement:
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | HTMLElement
  sourceName: string
  fieldName: string
  groupedFields: JsonResult
}

type JsonValue = string | number | null

const magicSaveAPI = async (
  headers: Record<string, string>,
  formData: FormData
) => {
  try {
    const config = Object.keys(headers).length > 0 ? { headers } : undefined

    const response = await apiClient.post(MAGIC_SAVE_PATH, formData, config)

    return response.data
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError?.response?.data ?? error
  }
}


const saveData = async ({
  jsonResult,
  containerID,
  dataframeworkOperatorType,
  dataframeworkOtherParamsBag,
  keys,
  headers,
  diagnosticFlag,
  fileMetadata,
  draftDocuments
}: SaveDataParams) => {
  if (hasMinimumData(jsonResult, dataframeworkOtherParamsBag)) {
    const formData = buildFormData({
      containerID,
      dataframeworkOperatorType,
      jsonResult,
      dataframeworkOtherParamsBag,
      keys,
      fileMetadata,
      draftDocuments
    })

    const result = {
      containerId: containerID,
      dataframeworkOperatorType: dataframeworkOperatorType.toLowerCase(),
      data: jsonResult,
      dataframeworkOtherParamsBag,
      keys,
      headers,
    }

    try {
      const apiResponse = await magicSaveAPI(headers, formData)

      return diagnosticFlag?.toUpperCase() ===
        DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES
        ? { payLoad: result, response: apiResponse }
        : { response: apiResponse }
    } catch (error) {
      return { error: ERRORS.API_INTEGRATION_ISSUE, message: error }
    }
  } else {
    return { error: ERRORS.EXPECTING_MINIMUM_AMOUNT_OF_DATA }
  }

  function hasMinimumData(
    jsonResult: Record<string, unknown>,
    dataframeworkOtherParamsBag: unknown
  ): boolean {
    return (
      Object.keys(jsonResult).length > 0 ||
      Object.keys(dataframeworkOtherParamsBag ?? {}).length > 0
    )
  }

  
  function buildFormData({
    containerID,
    dataframeworkOperatorType,
    jsonResult,
    dataframeworkOtherParamsBag,
    keys,
    fileMetadata,
    draftDocuments
  }: {
    containerID: string
    dataframeworkOperatorType: string
    jsonResult: Record<string, unknown>
    dataframeworkOtherParamsBag: unknown
    keys: unknown
    fileMetadata?: {
      fileOperation: unknown
      documents_to_create?: File[],
    },
    draftDocuments?:[]
  }): FormData {
    const formData = new FormData()

    formData.append(APPENDING_VALUES.CONTAINER_ID, containerID)
    formData.append(
      APPENDING_VALUES.DATA_FRAMEWORK_OPERATOR_TYPE,
      dataframeworkOperatorType.toLowerCase()
    )
    formData.append(APPENDING_VALUES.DATA, JSON.stringify(jsonResult))
    formData.append(
      APPENDING_VALUES.DATA_FRAMEWORK_OTHER_PARAMS_BAG,
      JSON.stringify(dataframeworkOtherParamsBag ?? {})
    )
    formData.append(APPENDING_VALUES.KEYS, JSON.stringify(keys))

    if (fileMetadata) {
      formData.append(
        APPENDING_VALUES.FILE_OPERATION,
        JSON.stringify(fileMetadata.fileOperation ?? {})
      )
      for (const file of fileMetadata.documents_to_create ?? []) {
        formData.append(APPENDING_VALUES.DOCUMENTS_TO_CREATE, file)
      }
    }
    if(draftDocuments && draftDocuments?.length>0){
       formData.append(
        'draftDocuments',
        JSON.stringify(groupByType(draftDocuments??[]))
      )
    }

    return formData
  }
}

const isNumeric = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value))
}

const initializeField = (
  groupedFields: GroupedFieldsInterface,
  sourceName: string,
  fieldName: string
) => {
  if (!groupedFields[sourceName][fieldName]) {
    groupedFields[sourceName][fieldName] = []
  }
}

const processValue = (value: string): JsonValue => {
  if (value === '') return null;
  return isNumeric(value) ? parseFloat(value) : value;
}

const processMultiSelectValue = (value: string): JsonValue[] => {
  return value.split(',').map((item) => processValue(item));
}

const processSelect = (
  indexElement: HTMLElement,
  sourceName: string,
  fieldName: string,
  groupedFields: GroupedFieldsInterface
) => {
  const inputValue =
    (indexElement as HTMLInputElement | HTMLTextAreaElement).value ||
    (indexElement as HTMLInputElement | HTMLTextAreaElement).innerText
  if (inputValue || inputValue === '') {
    initializeField(groupedFields, sourceName, fieldName)
    groupedFields[sourceName][fieldName].push(processValue(inputValue))
  }
}

const processInput = (
  indexElement: HTMLElement,
  sourceName: string,
  fieldName: string,
  groupedFields: GroupedFieldsInterface
) => {
  const inputValue = (indexElement as HTMLInputElement | HTMLTextAreaElement)
    .value || (indexElement as HTMLInputElement | HTMLTextAreaElement)
    .innerText
  initializeField(groupedFields, sourceName, fieldName)
  if (indexElement.getAttribute(ATTRIBUTES.IS_MULTI_SELECT) === TRUE) {
    groupedFields[sourceName][fieldName].push(
      ...processMultiSelectValue(inputValue)
    )
  } else {
    groupedFields[sourceName][fieldName].push(processValue(inputValue))
  }
}

const processTextContent = (
  indexElement: HTMLElement,
  sourceName: string,
  fieldName: string,
  groupedFields: GroupedFieldsInterface
) => {
  const inputValue = indexElement.textContent
  if (inputValue) {
    initializeField(groupedFields, sourceName, fieldName)
    groupedFields[sourceName][fieldName].push(inputValue)
  }
}

const processRadio = (
  indexElement: HTMLElement,
  sourceName: string,
  fieldName: string,
  groupedFields: GroupedFieldsInterface
) => {
  const radioGroup = document.getElementsByName(
    (indexElement as HTMLInputElement).name
  )
  for (const radio of radioGroup) {
    if ((radio as HTMLInputElement).checked) {
      const radioValue = (radio as HTMLInputElement).value
      initializeField(groupedFields, sourceName, fieldName)
      groupedFields[sourceName][fieldName].push(radioValue)
      break
    }
  }
}

const processCheckbox = (
  indexElement: HTMLElement,
  sourceName: string,
  fieldName: string,
  groupedFields: GroupedFieldsInterface
) => {
  initializeField(groupedFields, sourceName, fieldName)
  if ((indexElement as HTMLInputElement).checked) {
    groupedFields[sourceName][fieldName].push(
      (indexElement as HTMLInputElement).value
    )
  }
}

const processTextOrDate = (
  indexElement: HTMLElement,
  sourceName: string,
  fieldName: string,
  groupedFields: GroupedFieldsInterface
) => {
  const inputValue = (indexElement as HTMLInputElement).value
  initializeField(groupedFields, sourceName, fieldName)
  groupedFields[sourceName][fieldName].push(processValue(inputValue))
}

const processNumber = (
  indexElement: HTMLElement,
  sourceName: string,
  fieldName: string,
  groupedFields: GroupedFieldsInterface
) => {
  const numberValue = parseFloat((indexElement as HTMLInputElement).value) ?? 0
  initializeField(groupedFields, sourceName, fieldName)
  groupedFields[sourceName][fieldName].push(numberValue)
}

const processField = ({
  tagName,
  typeName,
  indexElement,
  sourceName,
  fieldName,
  groupedFields,
}: ProcessFieldParams) => {
  if (TAG_ELEMENTS.includes(tagName)) {
    switch (tagName) {
      case FORM_ELEMENTS.SELECT_TAG:
        processSelect(indexElement, sourceName, fieldName, groupedFields)
        break
      case FORM_ELEMENTS.TEXTAREA_TAG:
      case FORM_ELEMENTS.DIV_TAG:
      case FORM_ELEMENTS.INPUT_TAG:
      case FORM_ELEMENTS.BUTTON_TAG:
        processInput(indexElement, sourceName, fieldName, groupedFields)
        break
      case FORM_ELEMENTS.PARAGRAPH_TAG:
      case FORM_ELEMENTS.LABEL_TAG:
      case FORM_ELEMENTS.SPAN_TAG:
      case FORM_ELEMENTS.FIELDSET_TAG:
        processTextContent(indexElement, sourceName, fieldName, groupedFields)
        break
      default:
        return {
          error: ERRORS.UNRECOGNIZED_FIELD_TYPE_PROVIDED,
        }
    }
  } else if (INPUT_TYPES.includes(typeName)) {
    switch (typeName) {
      case InputTypes.RADIO:
        processRadio(indexElement, sourceName, fieldName, groupedFields)
        break
      case InputTypes.CHECKBOX:
        processCheckbox(indexElement, sourceName, fieldName, groupedFields)
        break
      case InputTypes.DATE:
      case InputTypes.HIDDEN:
        processTextOrDate(indexElement, sourceName, fieldName, groupedFields)
        break
      case InputTypes.TEXT:
        processInput(indexElement, sourceName, fieldName, groupedFields)
        break
      case InputTypes.NUMBER:
        processNumber(indexElement, sourceName, fieldName, groupedFields)
        break
      default:
        return {
          error: ERRORS.UNRECOGNIZED_FIELD_TYPE_PROVIDED,
        }
    }
  } else {
    return { error: ERRORS.UNRECOGNIZED_FIELD_TYPE_PROVIDED }
  }
}

const processGridField = (params: ProcessGridFieldParams) => {
  const {
    tagName,
    typeName,
    indexElement,
    sourceName,
    fieldName,
    groupedFields,
  } = params
  let radioGroup

  if (TAG_ELEMENTS.includes(tagName)) {
    switch (tagName) {
      case FORM_ELEMENTS.SELECT_TAG:
        groupedFields[sourceName][fieldName] = processValue(
          (indexElement as HTMLSelectElement).value
        )
        break
      case FORM_ELEMENTS.TEXTAREA_TAG:
      case FORM_ELEMENTS.DIV_TAG:
      case FORM_ELEMENTS.INPUT_TAG:
      case FORM_ELEMENTS.BUTTON_TAG:
        groupedFields[sourceName][fieldName] = processValue(
          (indexElement as HTMLInputElement | HTMLTextAreaElement).value
        )
        break
      case FORM_ELEMENTS.PARAGRAPH_TAG:
      case FORM_ELEMENTS.LABEL_TAG:
      case FORM_ELEMENTS.SPAN_TAG:
      case FORM_ELEMENTS.FIELDSET_TAG:
        groupedFields[sourceName][fieldName] = indexElement.textContent
        break
      default:
        return {
          error: ERRORS.UNRECOGNIZED_FIELD_TYPE_PROVIDED,
        }
    }
  } else if (INPUT_TYPES.includes(typeName)) {
    switch (typeName) {
      case InputTypes.RADIO:
        radioGroup = document.getElementsByName(
          (indexElement as HTMLInputElement).name
        )
        for (const radio of radioGroup) {
          if ((radio as HTMLInputElement).checked) {
            groupedFields[sourceName][fieldName] = (
              radio as HTMLInputElement
            ).value
            break
          }
        }
        break
      case InputTypes.TEXT:
      case InputTypes.DATE:
      case InputTypes.HIDDEN:
      case InputTypes.CHECKBOX:
        groupedFields[sourceName][fieldName] = processValue(
          (indexElement as HTMLInputElement).value
        )
        break
      case InputTypes.NUMBER:
        groupedFields[sourceName][fieldName] =
          parseFloat((indexElement as HTMLInputElement).value) ?? 0
        break
      default:
        return {
          error: ERRORS.UNRECOGNIZED_FIELD_TYPE_PROVIDED,
        }
    }
  } else {
    return { error: ERRORS.UNRECOGNIZED_FIELD_TYPE_PROVIDED }
  }
}

export const magicFormSave = async ({
  currentFormRef,
  dataframeworkOperatorType,
  dataframeworkOtherParamsBag = {},
  keys = {},
  headers = {},
  diagnosticFlag = DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
  fileMetadata,
  draftDocuments = []
}: MagicFormSaveParams): Promise<
  { response: ApiResponse } | { response: string } | { error: string }
> => {
  const jsonResult: Record<string, Record<string, JsonValue>[]> = {}

  const currentForm = currentFormRef.current
  const containerID = currentForm?.id
  if (!containerID) {
    return { error: ERRORS.INVALID_CONTAINER_ID_PROVIDED }
  }
  if (currentForm) {
    const elements = Array.from(
      currentForm.querySelectorAll(ATTRIBUTES.QUERY_SELECTOR)
    )

    const groupedFields: GroupedFieldsInterface = {}
    const gridSourceNames = getGridSourceNames(elements)

    for (const el of elements) {
      processElement(el as HTMLElement, groupedFields)
    }

    function getGridSourceNames(elements: Element[]): Set<string> {
      const gridNames = new Set<string>()
      for (const element of elements) {
        const el = element as HTMLElement
        const sourceName = el.getAttribute(ATTRIBUTES.DATA_SOURCE_NAME)
        const isGrid = el.getAttribute(ATTRIBUTES.IS_DATA_GRID) === TRUE
        if (isGrid && sourceName) {
          gridNames.add(sourceName)
        }
      }
      return gridNames
    }

    function processElement(
      element: HTMLElement,
      groupedFields: GroupedFieldsInterface
    ) {
      const sourceName = element.getAttribute(ATTRIBUTES.DATA_SOURCE_NAME)
      const fieldName = element.getAttribute(ATTRIBUTES.DATA_FIELD_NAME)
      const dataIsAutocomplete = element.getAttribute(
        ATTRIBUTES.IS_AUTOCOMPLETE
      )

      if (!sourceName || !fieldName) return

      jsonResult[sourceName] = jsonResult[sourceName] ?? []
      groupedFields[sourceName] = groupedFields[sourceName] ?? {}
      initializeField(groupedFields, sourceName, fieldName)

      if (dataIsAutocomplete === "") {
        groupedFields[sourceName][fieldName].push(null)
        return
      }
      if (dataIsAutocomplete) {
        processAutocompleteField(
          element,
          sourceName,
          fieldName,
          groupedFields,
          dataIsAutocomplete
        )
      } else {
        processNonAutocompleteField(
          element,
          sourceName,
          fieldName,
          groupedFields
        )
      }
    }

    function processAutocompleteField(
      element: HTMLElement,
      sourceName: string,
      fieldName: string,
      groupedFields: GroupedFieldsInterface,
      value: string
    ) {
      const isMultiSelect =
        element.getAttribute(ATTRIBUTES.IS_MULTI_SELECT) === TRUE
      const result = isMultiSelect
        ? processMultiSelectValue(value)
        : [processValue(value)]
      groupedFields[sourceName][fieldName].push(...result)
    }

    function processNonAutocompleteField(
      element: HTMLElement,
      sourceName: string,
      fieldName: string,
      groupedFields: GroupedFieldsInterface
    ) {
      const tagName = element.tagName.toLowerCase()
      const typeName = (element as HTMLInputElement).type?.toLowerCase()

      processField({
        tagName,
        typeName,
        indexElement: element,
        sourceName,
        fieldName,
        groupedFields,
      })
    }

    const handleGridData = (fields: Record<string, JsonValue[]>) => {
      let result: Record<string, JsonValue>[] = []

      const firstField = Object.keys(fields)[0]
      const rowCount = fields[firstField].length

      for (let i = 0; i < rowCount; i++) {
        const rowObject: Record<string, JsonValue> = {}
        Object.keys(fields).forEach((fieldName) => {
          rowObject[fieldName] = fields[fieldName][i]
        })
        result.push(rowObject)
      }
      return result
    }

    const expandArrayFields = (fields: Record<string, JsonValue[]>) => {
      let result: Record<string, JsonValue>[] = [{}]

      for (const fieldName of Object.keys(fields)) {
        const fieldValues = fields[fieldName]

        const valuesToUse = fieldValues.length > 0 ? fieldValues : [null]
        const newResult: Record<string, JsonValue>[] = []

        for (const existingObject of result) {
          for (const value of valuesToUse) {
            newResult.push({
              ...existingObject,
              [fieldName]: value,
            })
          }
        }

        result = newResult
      }

      return result
    }

    Object.keys(groupedFields).forEach((sourceName) => {
      const fields = groupedFields[sourceName]

      const isGrid = gridSourceNames.has(sourceName)

      let expandedObjects

      const cleanedFields = Object.fromEntries(
        Object.entries(fields).map(([key, val]) => [
          key,
          val,
        ])
      )
      expandedObjects = isGrid
        ? handleGridData(cleanedFields)
        : expandArrayFields(cleanedFields)

      expandedObjects.forEach((object) => {
        jsonResult[sourceName].push(object)
      })
    })
  }
  const responseData = await saveData({
    jsonResult,
    containerID,
    dataframeworkOperatorType,
    dataframeworkOtherParamsBag,
    keys,
    headers,
    diagnosticFlag,
    fileMetadata,
    draftDocuments
  })
  return responseData
}

export const magicGridRowSave = async ({
  containerID,
  scopedEvents,
  eventClass,
  dataframeworkOperatorType,
  dataframeworkOtherParamsBag = {},
  keys = {},
  headers = {},
  diagnosticFlag = DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
}: MagicGridRowSaveParams): Promise<
  | {
      payLoad?: {}
      response: ApiResponse | string
    }
  | { response: string }
  | { error: string }
> => {
  const getParentRow = (
    element: EventTarget,
    parentSelectors: string[] = [eventClass]
  ) => {
    if (!element || !(element instanceof Element)) return null

    let parent = null
    for (const selector of parentSelectors) {
      parent = element.closest(selector)
      if (parent) break
    }
    return parent
  }

  const scopedElements = getParentRow(scopedEvents as HTMLElement)
  let transformedJsonResult: TransformedJsonResult = {}

  if (scopedElements) {
    const elements = scopedElements.querySelectorAll(ATTRIBUTES.QUERY_SELECTOR)
    const jsonResult: JsonResult = {}

    for (const indexElement of elements) {
      const element = indexElement as HTMLElement
      const sourceName = element.getAttribute(ATTRIBUTES.DATA_SOURCE_NAME)
      const fieldName = element.getAttribute(ATTRIBUTES.DATA_FIELD_NAME)

      if (!sourceName || !fieldName) continue

      if (!jsonResult[sourceName]) {
        jsonResult[sourceName] = {}
      }

      const tagName = element.tagName.toLowerCase()
      const typeName = (element as HTMLInputElement).type?.toLowerCase() ?? ''

      processGridField({
        tagName,
        typeName,
        indexElement: element,
        sourceName,
        fieldName,
        groupedFields: jsonResult,
      })
    }

    const transformDataFormat = (
      jsonResult: JsonResult
    ): TransformedJsonResult => {
      const transformedResult: TransformedJsonResult = {}

      for (const sourceName in jsonResult) {
        transformedResult[sourceName] = [jsonResult[sourceName]]
      }

      return transformedResult
    }

    if (Object.keys(jsonResult).length > 0) {
      transformedJsonResult = transformDataFormat(jsonResult)
    }
  }
  const responseData = await saveData({
    jsonResult: transformedJsonResult,
    containerID,
    dataframeworkOperatorType,
    dataframeworkOtherParamsBag,
    keys,
    headers,
    diagnosticFlag,
  })
  return responseData
}

export const magicGridSave = async ({
  currentFormRef,
  scopedClasses,
  dataframeworkOperatorType,
  dataframeworkOtherParamsBag = {},
  keys = {},
  headers = {},
  diagnosticFlag = DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
}: MagicGridSaveParams): Promise<
  | { payLoad?: {}; response: ApiResponse | string }
  | { response: string }
  | { error: string }
> => {
  const currentForm = currentFormRef.current
  const containerID = currentForm.id
  const scopedElements = Array.from(currentForm.querySelectorAll(scopedClasses))

  const jsonResult: SaveDataJsonResult = {}

  if (scopedElements.length > 0) {
    for (const element of scopedElements) {
      const elements = element.querySelectorAll(ATTRIBUTES.QUERY_SELECTOR)

      const groupedFields: Record<string, Record<string, ValueType>> = {}

      for (const eachElement of elements) {
        const indexElement = eachElement as HTMLElement

        const sourceName = indexElement.getAttribute(
          ATTRIBUTES.DATA_SOURCE_NAME
        )
        const fieldName = indexElement.getAttribute(ATTRIBUTES.DATA_FIELD_NAME)

        if (!sourceName || !fieldName) continue

        jsonResult[sourceName] = jsonResult[sourceName] ?? []

        groupedFields[sourceName] = groupedFields[sourceName] ?? {}

        const tagName = indexElement.tagName.toLowerCase()
        const typeName =
          (indexElement as HTMLInputElement).type?.toLowerCase() ?? ''

        processGridField({
          tagName,
          typeName,
          indexElement,
          sourceName,
          fieldName,
          groupedFields,
        })
      }

      for (const sourceName of Object.keys(groupedFields)) {
        jsonResult[sourceName].push(groupedFields[sourceName])
      }
    }
  }
  const responseData = await saveData({
    jsonResult,
    containerID,
    dataframeworkOperatorType,
    dataframeworkOtherParamsBag,
    keys,
    headers,
    diagnosticFlag,
  })
  return responseData
}