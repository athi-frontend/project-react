import { NUMBERMAP } from '@/constants/common'
import { useEffect, useState } from 'react'
const THOUSANDTWENTYFOUR = NUMBERMAP.THOUSAND+NUMBERMAP.TWENTYFOUR
export const maxSize = NUMBERMAP.TEN * THOUSANDTWENTYFOUR * THOUSANDTWENTYFOUR
export const FileSizeError = `File size should be less than ${NUMBERMAP.TEN} MB`
export const projectIDParam = 'projectId'
export const productSub_TypeId = 'product_sub_type_id'
export const projectId = 'project_id'
export const productName = 'product_name'
export const productGenericName = 'product_generic_name'
export const productGroupId = 'product_group_id'
export const productGroup = 'product_group'
export const productCategoryId = 'product_category_id'
export const productCategory = 'product_category'
export const productTypeId = 'product_type_id'
export const productType = 'product_type'
export const productSubTypeId = 'product_subtype_id'
export const productSubType = 'product_sub_type'
export const isHLDRequired = 'is_hld_required'
export const isPNDRequired = 'is_pnd_required'
export const isFeasibilityStudyRequired = 'is_feasibility_study_required'
export const productDescription = 'product_description'
export const productMarket = 'market'
export const productMarketId = 'market_id'
export const productMarketName = 'market_name'
export const productRegulations = 'regulations'
export const productRegulationId = 'regulation_id'
export const productRegulationName = 'regulation'
export const projectReason = 'project_reason'
export const projectDocuments = 'documents'
export const projectStatus = 'status'
export const documentsToCreate = 'documents_to_create'
export const organizationProjectId = 'organization_project_id'
export const documentsToDelete = 'documents_to_delete'
export const engineeringChangeReq = 'Engineering Change Request'
export const projectListData = 'projectListData'
export const projectInfo = 'projectInfo'
export const fileUrl = 'fileUrl'
export const productCategoryList = 'productCategory'
export const productGroupList = 'productGroupList'
export const productTypeList = 'productType'
export const prodcutSubTypeList = 'prodcutSubType'
export const marketListData = 'marketListData'
export const regulationListData = 'RegulationListData'

export const PROJECT_CREATE_SCREEN_URL = '/project/create'
export const PROJECT_INFO_SCREEN_URL = '/project-details/list'
export const PROJECT_LIST_SCREEN_URL = '/dnd/project/list'
export const projectReasonRadioValues = [
  { value: 'New', label: 'New' },
  {
    value: 'Engineering Change Request',
    label: 'Engineering change request',
  },
]
export const projectListInitialData = {
  data: [],
  rowsAffected: { total_count: 0 },
}
export const initialDataForProjectScreen = { data: [] }
export const projectInitialValue = {
  tid: 0,
  eid: 0,
  org_id: 0,
  project_id: 0,
  organization_project_id: 0,
  status: 0,
  project_reason: '',
  is_hld_required: '',
  is_pnd_required: '',
  product_category_id: '',
  product_type_id: '',
  product_subtype_id: '',
  product_name: '',
  product_generic_name: '',
  product_group_id: '',
  is_feasibility_study_required: '',
  product_description: '',
  market: [],
  regulations: [],
  documents: [],
}

export function useDebounce<T>(value: T, delay: number = NUMBERMAP.FIVEHUNDRED): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
