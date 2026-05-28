import { VendorCriteria } from "@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaTable";
import { NUMBERMAP } from "@/constants/common";
import { ReactNode } from "react";

/**
    Classification : Confidential
**/
const BASE_API_PATH = 'api/v1';
const PRODUCTION_BASE_API_PATH = 'production';
const VENDOR_PURCHASE_BASE_API_PATH = 'vendor-purchase';
export const API_ENDPOINTS = {
    VENDOR_TYPES_ALL: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/vendor-types/all`,
    VENDOR_LIST_ALL: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/vendor-list/all`,
    VENDOR_AGREEMENT_CHECKLIST_ALL: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/agreement-checklist/all`,
    VENDOR_AGREEMENT_CHECKLIST_BY_ID: (id: string) => `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/agreement-checklist/${id}`,
    VENDOR_AGREEMENT_CHECKLIST_UPSERT: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/agreement-checklist/`,
    VENDOR_AGREEMENT_CHECKLIST_LIST: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/vendor-agreement-checklist/all`,
    PART_CATEGORY_ALL: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/part-category/all`,
    PART_TYPE_ALL: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/part-category-type/all`,
    PART_SUBCATEGORY_TYPE_ALL: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/part-subcategory-type/all`,
    PART_CATEGORY_SUBCLASS_ALL: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/part-category-subclass/all`,
    VENDOR_SELECTION_CRITERIA_ALL: `${BASE_API_PATH}/${PRODUCTION_BASE_API_PATH}/vendor-selection-criteria/all`,
    VENDOR_RE_EVALUATION_FREQUENCY_ALL: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/vendor-reevaluation-frequency-type/all`,
    PURCHASE_ORDER_ALL: `${BASE_API_PATH}/${VENDOR_PURCHASE_BASE_API_PATH}/purchase-order/all`,
};

export const VENDOR_TYPES_HOOK = 'vendorTypes';
export const VENDOR_LIST_HOOK = 'vendorList';
export const VENDOR_AGREEMENT_CHECKLIST_HOOK = 'vendorAgreementChecklist';
export const VENDOR_AGREEMENT_CHECKLIST_BY_ID_HOOK = 'vendorAgreementChecklistById';
export const VENDOR_AGREEMENT_CHECKLIST_LIST_HOOK = 'vendorAgreementChecklistList';
export const PART_CATEGORY_HOOK = 'partCategory';
export const PART_SUBCATEGORY_TYPE_HOOK = 'partSubcategoryType';
export const PART_CATEGORY_SUBCLASS_HOOK = 'partCategorySubclass';
export const VENDOR_SELECTION_CRITERIA_HOOK = 'vendorSelectionCriteria';
export const VENDOR_RE_EVALUATION_FREQUENCY_HOOK = 'vendorReEvaluationFrequency';
export const PURCHASE_ORDER_ALL_HOOK = 'purchaseOrderAll';

export const ALERT_MESSAGES_COMMON = {
  SUCCESS: "success",
  FAILED: "failed", 
  CUSTOM_ALERT: "customAlert",
  DELETE: "delete",
  ICON_ERROR: "error",
  DELETE_CONFIRMATION_TITLE: "Delete Confirmation",
  DELETE_CONFIRMATION_ICON: "warning",
  SUCCESS_TITLE: "Success",
  SUCCESS_ICON: "success",
};


export const COMMON_COLUMNS = (criteriaColumnRenderCell: (params: { row: VendorCriteria }) => ReactNode) => ([
  {
    field: 'sno',
    headerName: 'S.No',
    flex: NUMBERMAP.HALF,
    sortable: false,
    filterable: false,
    renderCell: (params: { row: VendorCriteria }) => {
      const row = params.row;
      const isParent = row.isParent;
      if (isParent) {
        return row.sno
      }
      return ''
    },
  },
  {
    field: 'criteria',
    headerName: 'Criteria',
    flex: NUMBERMAP.ONE,
    sortable: false,
    filterable: false,
    renderCell: criteriaColumnRenderCell,
  },
  {
    field: 'requirement',
    headerName: 'Requirement',
    flex: NUMBERMAP.HALF,
    sortable: false,
    filterable: false,
    renderCell: (params: { row: VendorCriteria }) => {
      const row = params.row;
      const isParent = row?.isParent;
      if (isParent) {
        // If parent has requirement data, show it, otherwise show dash
        return row.requirement && row.requirement !== '-' ? row.requirement : '-';
      }
      return params.value ?? ''
    },
  }
])