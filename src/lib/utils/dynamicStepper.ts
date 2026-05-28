import { ApiMenu } from '@/types/components/layout/sidebar'
import { NUMBERMAP } from '@/constants/common'
import { DROP, PROCURE, PROJECT, PROJECTDETAILS, UNDEFINED } from '@/constants/components/ui/stepper'
import { DYNAMIC_STEPPER_CONSTANTS } from '@/constants/components/ui/dynamicStepper'

export interface StepperItem {
  label: string
  path: string
}

export interface StepperSection {
  title: string
  items: (StepperSection | StepperItem)[]
}


export const generatePath = (
  base: string,
  projectId: StringOrArray,
): string => {
  // If projectId is provided, append it; otherwise, just return the base path
  return projectId ? `${base}/${projectId}` : base
}

/**
 * Sorts menus by order property, then by hierarchy, then by instance_hierarchy
 */
const sortMenusByOrder = (menus: ApiMenu[]): ApiMenu[] => {
  return menus.toSorted((a, b) => {
    // First sort by order
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    
    // Then sort by hierarchy level
    const aLevels = a.hierarchy.split('.').length;
    const bLevels = b.hierarchy.split('.').length;
    if (aLevels !== bLevels) {
      return aLevels - bLevels;
    }
    
    // Then by hierarchy string
    const hierarchyComparison = a.hierarchy.localeCompare(b.hierarchy);
    if (hierarchyComparison !== NUMBERMAP.ZERO) {
      return hierarchyComparison;
    }
    
    // Finally by instance_hierarchy if both items have the same hierarchy
    const aInstanceHierarchy = a.instance_hierarchy ?? '';
    const bInstanceHierarchy = b.instance_hierarchy ?? '';
    return aInstanceHierarchy.localeCompare(bInstanceHierarchy);
  });
};

// Author : Prithivi Raj
// Date : 11/07/2025
// This is the function for dynamic menu rendering based on the HIERARCHY it split the menu and render the page.

/**
 * Groups menus by their hierarchy level, maintaining order
 */
const groupMenusByLevel = (menuData: ApiMenu[]): Map<string, ApiMenu[]> => {
  const menuMap = new Map<string, ApiMenu[]>()
  const sortedMenus = sortMenusByOrder(menuData)

  sortedMenus.forEach((menu) => {
    const hierarchyParts = menu.hierarchy.split(DYNAMIC_STEPPER_CONSTANTS.SEPARATORS.HIERARCHY)
    const level = hierarchyParts.length

    if (!menuMap.has(level.toString())) {
      menuMap.set(level.toString(), [])
    }
    menuMap.get(level.toString())!.push(menu)
  })

  return menuMap
}

/**
 * Creates a stepper item from a menu
 */
const createStepperItem = (
  menu: ApiMenu,
  projectId: StringOrArray,
  decision_name: string,
  basePath: string
): StepperItem => {
  // If menu.url is null or undefined, set path to '#' to indicate no navigation
  const path = menu.url 
    ? generatePath(`${"/"}${menu.url}`, projectId)
    : '#';
  return {
    label: menu.name,
    path: path,
    menu_id:menu.menu_id,
    slug:menu.slug
  };
}

/**
 * Filters project details menus based on decision, maintaining order
 */
const filterProjectDetailsMenus = (
  menuMap: Map<string, ApiMenu[]>,
  decision_name: string
): ApiMenu[] => {
  const isProjectDetails = (decision_name === PROJECTDETAILS || decision_name === PROCURE);
  const menus = menuMap.get(NUMBERMAP.TWO.toString()) ?? [];
  return menus
    .filter(menu =>
      menu.hierarchy.startsWith(DYNAMIC_STEPPER_CONSTANTS.HIERARCHY_PATTERNS.PROJECT_DETAILS)
    )
    .filter(menu => {
      if (isProjectDetails) return true;
      // Exclude 'PND' and 'PND Review' when not projectDetails
      return !['PND', 'PND Review'].includes(menu.name);
    });
};

/**
 * Creates project details section when no project exists
 */
