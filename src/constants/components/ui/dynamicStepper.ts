export const DYNAMIC_STEPPER_CONSTANTS = {
  // Section titles
  SECTION_TITLES: {
    PROJECT_DETAILS: 'Project Details',
    PLAN: 'Plan',
    DIG: 'DIG',
    DEVELOPMENT: 'Development',
    DESIGN_OUTPUT: 'Design Output',
    RECORD_GENERATION: 'Record Generation',
    OTHER: 'Other',
  },

  // Hierarchy patterns
  HIERARCHY_PATTERNS: {
    PROJECT_DETAILS: '2.',
    INFO_SECTION: '2.3',
    PLAN_SECTION: '1.4',
    DIG_SECTION: '1.12',
    DEVELOPMENT_SECTION: '1.16',
    DESIGN_OUTPUT_SECTION: '1.21',
  },

  // URL patterns
  URL_PATTERNS: {
    BASE_PATH: '/dnd/',
    DND_PREFIX: 'dnd/',
    RECORD_GENERATION_PATH: '/dnd/record-generation/',
    PROJECT_DETAILS_PREFIX: 'project-details/',
  },

  // Default values
  DEFAULTS: {
    SECTION_TITLE: 'Section',
    PATH_SEPARATOR: '-',
    URL_DASH: '-',
  },

  // Regex patterns
  REGEX: {
    SPACES: /\s+/g,
  },

  // Hierarchy separators
  SEPARATORS: {
    HIERARCHY: '.',
  },
} as const 