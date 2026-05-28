/**
 * Classification : Confidential
 **/

export const RECORD_GENERATION_MODULES = {
  QUALITY_CONTROL_MANAGEMENT: 'quality-control-management',
} as const;

// Title mapping for each form
export const FORM_TITLES: Record<string, string> = {
  "goods-inward": "Goods Inward",
  "incoming-inspection": "Incoming Inspection",
  "deviation-note": "Deviation Note",
};

export const FORM_IDS = {
  GOODS_INWARD: 'goods-inward',
  INCOMING_INSPECTION: 'incoming-inspection',
  DEVIATION_NOTE: 'deviation-note',
} as const;

// Common table constants
export const TABLE_CONSTANTS = {
  COMMON: {
    SNO_HEADER: "S.No.",
    VIEW_HEADER: "View",
    HYPERLINK_TEXT: "View files",
    SNO_FIELD: "sno",
    ACTION_FIELD: "action",
  },
  GOODS_INWARD: {
    ID_FIELD: "goods_inward_id",
    PO_HEADER: "PO",
    PO_FIELD: "purchase_order_number",
  },
  INCOMING_INSPECTION: {
    ID_FIELD: "incoming_inspection_results_id",
    PO_HEADER: "PO No.",
    PART_NO_HEADER: "Part No.",
    PO_FIELD: "purchase_order_number",
    PART_NUMBER_FIELD: "part_number",
  },
} as const;