const createProjectDetailsSectionNoProject = (
  menuMap: Map<string, ApiMenu[]>,
  projectId: StringOrArray,
  decision_name: string
): StepperSection => {
  const filteredMenus = filterProjectDetailsMenus(menuMap, decision_name);
  const items = filteredMenus.map(menu => createStepperItem(menu, projectId, decision_name, ''));

  return {
    title: DYNAMIC_STEPPER_CONSTANTS.SECTION_TITLES.PROJECT_DETAILS,
    items
  };
};

/**
 * Creates project details section when project exists
 */
type StringOrArray = string | string[] | undefined;

const createProjectDetailsSectionWithProject = (
  menuMap: Map<string, ApiMenu[]>,
  projectId: StringOrArray
): StepperSection => {
  const items = (menuMap.get(NUMBERMAP.TWO.toString()) ?? [])
    .filter(menu => menu.hierarchy === DYNAMIC_STEPPER_CONSTANTS.HIERARCHY_PATTERNS.INFO_SECTION)
    .map(menu => createStepperItem(menu, projectId, '', ''));

  return {
    title: DYNAMIC_STEPPER_CONSTANTS.SECTION_TITLES.PROJECT_DETAILS,
    items
  }
}

/**
 * Groups menus by their parent hierarchy, maintaining order
 */
const groupMenusByParent = (levelMenus: ApiMenu[]): Map<string, ApiMenu[]> => {
  const parentGroups = new Map<string, ApiMenu[]>()
  const sortedLevelMenus = sortMenusByOrder(levelMenus)

  sortedLevelMenus.forEach(menu => {
    const hierarchyParts = menu.hierarchy.split(DYNAMIC_STEPPER_CONSTANTS.SEPARATORS.HIERARCHY)
    if (hierarchyParts.length >= NUMBERMAP.TWO) {
      const parentKey = hierarchyParts.slice(NUMBERMAP.ZERO, hierarchyParts.length - NUMBERMAP.ONE).join(DYNAMIC_STEPPER_CONSTANTS.SEPARATORS.HIERARCHY)

      if (!parentGroups.has(parentKey)) {
        parentGroups.set(parentKey, [])
      }
      parentGroups.get(parentKey)!.push(menu)
    }
  })

  return parentGroups
}

/**
 * Finds a parent in the hierarchy chain
 */
const findParentInHierarchy = (
  hierarchyParts: string[],
  menuData: ApiMenu[]
): ApiMenu | null => {
  for (let i = hierarchyParts.length - NUMBERMAP.TWO; i >= NUMBERMAP.ZERO; i--) {
    const potentialParentKey = hierarchyParts.slice(NUMBERMAP.ZERO, i + NUMBERMAP.ONE).join(DYNAMIC_STEPPER_CONSTANTS.SEPARATORS.HIERARCHY)
    const potentialParent = menuData.find(m => m.hierarchy === potentialParentKey)
    if (potentialParent) {
      return potentialParent
    }
  }
  return null
}

/**
 * Creates title from found parent and remaining parts
 */
const createTitleFromParent = (
  foundParent: ApiMenu,
  hierarchyParts: string[]
): string => {
  const remainingParts = hierarchyParts.slice(foundParent.hierarchy.split(DYNAMIC_STEPPER_CONSTANTS.SEPARATORS.HIERARCHY).length)
  return `${foundParent.name} - ${remainingParts.join(DYNAMIC_STEPPER_CONSTANTS.SEPARATORS.HIERARCHY)}`
}

/**
 * Creates title for complex hierarchy structure
 */
