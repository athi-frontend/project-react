import { NUMBERMAP } from '@/constants/common'
import { ApiMenu } from '@/types/components/layout/sidebar'
import { downloadDocumentURL } from "@/hooks/useCommonDropdown";
import { handleArrayBufferDownload } from "@/lib/utils/common";

// Constants for better maintainability
const HR_MODULE = 'hr'
const RECORD_GENERATION_SEGMENT = 'record-generation'
const MINIMUM_PATH_SEGMENTS = NUMBERMAP.TWO
const MINIMUM_RECORD_GENERATION_SEGMENTS = NUMBERMAP.THREE

// URL patterns for record generation matching
const URL_PATTERNS = {
  EXACT: (formType: string) => `${HR_MODULE}/${RECORD_GENERATION_SEGMENT}/${formType}`,
  SINGULAR: (formType: string) => `${HR_MODULE}/${RECORD_GENERATION_SEGMENT}/${formType.replace('s', '')}`,
  CONTAINS_PLURAL: (formType: string) => `${RECORD_GENERATION_SEGMENT}/${formType}`,
  CONTAINS_SINGULAR: (formType: string) => `${RECORD_GENERATION_SEGMENT}/${formType.replace('s', '')}`
} as const

// Mapping for regular HR pages (slug-based matching)
const HR_PAGE_SLUG_MAPPING: Record<string, string> = {
  'skills': 'skill_master',
  'role-definition': 'role_definition', 
  'training-evaluation': 'training_evaluation',
  'training-schedule': 'training_schedule',
  'training-needs': 'training_needs',
  'induction-training': 'induction_training'
} as const

// Context mapping for response data extraction
const CONTEXT_ENTITY_MAPPING: Record<string, string[]> = {
  'training-evaluation': ['eqms_hr_employee_training_evaluation'],
  'training-needs': ['eqms_hr_employee_training_needs_mapper'], 
  'induction-training': ['eqms_hr_induction_training_employee_header'],
  'role-definition': ['eqms_hr_role_definition'],
  'training-schedule': ['eqms_hr_training_schedule'],
  'skills': ['eqms_hr_skill_master']
} as const

/**
 * Validates if path segments are valid for HR module processing
 */
const isValidHRPath = (pathSegments: string[],contexttype?:string): boolean => {
  const MatchPath = contexttype??HR_MODULE
  return pathSegments.length >= MINIMUM_PATH_SEGMENTS && pathSegments[NUMBERMAP.ZERO] === MatchPath
}

/**
 * Checks if URL matches any of the record generation patterns
 */
const matchesRecordGenerationPattern = (url: string, formType: string): boolean => {
  return url === URL_PATTERNS.EXACT(formType) || 
         url === URL_PATTERNS.SINGULAR(formType) || (
         url.includes(URL_PATTERNS.CONTAINS_PLURAL(formType)) ??
         url.includes(URL_PATTERNS.CONTAINS_SINGULAR(formType)))
}

/**
 * Get menu_id for record generation pages by URL pattern matching
 */
const getRecordGenerationMenuId = (pathSegments: string[], menuData: ApiMenu[]): number | null => {
  const formType = pathSegments[2].replace(/\/\d+$/, '')
  
  // Use find with optimized pattern matching
  const matchingMenu = menuData.find(menu => 
    menu.url && matchesRecordGenerationPattern(menu.url, formType)
  )
  
  return matchingMenu?.menu_id ?? null
}

/**
 * Get menu_id for regular HR pages by slug matching
 */
const getRegularHRMenuId = (pathSegments: string[], menuData: ApiMenu[]): number | null => {
  const pageSegment = pathSegments[1].replace(/\/\d+$/, '')
  const expectedSlug = HR_PAGE_SLUG_MAPPING[pageSegment]
  
  if (!expectedSlug) return null
  
  const matchingMenu = menuData.find(menu => menu.slug === expectedSlug)
  return matchingMenu?.menu_id ?? null
}

/**
 * Extract path segments from current path with validation
 */
const extractPathSegments = (currentPath: string,contexttype?:string): string[] | null => {
  if (!currentPath) return null
  
  const pathSegments = currentPath.replace(/^\//, '').split('/')
  return isValidHRPath(pathSegments,contexttype) ? pathSegments : null
}

/**
 * Extract menu_id from current path by matching with menu data using slug or URL
 */
export const getMenuIdFromPath = (currentPath: string, menuData: ApiMenu[],contexttype?:string): number | null => {
  if (!menuData?.length) return null
  
  const pathSegments = extractPathSegments(currentPath,contexttype)
  if (!pathSegments) return null
  
  // Route to appropriate handler based on URL structure
  const isRecordGeneration = pathSegments[1] === RECORD_GENERATION_SEGMENT && 
                           pathSegments.length >= MINIMUM_RECORD_GENERATION_SEGMENTS
  
  return isRecordGeneration 
    ? getRecordGenerationMenuId(pathSegments, menuData)
    : getRegularHRMenuId(pathSegments, menuData)
}

/**
 * Extract IDs from a single data item for given entity keys
 */
const extractIdsFromDataItem = (dataItem: any, entityKeys: string[]): number[] => {
  const ids: number[] = []
  
  for (const entityKey of entityKeys) {
    const entityData = dataItem[entityKey]
    
    if (Array.isArray(entityData)) {
      const validIds = entityData
        .filter(item => item?.id && typeof item.id === 'number')
        .map(item => item.id)
      
      ids.push(...validIds)
    }
  }
  
  return ids
}

/**
 * Extract context_id array from handleSave response data based on entity type
 */
export const getContextIdFromResponse = (responseData: any[], entityType: string): number[] | null => {
  if (!Array.isArray(responseData) || !responseData.length) return null
  
  const entityKeys = CONTEXT_ENTITY_MAPPING[entityType]
  if (!entityKeys) return null

  // Flatten all IDs from all data items
  const allIds = responseData.flatMap(dataItem => 
    extractIdsFromDataItem(dataItem, entityKeys)
  )
  
  return allIds.length > NUMBERMAP.ZERO ? allIds : null
}

/**
 * Get entity type from current path
 */
export const getEntityTypeFromPath = (currentPath: string): string => {
  const pathSegments = extractPathSegments(currentPath)
  return pathSegments && pathSegments.length >= NUMBERMAP.TWO ? pathSegments[NUMBERMAP.ONE] : ''
} 


/**
 * Get page title from menu data by matching pathname with menu URL**/
export const getPageTitle = (menuData: ApiMenu[], pathname: string, contexttype?: string): string => {
  if (!menuData?.length || !pathname) return ''
  
  const menuid = getMenuIdFromPath(pathname, menuData, contexttype)
  
  if (!menuid) return ''

  const matchingMenu = menuData.find((ele) => ele?.menu_id === menuid)
    
  return matchingMenu?.name ?? ''
}



 export const handleDownloadRecords = async (fileId: string | number, version: string | number, doc_name?: string, version_no: string | number) => {
    try {
      const response = await downloadDocumentURL(fileId, version);
      const assetData = response?.data
      if(assetData.length > NUMBERMAP.ZERO){
        handleArrayBufferDownload({bufferData: assetData[NUMBERMAP.ZERO], fileName: doc_name, version: version_no, type: "pdf"})
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };