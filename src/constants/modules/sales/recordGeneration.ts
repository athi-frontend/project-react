/**
 * Classification : Confidential
 **/



export const CONTEXT_TYPE_SALES = 'sales'
export const RECORD_GENERATION = 'Record Generation'

export const ID = "id"

export const RECORD_GENERATION_MODULES = {
    SALES: "sales"
}


  // Title mapping for each form
  export const formTitles: Record<string, string> = {
    "sales-quotation": "Sales Quotation",
    "sales-forecast": "Sales Forecast",
    "order-acknowledgement": "Order Acknowledgement",
    "delivery-instructions": "Delivery Instructions",
    "customer-feedback-form": "Customer Feedback Form",
  };


  export const formIds = {
    SALES_QUOTATION : 'sales-quotation',
    SALES_FORECAST : 'sales-forecast',
    ORDER_ACKNOWLEDGEMENT : 'order-acknowledgement',
    DELIVERY_INSTRUCTIONS : 'delivery-instructions',
    CUSTOMER_FEEDBACK_FORM : 'customer-feedback-form',
  }

  // Common table constants
  export const TABLE_CONSTANTS = {
    COMMON: {
      SNO_HEADER: "S.No.",
      VIEW_HEADER: "View",
      VIEW_FILES_LINK: "View Files",
      SNO_FIELD: "sno",
      ACTION_FIELD: "action",
    },
    SALES_QUOTATION: {
      ID_FIELD: "quotation_id",
      QUOTATION_NUMBER_HEADER: "Quotation No",
      QUOTATION_DATE_HEADER: "Quotation Date",
      QUOTATION_NUMBER_FIELD: "quotation_number",
      QUOTATION_DATE_FIELD: "quotation_date",
    },
    ORDER_ACKNOWLEDGEMENT: {
      ID_FIELD: "order_acknowledgement_id",
      QUOTATION_NUMBER_HEADER: "Quotation No",
      ACKNOWLEDGEMENT_DATE_HEADER: "Acknowledgement Date",
      QUOTATION_NUMBER_FIELD: "quotation_number",
      ORDER_DATE_FIELD: "order_date",
    },
    DELIVERY_INSTRUCTIONS: {
      ID_FIELD: "delivery_dispatch_id",
      QUOTATION_NUMBER_HEADER: "Quotation No",
      ACKNOWLEDGEMENT_DATE_HEADER: "Acknowledgement Date",
      QUOTATION_NUMBER_FIELD: "quotation_number",
      ACKNOWLEDGEMENT_DATE_FIELD: "order_date",
    },
    CUSTOMER_FEEDBACK: {
      ID_FIELD: "customer_feedback_id",
      PRODUCT_NO_HEADER: "Product No",
      MODEL_HEADER: "Model",
      PRODUCT_NAME_FIELD: "product_name",
      MODEL_FIELD: "product_type",
    },
  } as const;