import { NUMBERMAP } from '@/constants/common';
import { ApiMenu } from '@/types/components/layout/sidebar'

/**
     * Function Name: collectMenuUrls
     * Params: items
     * Description: Used to collect the menu urls from flat menu structure
     * Author: Mayuri
     * Created: 18-08-2025
     * Classification : Confidential
**/
 

export const collectMenuUrls = (items: ApiMenu[]): string[] => {
    const urls: string[] = [];
    items.forEach(item => {
        if (item.url) {
            urls.push(item.url);
        }
    });
    return urls;
};


/**
     * Function Name: normalizePath
     * Params: path
     * Description: Used to filter the path
     * Author: Mayuri
     * Created: 18-08-2025
     * Classification : Confidential
**/

export const normalizePath = (p: string | null | undefined): string => {
    const path = p ?? '';

    const parts = path.split('/').filter(part => part !== '');

    return ('/' + parts.join('/')).toLowerCase();
};

/**
     * Function Name: isPathAllowed
     * Params: currentPath, menuUrls
     * Description: Validates if a path is allowed based on menu URLs with support for sub-paths
     * Author: Mayuri
     * Created: 18-08-2025
     * Classification : Confidential
**/

export const isPathAllowed = (currentPath: string, menuUrls: string[]): boolean => {
    const normalizedPath = normalizePath(currentPath);
    const normalizedValidPaths = menuUrls.map(normalizePath);
    
    if (normalizedValidPaths.includes(normalizedPath)) {
        return true;
    }
    
    const isSubPath = normalizedValidPaths.some(validPath => 
        normalizedPath.startsWith(validPath + '/')
    );
    
    if (isSubPath) {
        return true;
    }
    
    const pathSegments = normalizedPath.split('/').filter(segment => segment !== '');
    
    if (pathSegments.length >= 1) {
        const modulePath = `/${pathSegments[NUMBERMAP.ZERO]}`;
        const hasModuleAccess = normalizedValidPaths.some(validPath => 
            validPath.startsWith(modulePath + '/')
        );
        
        if (hasModuleAccess) {
            return true;
        }
    }
    
    return false;
};

/**
 * Function Name: getHierarchyDepth
 * Params: hierarchy
 * Description: Gets the depth of a menu hierarchy (number of levels)
 * Author: Assistant
 * Created: Current Date
 * Classification : Confidential
**/
const getHierarchyDepth = (hierarchy: string): number => {
    if (!hierarchy) return NUMBERMAP.ZERO;
    return hierarchy.split('.').length;
};

/**
 * Function Name: findMenuObjectByPath
 * Params: currentPath, menuData
 * Description: Finds the menu_id based on the current pathname by matching URLs
 * When multiple menus have the same URL, prefers child menus (deeper hierarchy) over parent menus
 * Author: Assistant
 * Created: Current Date
 * Classification : Confidential
**/

