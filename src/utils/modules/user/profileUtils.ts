import { NUMBERMAP } from '@/constants/common'
import { PROFILE_URL_KEYS } from '@/constants/modules/user/setting'
import { PROFILE_PICTURE_MENU_NAMES } from '@/constants/modules/user/profile'

// Helper function to validate if a string is a valid URL
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false
  }
  
  // Basic URL validation - check for common URL patterns
  const urlPattern = /^(https?:\/\/|data:image\/|\.\/|\/)/i
  return urlPattern.test(url.trim()) && url.trim().length > NUMBERMAP.ZERO
}

// Utility function to extract and validate profile URL from profile_url object
export const extractProfileUrl = (profileUrl: unknown): string | null => {
  // Early return for null/undefined
  if (!profileUrl) {
    return null
  }

  // Handle string type - validate it's a proper URL
  if (typeof profileUrl === 'string') {
    return isValidUrl(profileUrl) ? profileUrl : null
  }

  // Handle object type
  if (typeof profileUrl === 'object' && !Array.isArray(profileUrl)) {
    const obj = profileUrl as Record<string, unknown>
    
    // Priority order for common URL property names
    const urlKeys = PROFILE_URL_KEYS
    
    // Try to find URL in common property names
    for (const key of urlKeys) {
      const value = obj[key]
      if (typeof value === 'string' && isValidUrl(value)) {
        return value
      }
    }
    
    // If no common key found, check all string values
    const stringValues = Object.values(obj).filter(
      (value): value is string => typeof value === 'string' && isValidUrl(value)
    )
    
    // Return the first valid URL found
    if (stringValues.length > NUMBERMAP.ZERO) {
      return stringValues[NUMBERMAP.ZERO]
    }
  }
  
  return null
}

/**
 * Builds a workflow action URL with optional parameters
 * @param baseUrl - The base URL for the workflow action
 * @param userId - Optional user ID parameter
 * @param contextType - Optional context type parameter
 * @param menuId - Optional menu ID parameter
 * @returns The complete URL with query parameters
 */
export const buildWorkflowActionUrl = (
  baseUrl: string,
  userId?: number,
  contextType?: string,
  menuId?: number
): string => {
  const params: string[] = []  
  if (userId) {
    params.push(`user_id=${userId}`)
  }  
  if (contextType) {
    params.push(`context_type=${contextType}`)
  }  
  if (menuId) {
    params.push(`menu_id=${menuId}`)
  }  
  return params.length > NUMBERMAP.ZERO ? `${baseUrl}?${params.join('&')}` : baseUrl
}

/**
 * Maps permissions array to ensure trigger_status_id has a default value
 * @param permissions - Array of permission objects
 * @returns Mapped permissions with default trigger_status_id
 */
export const mapPermissionsWithDefaultStatus = (permissions: any[]) => {
  return permissions.map(p => ({ 
    ...p, 
    trigger_status_id: p.trigger_status_id ?? NUMBERMAP.ZERO 
  }))
}

/**
 * Get menu ID from menu data based on menu name or slug
 * @param menuData - Array of menu items from API
 * @param menuName - Name or slug of the menu to find
 * @returns Menu ID if found, null otherwise
 */
export const getMenuIdByName = (menuData: any[], menuName: string): number | null => {
  if (!menuData || !Array.isArray(menuData) || !menuName) {
    return null
  }
  
  const menu = menuData.find(item => 
    item.name?.toLowerCase() === menuName.toLowerCase() ||
    item.slug?.toLowerCase() === menuName.toLowerCase()
  )
  
  return menu?.menu_id ?? null
}

/**
 * Get menu ID for user profile picture update from menu data
 * @param menuData - Array of menu items from API
 * @returns Menu ID for profile picture update, null if not found
 */
export const getUserProfilePictureMenuId = (menuData: any[]): number | null => {
  // Try different possible names/slugs for profile picture menu
  for (const name of PROFILE_PICTURE_MENU_NAMES) {
    const menuId = getMenuIdByName(menuData, name)
    if (menuId) {
      return menuId
    }
  }
  
  return null
}