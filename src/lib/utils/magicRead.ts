import { apiClient } from '@/shared/apiClient'
import magicSaveConstants from '@/constants/magicSave'
const { MAGIC_READ_PATH, ATTRIBUTES, RESPONSE } = magicSaveConstants
type ValueType = number | string | boolean | null

export interface KeysInterface {
  [key: string]: Record<string, ValueType>
}

export const magicReadAPI = async (payload: {}) => {
  const response = await apiClient.post(MAGIC_READ_PATH, payload)

  return response.data
}

export const magicRead = async (
  container: HTMLElement | null,
  keys: KeysInterface,
  fileOperation?: {},
  orderBy?: Record<string, any>
) => {
  const result: Record<string, string[]> = {}
  const containerID = container?.id

  if (!containerID || !container) return result
  const elements = container.querySelectorAll<HTMLElement>(
    ATTRIBUTES.QUERY_SELECTOR
  )
  if (elements.length > RESPONSE.RECORDS_LENGTH_ZERO) {
    elements.forEach((el) => {
      const source = el.getAttribute(ATTRIBUTES.DATA_SOURCE_NAME)
      const field = el.getAttribute(ATTRIBUTES.DATA_FIELD_NAME)

      if (source && field) {
        if (!result[source]) {
          result[source] = []
        }
        result[source].push(field)
      }
    })

    const payload = {
      containerId: containerID,
      data: result,
      keys,
      fileOperation,
      orderBy,
    }

    try {
      const apiResponse = await magicReadAPI(payload)
      return apiResponse
    } catch (error) {
      return error
    }
  } else return result
}