export const findMenuObjectByPath = (currentPath: string, menuData: ApiMenu[]) : ApiMenu | null => {
    
    if (!currentPath || !menuData || menuData.length === NUMBERMAP.ZERO) {
        return null;
    }
    
    const normalizedPath = normalizePath(currentPath);
    
    // First, try to find exact match
    // If multiple menus have the same URL, prefer the child menu (deeper hierarchy)
    const exactMatches = menuData.filter(menu => 
        menu.url && normalizePath(menu.url) === normalizedPath
    );
    
    if (exactMatches.length > NUMBERMAP.ZERO) {
        // Sort by hierarchy depth (deepest first) to prefer child menus over parent menus
        const bestMatch = exactMatches.toSorted((a, b) => {
            const aDepth = getHierarchyDepth(a.hierarchy);
            const bDepth = getHierarchyDepth(b.hierarchy);
            return bDepth - aDepth; // Descending order (deepest first)
        })[NUMBERMAP.ZERO];
        
        return bestMatch;
    }
    
    // If no exact match, try to find the best matching menu by checking if current path starts with menu URL
    // This handles cases like /hr/role-definition/create matching /hr/role-definition
    // We need to find the most specific (longest) match first
    const matchingMenus = menuData.filter(menu => {
        if (!menu.url) return false;
        const normalizedMenuUrl = normalizePath(menu.url);
        // Check if current path starts with menu URL followed by a slash or is exactly equal
        return normalizedPath.startsWith(normalizedMenuUrl + '/') ?? normalizedPath === normalizedMenuUrl;
    });
    
    if (matchingMenus.length > NUMBERMAP.ZERO) {
        // Sort by URL length first, then by hierarchy depth to get the most specific match
        // This ensures we prefer both longer URLs and child menus when URLs are the same
        const bestMatch = matchingMenus.toSorted((a, b) => {
            const aLength = normalizePath(a.url ?? '').length;
            const bLength = normalizePath(b.url ?? '').length;
            
            // If URLs have the same length, prefer deeper hierarchy (child menu)
            if (aLength === bLength) {
                const aDepth = getHierarchyDepth(a.hierarchy);
                const bDepth = getHierarchyDepth(b.hierarchy);
                return bDepth - aDepth; // Descending order (deepest first)
            }
            
            return bLength - aLength; // Descending order (longest first)
        })[NUMBERMAP.ZERO];
        
        return bestMatch;
    }
    
    // If still no match, try to find by module path (fallback)
    const pathSegments = normalizedPath.split('/').filter(segment => segment !== '');
    
    if (pathSegments.length >= NUMBERMAP.ONE) {
        const modulePath = `/${pathSegments[NUMBERMAP.ZERO]}`;
        
        // Find menus that start with the module path
        const moduleMatches = menuData.filter(menu => 
            menu.url && normalizePath(menu.url).startsWith(modulePath)
        );
        
        if (moduleMatches.length > NUMBERMAP.ZERO) {
            // Prefer child menus (deeper hierarchy) when multiple menus match the module path
            const bestMatch = moduleMatches.toSorted((a, b) => {
                const aDepth = getHierarchyDepth(a.hierarchy);
                const bDepth = getHierarchyDepth(b.hierarchy);
                return bDepth - aDepth; // Descending order (deepest first)
            })[NUMBERMAP.ZERO];
            
            return bestMatch;
        }
    }
    
    return null;
};

/**
 * Function Name: getAdjacentMenuUrls
 * Params: menuId, menuData
 * Description: Finds the URLs of the previous and next menus based on the order value
 * Author: Harsithiga B
 * Created: 24-11-2025
 * Classification : Confidential
**/
export const getAdjacentMenuUrls = (
    menuId: number | null,
    menuData: ApiMenu[]
): { previousUrl: string | null; nextUrl: string | null } => {
    if (!menuId || !Array.isArray(menuData) || menuData.length === NUMBERMAP.ZERO) {
        return { previousUrl: null, nextUrl: null };
    }

    // Sort menus that have a valid numeric order to ensure consistent traversal
    const sortedMenus = menuData
        .filter(menu => typeof menu.order === 'number')
        .toSorted((a, b) => a.order - b.order);

    if (sortedMenus.length === NUMBERMAP.ZERO) {
        return { previousUrl: null, nextUrl: null };
    }

    // Locate the current menu entry using the supplied menuId
    const currentMenu = sortedMenus.find(menu => menu.menu_id === menuId);

    if (!currentMenu) {
        return { previousUrl: null, nextUrl: null };
    }

    // Capture the current menu order so we can compare against surrounding menus
    const currentOrder = currentMenu.order ?? null;

    if (currentOrder === null) {
        return { previousUrl: null, nextUrl: null };
    }

    // Find the immediate previous menu by selecting the largest order smaller than currentOrder
    const previousMenu = sortedMenus
        .filter(menu => menu.order < currentOrder)
        .toSorted((a, b) => b.order - a.order)[NUMBERMAP.ZERO] ?? null;

    // Find the immediate next menu by selecting the smallest order greater than currentOrder
    const nextMenu = sortedMenus
        .filter(menu => menu.order > currentOrder)
        .toSorted((a, b) => a.order - b.order)[NUMBERMAP.ZERO] ?? null;
    // Return the neighboring URLs (or null when unavailable) to power Prev/Next navigation
    return {
        previousUrl: previousMenu?.url ?? null,
        nextUrl: nextMenu?.url ?? null,
    };
};