import { HRLIST, SECTION_LABELS, SECTION_PATHS } from "./stepper"

export const generateBreadcrumbTree = (projectId: string) => ({'dnd':{
  name: "Design and Development",
  path: `/dnd/project`,
  child: [
    {
      name: SECTION_LABELS.INFO_SECTION,
      path: `/dnd/project/${projectId}`, // Info Section uses /dnd/project/:id
      child: [],
    },
    {
      name: SECTION_LABELS.MARKET_STUDY,
      path: `${SECTION_PATHS.MARKET_STUDY}${projectId}`, // /dnd/market-study/:id
      child: [],
    },
    {
      name: SECTION_LABELS.HLD,
      path: `${SECTION_PATHS.HLD}${projectId}`,
      child: [],
    },
    {
      name: SECTION_LABELS.FEASIBILITY_STUDY,
      path: `${SECTION_PATHS.FEASIBILITY_STUDY}${projectId}`,
      child: [],
    },
    {
      name: SECTION_LABELS.PND,
      path: `${SECTION_PATHS.PND}${projectId}`,
      child: [
        {
          name: SECTION_LABELS.PND_REVIEW,
          path: `${SECTION_PATHS.PND_REVIEW}${projectId}`,
          child: [],
        },
      ],
    },
  ],
},'hr':{
  name: "HR Competency & Skills",
  path: `/dnd/project`,
  child:HRLIST.map((item) => ({
    name: item.label,
    path: item.path, // Replace :id with actual projectId
    child: [],}))
}})

export  const URL_PATTERNS= {
    DND_BASE_PATH: 'dnd',
    PROJECT_DETAILS_BASE_PATH : 'project-details',
    HR_BASE_PATH : 'hr',
    REGULATION_BASE_PATH : 'regulation',
    USER_BASE_PATH : 'user',
    RISK_MANAGEMENT_BASE_PATH : 'risk-management',
    QUALITY_MANAGEMENT_BASE_PATH  : 'quality-control-management',
    INFRASTRUCTURE_MANAGEMENT_BASE_PATH :'infrastructure-management',
    VENDOR_BASE_PATH : 'vendor-management',
    PRODUCTION_BASE_PATH : 'production',
    PURCHASE_BASE_PATH : 'purchase',
    SALES_BASE_PATH : 'sales',
  }


export const exception_urls = ['installation-proceture']

export const RECORD_GENERATION_TITLE = 'Record Generation'

export const RECORD_GENERATION = 'record-generation'

export const EDIT = 'edit'

export const CREATE = 'create'

export const common_action_words = ['create', 'edit', 'view', 'list']

export const skipSegments = ['registration','list', 'view'];
// Exception URLs for edit-enabled modules - don't show Edit breadcrumb for these paths
export const exception_urls_edit_enabled = ['details', 'view', 'profile'];