const createComplexHierarchyTitle = (
  hierarchyParts: string[],
  menuData: ApiMenu[]
): string => {
  // Dynamically find the immediate parent by removing the last part
  const immediateParentKey = hierarchyParts.slice(NUMBERMAP.ZERO, hierarchyParts.length - NUMBERMAP.ONE).join(DYNAMIC_STEPPER_CONSTANTS.SEPARATORS.HIERARCHY)
  const immediateParent = menuData.find(m => m.hierarchy === immediateParentKey)

  if (immediateParent) {
    // Use the immediate parent's name plus the last part of the hierarchy
    const lastPart = hierarchyParts[hierarchyParts.length - NUMBERMAP.ONE]
    return `${immediateParent.name} - ${lastPart}`
  }

  // If no immediate parent found, try to find any parent in the hierarchy chain
  const foundParent = findParentInHierarchy(hierarchyParts, menuData)

  if (foundParent) {
    return createTitleFromParent(foundParent, hierarchyParts)
  }

  // Fallback to generic title
  return `${DYNAMIC_STEPPER_CONSTANTS.DEFAULTS.SECTION_TITLE} ${hierarchyParts.join(DYNAMIC_STEPPER_CONSTANTS.SEPARATORS.HIERARCHY)}`
}

/**
 * Determines section title based on parent hierarchy
 */
const determineSectionTitle = (
  parentKey: string,
  menuData: ApiMenu[]
): string => {
  // Find the parent menu based on the parentKey
  const parentMenu = menuData.find(m => m.hierarchy === parentKey)

  if (parentMenu) {
    return parentMenu.name
  }

  // If no parent menu found, create a meaningful title based on the hierarchy structure
  const hierarchyParts = parentKey.split(DYNAMIC_STEPPER_CONSTANTS.SEPARATORS.HIERARCHY)

  if (hierarchyParts.length >= NUMBERMAP.TWO) {
    return createComplexHierarchyTitle(hierarchyParts, menuData)
  }

  // For single level hierarchy, create a generic title
  return `${DYNAMIC_STEPPER_CONSTANTS.DEFAULTS.SECTION_TITLE} ${parentKey}`
}

/**
 * Creates child sections for a menu item
 */
const createChildSections = (
  menu: ApiMenu,
  level: number,
  menuMap: Map<string, ApiMenu[]>,
  menuData: ApiMenu[],
  projectId: StringOrArray,
  decision_name: string,
  basePath: string
): StepperSection[] => {
  const childLevel = level + 1;
  const childMenus = menuMap.get(childLevel.toString()) ?? [];

  return childMenus
    .filter(childMenu => childMenu.hierarchy.startsWith(menu.hierarchy))
    .map(childMenu => {
      return createHierarchicalSections(menuMap, menuData, projectId, decision_name, basePath)
        .find(section => section.title === childMenu.name);
    })
    .filter(Boolean) as StepperSection[];
};

/**
 * Creates a section item with optional children
 */
const createSectionItem = (
  menu: ApiMenu,
  level: number,
  menuMap: Map<string, ApiMenu[]>,
  menuData: ApiMenu[],
  projectId: StringOrArray,
  decision_name: string,
  basePath: string
): StepperSection | StepperItem => {
  const stepperItem = createStepperItem(menu, projectId, decision_name, basePath);
  const childSections = createChildSections(menu, level, menuMap, menuData, projectId, decision_name, basePath);

  return childSections.length > NUMBERMAP.ZERO
    ? { title: stepperItem.label, items: childSections }
    : stepperItem;
};

/**
 * Processes parent groups for a specific level
 */
const processParentGroups = (
  parentGroups: Map<string, ApiMenu[]>,
  level: number,
  menuMap: Map<string, ApiMenu[]>,
  menuData: ApiMenu[],
  projectId: StringOrArray,
  decision_name: string,
  basePath: string
): StepperSection[] => {
  const sections: StepperSection[] = [];

  parentGroups.forEach((menus, parentKey) => {
    if (menus.length <= NUMBERMAP.ZERO) return;

    const sectionTitle = determineSectionTitle(parentKey, menuData);
    const items = menus.map(menu =>
      createSectionItem(menu, level, menuMap, menuData, projectId, decision_name, basePath)
    );

    sections.push({
      title: sectionTitle,
      items
    });
  });

  return sections;
};

/**
 * Creates sections for levels 3 and above
 */
