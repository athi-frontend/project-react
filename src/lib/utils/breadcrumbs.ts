/**Confidential
 **/
import { NUMBERMAP } from "@/constants/common";
import { common_action_words, CREATE, EDIT, RECORD_GENERATION, RECORD_GENERATION_TITLE, skipSegments, URL_PATTERNS,exception_urls_edit_enabled } from "@/constants/components/ui/breadcrumb";
import { ApiMenu, BreadcrumbItem } from "@/types/components/layout/sidebar";

// Edit functionality configuration
const EDIT_ENABLED_MODULES = {
  'hr': true,
  'project-details': false,
  'regulation': false,
  'dnd': false,
  'user': true,
  'risk-management': false, 
  'quality-control-management': true,
  'infrastructure-management' : true,
  'vendor-management': true,
  'production': false,
  'purchase' : true,
  'sales' : true,

} as const;

type breadcrumbStackType = BreadcrumbItem[]

const createPathSegments = (pathname: string): string[] => {
  if (!pathname || typeof pathname !== 'string') {
    return [];
  }
  
  // Remove query parameters and hash fragments
  const cleanPath = pathname.split('?')[NUMBERMAP.ZERO].split('#')[NUMBERMAP.ZERO];
  const segments = cleanPath.match(/([^/]+)/g) || [];
  return segments;
}

const getBasePathName = (pathname: string): string | null => { 
  const segments = createPathSegments(pathname)  
    if (segments.length === NUMBERMAP.ZERO) {
    return null;
  }
  
  // Find the matching pattern and return the value
  for (const [key, value] of Object.entries(URL_PATTERNS)) {
    if (value === segments[NUMBERMAP.ZERO] && key) {
        return value
    }
  }
  return null
}

function normalizeUrl(path: string): string {
  if (!path || typeof path !== 'string') return '';

  let cleaned = path;

  // Remove trailing /create
  cleaned = cleaned.replace(/\/create\/?$/, '');

  // Remove trailing numeric ID (digits) if present
  cleaned = cleaned.replace(/\/\d+\/?$/, '');

  // Remove trailing slash if longer than 1 character
  if (cleaned.endsWith('/') && cleaned.length > NUMBERMAP.ONE) {
    cleaned = cleaned.slice(NUMBERMAP.ZERO, -NUMBERMAP.ONE);
  }

  // Remove leading slash if present
  if (cleaned.startsWith('/')) {
    cleaned = cleaned.slice(NUMBERMAP.ONE);
  }

  return cleaned;
}

function checkForExactUrl(pathname: string, url: string | null): boolean {
  if (!pathname || !url) return false;
  
  const normalizedPath = normalizeUrl(pathname);
  return normalizedPath === url;
}

const getActionBreadcrumb = (segments: string[], pathname: string, module: string, id?: number): BreadcrumbItem | null => {
  if (!segments || !Array.isArray(segments) || !pathname || !module) {
    return null;
  }
  
  if (segments.includes(CREATE)) {
    return { name: CREATE, url: `` };
  }
  else if (id && module && EDIT_ENABLED_MODULES[module as keyof typeof EDIT_ENABLED_MODULES] && !(pathname.includes(RECORD_GENERATION))) {
    return { name: EDIT, url: `` };
  }
  else if (/^\/project-details\/\d+$/.test(pathname)) {
    return { name: EDIT, url: `` };
  }
  return null;
};

// Utility function to format URL segments into readable names
const formatSegmentName = (segment: string): string => {
  // Skip numeric IDs and common action words
  if (/^\d+$/.test(segment) || common_action_words.includes(segment.toLowerCase())) {
    return '';
  }
  
  // Format the segment name (convert kebab-case to Title Case)
  return segment
    .split('-')
    .map(word => word.charAt(NUMBERMAP.ZERO).toUpperCase() + word.slice(NUMBERMAP.ONE).toLowerCase())
    .join(' ');
};

// Utility function to create fallback breadcrumbs from URL segments
const createFallbackBreadcrumbs = (segments: string[], startIndex: number = NUMBERMAP.ZERO, id?: number, module?: string): breadcrumbStackType => {
  const breadcrumbs: breadcrumbStackType = [];
  
  // Check if there's a numeric ID in the segments
  const urlId = segments.find(segment => /^\d+$/.test(segment));
  const effectiveId = id || (urlId ? parseInt(urlId) : undefined);
  
  // Skip intermediate segments that should not be separate breadcrumbs
  // These are typically sub-modules or intermediate paths
  
  for (let i = startIndex; i < segments.length; i++) {
    const segment = segments[i];
    
    // Skip segments that should not be separate breadcrumbs
    if (skipSegments.includes(segment.toLowerCase())) {
      continue;
    }
    
    const formattedName = formatSegmentName(segment);
    
    if (formattedName) {
      // Build the URL up to this segment, including any skipped segments in the path
      let urlPath = segments.slice(NUMBERMAP.ZERO, i + NUMBERMAP.ONE).join('/');
      
      // If effective ID is present and this is not the last segment, add ID to the URL
      if (effectiveId && i < segments.length - NUMBERMAP.ONE) {
        urlPath += `/${effectiveId}`;
      }
      
      breadcrumbs.push({
        name: formattedName,
        url: `/${urlPath}`
      });
    }
  }
  
  // Add "Edit" breadcrumb for edit-enabled modules when ID is present
  // Exception: Don't add "Edit" for paths in exception_urls_edit_enabled
  if (effectiveId && module && module in EDIT_ENABLED_MODULES && EDIT_ENABLED_MODULES[module as keyof typeof EDIT_ENABLED_MODULES]) {

    const pathContainsException = segments.some(segment => exception_urls_edit_enabled.includes(segment.toLowerCase()));
    
    if (!pathContainsException) {
      breadcrumbs.push({
        name: EDIT,
        url: ''
      });
    }
  }
  
  return breadcrumbs;
};

