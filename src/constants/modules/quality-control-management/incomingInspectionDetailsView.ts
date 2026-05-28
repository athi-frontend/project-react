import { NUMBERMAP } from '@/constants/common'

export const INCOMING_INSPECTION_DETAILS_VIEW = {
  ROUTES: {
    BACK: '/quality-control-management/incoming-inspection',
  },
  SLUGS: {
    UNIT: 'unit',
    BATCH: 'batch',
  },
  TABLE_FIELDS: {
    SNO: 'sno',
    PART_NUMBER: 'part_number',
    QUANTITY: 'quantity',
    SAFETY_CRITICAL: 'safety_critical',
    BATCH_UNIT: 'batch_unit',
    AQL: 'aql',
    HARDWARE_SOFTWARE: 'hardware_software',
    STATUS: 'status',
    ACTIONS: 'actions',
    GOODS_INWARD_DETAIL_ID: 'goods_inward_detail_id',
  },
  TYPOGRAPHY: {
    VARIANT_BODY2: 'body2',
    COMPONENT_SPAN: 'span',
  },
  THEME_COLORS: {
    SUCCESS_MAIN: 'success.main',
    ERROR_MAIN: 'error.main',
    TEXT_PRIMARY: 'text.primary',
  },
  GRID: {
    HEADER_SPACING: NUMBERMAP.FOUR,
    HEADER_MARGIN_LEFT: NUMBERMAP.TWO,
    HEADER_MARGIN_TOP: NUMBERMAP.TWO,
  },
  TABLE: {
    FLEX: {
      HALF: NUMBERMAP.HALF,
      ONE: NUMBERMAP.ONE,
      EIGHT_TENTH: NUMBERMAP.ONE,
      ONE_POINT_TWO: NUMBERMAP.ONE,
    },
  },
} as const

