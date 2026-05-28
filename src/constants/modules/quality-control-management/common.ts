/**
 * Classification: Confidential
 */

const BASE_API_PATH_VENDOR_PURCHASE = 'api/v1/vendor-purchase';
const BASE_API_PATH_QUALITY_CONTROL = 'api/v1/quality-control';
const SANITY_CHECK_BASE_ENDPOINT = `${BASE_API_PATH_QUALITY_CONTROL}/sanity-check-inspection`;

export const API_ENDPOINTS = {
  PURCHASE_ORDERS_ALL: `${BASE_API_PATH_VENDOR_PURCHASE}/purchase-order/all`,
  PURCHASE_ORDER_DETAILS: (purchaseOrderId: number) => `${BASE_API_PATH_VENDOR_PURCHASE}/purchase-order/${purchaseOrderId}`,
  GET_PART_DETAILS: (purchaseOrderId: number, partDetailId: number) =>
    `${SANITY_CHECK_BASE_ENDPOINT}/?purchase_order_id=${purchaseOrderId}&part_detail_id=${partDetailId}`,
};

export const PURCHASE_ORDERS_HOOK = 'purchaseOrders';
export const PURCHASE_ORDER_DETAILS_HOOK = 'purchaseOrderDetails';
export const PART_DETAILS_HOOK = 'partDetails';

