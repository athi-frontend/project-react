import { ApiMenu } from '@/types/components/layout/sidebar'
import { NUMBERMAP } from '@/constants/common'

export interface StepperItem {
  label: string
  path: string
}

export interface StepperSection {
  title: string
  path?: string
  items: StepperItem[]
}

export const generateHRPath = (base: string): string => {
  // For HR modules, just return the base path without project ID logic
  return base
}

/**
 * Find a parent menu by hierarchy key
 */
const findParentMenu = (menuData: ApiMenu[], parentKey: string): ApiMenu | undefined => {
  return menuData.find(m => m.hierarchy === parentKey)
}

/**
 * Find immediate parent by removing the last hierarchy part
 */
const findImmediateParent = (menuData: ApiMenu[], hierarchyParts: string[]): ApiMenu | undefined => {
  if (hierarchyParts.length < NUMBERMAP.TWO) return undefined
  
  const immediateParentKey = hierarchyParts.slice(NUMBERMAP.ZERO, hierarchyParts.length - NUMBERMAP.ONE).join('.')
  return menuData.find(m => m.hierarchy === immediateParentKey)
}

/**
 * Find any parent in the hierarchy chain by searching backwards
 */
const findAnyParentInChain = (menuData: ApiMenu[], hierarchyParts: string[]): ApiMenu | null => {
  for (let i = hierarchyParts.length - NUMBERMAP.TWO; i >= NUMBERMAP.ZERO; i--) {
    const potentialParentKey = hierarchyParts.slice(NUMBERMAP.ZERO, i + NUMBERMAP.ONE).join('.')
    const potentialParent = menuData.find(m => m.hierarchy === potentialParentKey)
    if (potentialParent) {
      return potentialParent
    }
  }
  return null
}

/**
 * Generate section title when parent menu is found
 */
const generateTitleFromParent = (parentMenu: ApiMenu, hierarchyParts: string[]): string => {
  if (hierarchyParts.length >= NUMBERMAP.TWO) {
    const lastPart = hierarchyParts[hierarchyParts.length - NUMBERMAP.ONE]
    return `${parentMenu.name} - ${lastPart}`
  }
  return parentMenu.name
}

/**
 * Generate section title when no parent menu is found
 */
const generateTitleFromHierarchy = (menuData: ApiMenu[], hierarchyParts: string[]): string => {
  if (hierarchyParts.length < NUMBERMAP.TWO) {
    return `Section ${hierarchyParts.join('.')}`
  }

  const immediateParent = findImmediateParent(menuData, hierarchyParts)
  if (immediateParent) {
    const lastPart = hierarchyParts[hierarchyParts.length - NUMBERMAP.ONE]
    return `${immediateParent.name} - ${lastPart}`
  }

  const foundParent = findAnyParentInChain(menuData, hierarchyParts)
  if (foundParent) {
    const remainingParts = hierarchyParts.slice(foundParent.hierarchy.split('.').length)
    return `${foundParent.name} - ${remainingParts.join('.')}`
  }

  return `Section ${hierarchyParts.join('.')}`
}

/**
 * Determine section title based on hierarchy structure
 */
const determineSectionTitle = (menuData: ApiMenu[], parentKey: string): string => {
  const parentMenu = findParentMenu(menuData, parentKey)
  
  if (parentMenu) {
    const hierarchyParts = parentKey.split('.')
    return generateTitleFromParent(parentMenu, hierarchyParts)
  }
  
  const hierarchyParts = parentKey.split('.')
  return generateTitleFromHierarchy(menuData, hierarchyParts)
}

/**
 * Create stepper section from menus
 */
const createStepperSection = (menus: ApiMenu[], sectionTitle: string): StepperSection => {
  return {
    title: sectionTitle,
    items: menus.map(menu => ({
      label: menu.name,
      path: generateHRPath(`/${menu.url ?? menu.name.toLowerCase().replace(/\s+/g, '-')}/`)
    }))
  }
}

export const buildHRDynamicStepperSections = (
  menuData: ApiMenu[]
): StepperSection[] => {
  // Find the main HR menu by name - this will be our root menu
  const hrRootMenu = menuData.find(menu => 
    menu.name === "HR Competency & Skills" || 
    menu.name.toLowerCase().includes("hr competency")
  )

  if (!hrRootMenu) {
    // If no HR root menu found, return empty sections
    return []
  }

  // Get all menus that are children of the HR root menu based on hierarchy
  const hrMenus = menuData.filter(menu => {
    // Check if this menu's hierarchy starts with the root menu's hierarchy
    return menu.hierarchy.startsWith(hrRootMenu.hierarchy + '.') ?? 
           menu.hierarchy === hrRootMenu.hierarchy
  })

  // Group menus by hierarchy level and parent
  const menuMap = new Map<string, ApiMenu[]>()
  
  hrMenus.forEach((menu) => {
    const hierarchyParts = menu.hierarchy.split('.')
    const level = hierarchyParts.length
    
    if (!menuMap.has(level.toString())) {
      menuMap.set(level.toString(), [])
    }
    menuMap.get(level.toString())!.push(menu)
  })

  // Get all available levels dynamically
  const availableLevels = Array.from(menuMap.keys()).sort((a, b) => parseInt(a) - parseInt(b))

  const sections: StepperSection[] = []

  // Start with the root HR menu
  const rootLevel = hrRootMenu.hierarchy.split('.').length

  // Dynamically create sections for all levels below the root
  for (let level = rootLevel + NUMBERMAP.ONE; level <= Math.max(...availableLevels.map(l => parseInt(l))); level++) {
    const levelMenus = menuMap.get(level.toString()) ?? []
    
    // Group menus by their parent hierarchy based on hierarchical structure
    const parentGroups = new Map<string, ApiMenu[]>()
    
    levelMenus.forEach(menu => {
      const hierarchyParts = menu.hierarchy.split('.')
      if (hierarchyParts.length >= NUMBERMAP.TWO) {
        // Dynamically determine the parent key based on the current level
        // For any level, the parent is all parts except the last one
        const parentKey = hierarchyParts.slice(NUMBERMAP.ZERO, hierarchyParts.length - NUMBERMAP.ONE).join('.')
        
        if (!parentGroups.has(parentKey)) {
          parentGroups.set(parentKey, [])
        }
        parentGroups.get(parentKey)!.push(menu)
      }
    })

    // Create sections for each parent group
    parentGroups.forEach((menus, parentKey) => {
      if (menus.length > NUMBERMAP.ZERO) {
        const sectionTitle = determineSectionTitle(menuData, parentKey)
        const section = createStepperSection(menus, sectionTitle)
        sections.push(section)
      }
    })
  }

  return sections
} 