const createHierarchicalSections = (
  menuMap: Map<string, ApiMenu[]>,
  menuData: ApiMenu[],
  projectId: StringOrArray,
  decision_name: string,
  basePath: string
): StepperSection[] => {
  const sections: StepperSection[] = [];
  const availableLevels = Array.from(menuMap.keys()).sort((a, b) => parseInt(a) - parseInt(b));
  const maxLevel = Math.max(...availableLevels.map(l => parseInt(l)));

  for (let level = NUMBERMAP.THREE; level <= maxLevel; level++) {
    const levelMenus = menuMap.get(level.toString()) ?? [];
    const parentGroups = groupMenusByParent(levelMenus);
    const levelSections = processParentGroups(parentGroups, level, menuMap, menuData, projectId, decision_name, basePath);

    sections.push(...levelSections);
  }

  return sections;
}

/**
 * Filters direct children for a given parent hierarchy, maintaining order
 * Handles both simple and complex instance_hierarchy patterns
 */
const filterDirectChildren = (
  sortedMenus: ApiMenu[],
  parentHierarchy: string,
  minLevel: number,
  parentInstanceHierarchy?: string
): ApiMenu[] => {
  const filteredMenus = sortedMenus.filter(menu => {
    if (!parentHierarchy) {
      // Root level - find menus with minimum level hierarchy
      return menu.hierarchy.split('.').length === minLevel;
    }

    // Find direct children - hierarchy should start with parent and have exactly one more level
    const parentPattern = `${parentHierarchy}.`;
    if (!menu.hierarchy.startsWith(parentPattern)) return false;

    const remaining = menu.hierarchy.slice(parentPattern.length);
    const isDirectChild = !remaining.includes('.'); // No further nesting in remaining part
    
    // Handle instance_hierarchy logic
    if (parentInstanceHierarchy && menu.instance_hierarchy) {
      const parentInstanceParts = parentInstanceHierarchy.split('.');
      const childInstanceParts = menu.instance_hierarchy.split('.');
      
      if (parentInstanceParts.length === NUMBERMAP.ONE) {
        // Parent has simple instance_hierarchy (like "1") 
        // Child should have complex instance_hierarchy starting with parent (like "1.1", "1.2")
        return isDirectChild && childInstanceParts.length > 1 && childInstanceParts[NUMBERMAP.ZERO] === parentInstanceParts[NUMBERMAP.ZERO];
      } else {
        // Parent has complex instance_hierarchy (like "1.1")
        // Child should have more complex instance_hierarchy starting with parent (like "1.1.1")
        const parentInstancePrefix = parentInstanceParts.join('.');
        return isDirectChild && menu.instance_hierarchy.startsWith(parentInstancePrefix + '.');
      }
    }
    
    // If no instance_hierarchy constraints, just check hierarchy
    return isDirectChild;
  });
  
  // Since sortedMenus is already sorted, filteredMenus maintains the order
  return filteredMenus;
};

/**
 * Checks if a menu has children, considering instance_hierarchy patterns
 */
const hasMenuChildren = (menu: ApiMenu, sortedMenus: ApiMenu[]): boolean => {
  return sortedMenus.some(m => {
    if (!m.hierarchy.startsWith(`${menu.hierarchy}.`) || m.hierarchy === menu.hierarchy) {
      return false;
    }
    
    // Handle instance_hierarchy logic
    if (menu.instance_hierarchy && m.instance_hierarchy) {
      const menuInstanceParts = menu.instance_hierarchy.split('.');
      const childInstanceParts = m.instance_hierarchy.split('.');
      
      if (menuInstanceParts.length === 1) {
        // Menu has simple instance_hierarchy (like "1")
        // Child should have complex instance_hierarchy starting with menu (like "1.1", "1.2")
        return childInstanceParts.length > 1 && childInstanceParts[NUMBERMAP.ZERO] === menuInstanceParts[NUMBERMAP.ZERO];
      } else {
        // Menu has complex instance_hierarchy (like "1.1")
        // Child should have more complex instance_hierarchy starting with menu (like "1.1.1")
        const menuInstancePrefix = menuInstanceParts.join('.');
        return m.instance_hierarchy.startsWith(menuInstancePrefix + '.');
      }
    }
    
    // If no instance_hierarchy on menu, accept children without instance_hierarchy or any child
    if (!menu.instance_hierarchy) {
      return true;
    }
    
    // If menu has instance_hierarchy but child doesn't, don't consider it a child
    if (menu.instance_hierarchy && !m.instance_hierarchy) {
      return false;
    }
    
    return true;
  });
};