const getInnerBreadCrumb = (urlList: ApiMenu[], pathname: string, module: string, id?: number): breadcrumbStackType => {
  if (!urlList || !Array.isArray(urlList) || !pathname || !module) {
    return [];
  }
  
  let breadcrumbStack: breadcrumbStackType = [];
  
  const segments = createPathSegments(pathname)
  
  // Process all URLs in the filtered list 
  urlList.forEach((ele) => {
    if (ele?.url && checkForExactUrl(pathname, ele.url)) {
      // If it's edit-based module and ID is provided, append ID to URL
      if (pathname.includes(RECORD_GENERATION)) {
        breadcrumbStack.push({ name: `${RECORD_GENERATION_TITLE} > ${ele.name}`, url: `/${ele.url}/${id}` });
      } 
      else if ((module in EDIT_ENABLED_MODULES && EDIT_ENABLED_MODULES[module as keyof typeof EDIT_ENABLED_MODULES])) {
        breadcrumbStack.push({ name: ele.name, url: `/${ele.url}` });
      } else {
        breadcrumbStack.push({ name: ele.name, url: `/${ele.url}/${id}` });
      }
    }
  });

  // If no breadcrumbs were found from menu data, create fallback breadcrumbs from URL segments
  if (breadcrumbStack.length === NUMBERMAP.ZERO && segments.length > NUMBERMAP.ONE) {
    // Skip the first segment (base path) and create breadcrumbs from remaining segments
    const fallbackBreadcrumbs = createFallbackBreadcrumbs(segments, NUMBERMAP.ONE, id, module);
    breadcrumbStack.push(...fallbackBreadcrumbs);
  }

  const actionBreadcrumb = getActionBreadcrumb(segments, pathname, module, id);
  if (actionBreadcrumb) {
    breadcrumbStack.push(actionBreadcrumb);
  }
  
  return breadcrumbStack;
};

const createBreadCrumb = (pathname: string, id: number | null, menuData: ApiMenu[], module: string): breadcrumbStackType => {
  if (!pathname || !menuData || !Array.isArray(menuData) || !module) {
    return [];
  }
  
  let breadcrumbStack: breadcrumbStackType = []
  const basePath = module

  // get the base url
  const level1Hierarchies = menuData.filter((ele) => {
    if (!ele?.hierarchy) return false;
    //from all herichy lv 1 get the base -name 
    return /^([^.]+)$/.test(ele.hierarchy) ? ele : null;        
  })
  
  //basepath added
  level1Hierarchies.forEach((ele) => {
    if (ele?.url && basePath && ele.url.includes(basePath)) {
      breadcrumbStack.push({ name: ele.name, url: `/${ele.url}` })
    }
  });

  const filteredUrlsByModule = menuData.filter((ele: ApiMenu) => {
    if (!ele?.url) return false;
    // Filter menu items that belong to the current module
    // Check if the URL contains the base path for the module
    // Exclude level 1 hierarchies (they are handled separately)
    return ele.url.includes(basePath) && !/^([^.]+)$/.test(ele.hierarchy);
  });

  const isEditBasedModule = module in EDIT_ENABLED_MODULES ? EDIT_ENABLED_MODULES[module as keyof typeof EDIT_ENABLED_MODULES] : false

  if (isEditBasedModule) {
    const innerBreadcrumbs = getInnerBreadCrumb(filteredUrlsByModule, pathname, module, id || undefined);
    breadcrumbStack.push(...innerBreadcrumbs);
  } else {
    const innerBreadcrumbs = getInnerBreadCrumb(filteredUrlsByModule, pathname, module);
    breadcrumbStack.push(...innerBreadcrumbs);
  }

  return breadcrumbStack;
}

export const generateBreadcrumb = (pathname: string, id: number | null, menuData: ApiMenu[]): breadcrumbStackType => {
  // Validate inputs
  if (!pathname || !menuData || !Array.isArray(menuData)) {
    return []
  }
  
  let breadcrumbStack: breadcrumbStackType = []
  const basePath = getBasePathName(pathname)
  
  if (basePath) {
    // Use the existing logic when base path is found
    breadcrumbStack = createBreadCrumb(pathname, id, menuData, basePath) || []
  } else {
    // Fallback: create breadcrumbs from URL path when no base path matches
    const segments = createPathSegments(pathname)
    
    if (segments.length > NUMBERMAP.ZERO) {
      // Extract module from first segment for edit-enabled check
      const fallbackModule = segments[NUMBERMAP.ZERO];
      // Create breadcrumbs from URL segments starting from the first segment
      breadcrumbStack = createFallbackBreadcrumbs(segments, NUMBERMAP.ZERO, id || undefined, fallbackModule);
    }
  }

  return breadcrumbStack;
}