/**
 * Creates a hierarchy item (section or item)
 */
const createHierarchyItem = (
  menu: ApiMenu,
  sortedMenus: ApiMenu[],
  projectId: StringOrArray,
  decision_name: string,
  basePath: string,
  buildHierarchy: (parentHierarchy: string) => (StepperSection | StepperItem)[]
): StepperSection | StepperItem => {
  const hasChildren = hasMenuChildren(menu, sortedMenus);

  if (hasChildren) {
    // This menu has children, create a section with nested items
    const childItems = buildHierarchy(menu.hierarchy);
    const stepperItem = createStepperItem(menu, projectId, decision_name, basePath);
    return {
      title: menu.name,
      path: stepperItem.path, // Include the path so parent items can be clicked
      items: childItems
    } as StepperSection;
  }

  // This is a leaf menu, create an item
  return createStepperItem(menu, projectId, decision_name, basePath);
};

/**
 * Converts root items to sections
 */
const convertToSections = (rootItems: (StepperSection | StepperItem)[]): StepperSection[] => {
  return rootItems.map((item) => {
    if ('items' in item) {
      // Already a section
      return item;
    }

    // Convert single item to a section containing that item
    return {
      title: (item).label,
      items: [item]
    } as StepperSection;
  });
};

/**
 * Creates hierarchical structure based on hierarchy patterns (1, 1.1, 1.1.1, etc.)
 * Handles simple and complex instance_hierarchy patterns
 */
const createHierarchicalStructure = (
  menuData: ApiMenu[],
  projectId: StringOrArray,
  decision_name: string,
  basePath: string,
  parentSlug?: string
): StepperSection[] => {
  // Sort menus by order property, then by hierarchy to ensure proper processing order
  const sortedMenus = sortMenusByOrder(menuData);

  // Find the minimum hierarchy level to determine root items
  const minLevel = Math.min(...sortedMenus.map(menu => menu.hierarchy.split('.').length));

  // Create the standard hierarchical structure first
  const buildHierarchy = (parentHierarchy: string = '', parentInstanceHierarchy?: string): (StepperSection | StepperItem)[] => {
    const directChildren = filterDirectChildren(sortedMenus, parentHierarchy, minLevel, parentInstanceHierarchy);

    return directChildren.map(menu =>
      createHierarchyItem(menu, sortedMenus, projectId, decision_name, basePath, 
        (childParentHierarchy: string) => buildHierarchy(childParentHierarchy, menu.instance_hierarchy))
    );
  };

  const rootItems = buildHierarchy();
  const allSections = convertToSections(rootItems);

  // Filter Project Details section items based on decision_name
  if (allSections.length > NUMBERMAP.ZERO && (parentSlug === 'project-details')) {
    const isProjectDetails = (decision_name === PROJECTDETAILS || decision_name === PROCURE);
    
    return allSections.map(section => ({
      ...section,
      items: section.items.filter(item => {
        if ('label' in item) {
          if (isProjectDetails) return true;
          return !['PND', 'PND Review'].includes(item.label);
        }
        return true;
      })
    }));
  }

  return allSections;
};

/**
 * Creates record generation section
 */
export const createRecordGenerationSection = (
  projectId: StringOrArray,
  decision_name: string,
  basePath: string
): StepperSection => ({
  title: DYNAMIC_STEPPER_CONSTANTS.SECTION_TITLES.RECORD_GENERATION,
  items: [{
    label: DYNAMIC_STEPPER_CONSTANTS.SECTION_TITLES.RECORD_GENERATION,
    path: generatePath(`${basePath}${DYNAMIC_STEPPER_CONSTANTS.URL_PATTERNS.RECORD_GENERATION_PATH}${NUMBERMAP.THREE}/`, projectId)
  }]
})

export const buildDynamicStepperSections = (
  menuData: ApiMenu[],
  projectId: StringOrArray,
  decision_name: string
): StepperSection[] => {
  const hasProject =
    typeof window !== UNDEFINED && localStorage.getItem(PROJECT)

  // Group menus by hierarchy level
  const menuMap = groupMenusByLevel(menuData)
  const sections: StepperSection[] = []

  if (!hasProject) {
    // When no project exists, show Project Details with all second-level menus
    const projectDetailsSection = createProjectDetailsSectionNoProject(menuMap, projectId, decision_name)
    sections.push(projectDetailsSection)
  } else if (decision_name === DROP) {
    // Show only Project Details info section
    const projectDetailsSection = createProjectDetailsSectionWithProject(menuMap, projectId)
    sections.push(projectDetailsSection)
  } else {
    // Use hierarchical structure for all menus based on decision - including Record Generation
    const hierarchicalSections = createHierarchicalStructure(menuData, projectId, decision_name, '');
    sections.push(...hierarchicalSections)
  }


  return sections
}

export const generateStepperDataBySlug = (
  menuData: ApiMenu[],
  parentSlug: string
): StepperSection[] => {
  // Find the parent menu using the provided slug
  const parentMenu = menuData.find(menu => menu.slug === parentSlug);

  if (!parentMenu) {
    // If no parent menu is found, return an empty array
    return [];
  }

  // Get all menus that are children of the parent menu based on hierarchy
  const childMenus = menuData.filter(menu => {
    return menu.hierarchy.startsWith(`${parentMenu.hierarchy}.`);
  });

  // Group child menus by their hierarchy level
  const menuMap = groupMenusByLevel(childMenus);

  // Create stepper sections using existing logic
  const sections = createHierarchicalSections(menuMap, menuData, undefined, '', '');

  return sections;
};

export const buildUnifiedDynamicStepperSections = (
  menuData: ApiMenu[],
  parentSlug: string,
  projectId: StringOrArray = '',
  decision_name: string = '',
  basePath: string = ''
): StepperSection[] => {
  // Ensure parentSlug is defined and is a string
  if (!parentSlug || typeof parentSlug !== 'string') {
    return [];
  }

  // Find the parent menu using the provided slug
  const parentMenu = menuData.find(menu => menu.slug === parentSlug);
  if (!parentMenu) {
    // If no parent menu is found, return an empty array
    return [];
  }

  // Create parent item with URL handling
  const parentPath = parentMenu.url 
    ? generatePath(`${"/"}${parentMenu.url}`, projectId)
    : '#';

  const parentItem: StepperItem = {
    label: parentMenu.name,
    path: parentPath,
  };

  // Get all menus that are descendants of the parent menu based on hierarchy
  const childMenus = menuData.filter(menu => {
    return menu.hierarchy.startsWith(`${parentMenu.hierarchy}.`);
  });

  // Create stepper sections using the new hierarchical structure - all from data
  const sections = createHierarchicalStructure([parentMenu, ...childMenus], projectId, decision_name, basePath, parentSlug);

  // Only add parent item if there are no child sections (parent has no children)
  if (sections.length === NUMBERMAP.ZERO) {
    // Create a new section with just the parent item when no children exist
    sections.push({
      title: parentMenu.name,
      items: [parentItem]
    });
  }
  // If parent has children, don't add it as an item since the parent name 
  // is already displayed as the section title

  // If the parentSlug is 'dnd', handle special logic
  if (parentSlug === 'dnd') {
    const projectDetailsSection = sections[NUMBERMAP.ZERO]?.items?.find(
      (item): item is StepperSection => 'title' in item && item.title === DYNAMIC_STEPPER_CONSTANTS.SECTION_TITLES.PROJECT_DETAILS
    )
    
    const isProjectDetails = (decision_name === PROJECTDETAILS || decision_name === PROCURE);
    if (isProjectDetails) return sections;
    return projectDetailsSection ? [projectDetailsSection] : [];
  }

  return sections;
}; 