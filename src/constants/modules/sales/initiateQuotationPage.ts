import type { ProductDetailForm, QuotationFormState } from '@/types/modules/sales/quotation';
import type { ErrorItem } from '@/types/validation';
import { NUMBERMAP } from '@/constants/common';

export const INITIATE_QUOTATION_PAGE_STRINGS = {
    GENERAL: {
        CREATE_ID: 'create',
        ROUTE: '/sales/initiate-quotation',
        PAGE_TITLE: 'Initiate Quotation',
        PRODUCT_DETAILS_TITLE: 'Product Details',
        UPLOAD_SUBHEADER: 'Upload Documents',
    },
    BUTTONS: {
        CANCEL: 'Cancel',
        SAVE: 'Save',
    },
    LABELS: {
        QUOTATION_NUMBER: 'Quotation Number*',
        CUSTOMER_NAME: 'Customer Name*',
        ADDRESS: 'Address*',
        FEATURES_AND_APPLICATION: 'Features and Application*',
        CONTACT_PERSON_NAME: 'Contact Person Name*',
        EMAIL_ID: 'Email ID*',
        PRODUCT_SUPPLY: 'Product Supply Consists of*',
        QUOTATION_DATE: 'Quotation Date*',
        STATUS: 'Status*',
        TERMS_AND_CONDITIONS: 'Terms and Conditions*',
        TERMS_AND_CONDITIONS_DESCRIPTION:
            'Confirm the below mentioned details are included in the Quotation',
        PRODUCT: 'Product*',
        MODELS: 'Models*',
        QUANTITY: 'Quantity*',
        PRICE: 'Price*',
    },
    PLACEHOLDERS: {
        QUOTATION_NUMBER: 'Enter Quotation Number',
        CUSTOMER_NAME: 'Select Customer Name',
        ADDRESS: 'Enter Address',
        FEATURES_AND_APPLICATION: 'Input Text',
        CONTACT_PERSON_NAME: 'Enter Contact Person Name*',
        EMAIL_ID: 'Enter Email ID',
        PRODUCT_SUPPLY: 'Input Text',
        STATUS: 'Select Status',
        PRODUCT: 'Select Product',
        MODELS: 'Select Models',
        QUANTITY: 'Enter Quantity',
        PRICE: 'Enter Price',
    },
    ERRORS: {
        QUOTATION_NUMBER: 'Quotation Number is required',
        CUSTOMER_NAME: 'Customer Name is required',
        ADDRESS: 'Address is required',
        FEATURES_AND_APPLICATION: 'Features and Application is required',
        CONTACT_PERSON_NAME: 'Contact Person Name is required',
        EMAIL_ID: 'Email ID is required',
        INVALID_EMAIL_ID: 'Please enter a valid email address',
        PRODUCT_SUPPLY: 'Product Supply is required',
        QUOTATION_DATE: 'Quotation Date is required',
        STATUS: 'Status is required',
        PRODUCTS: 'At least one product is required',
        TERMS_AND_CONDITIONS: 'Terms and Conditions must be accepted',
        PRODUCT_ID: 'Product is required',
        MODEL_ID: 'Model is required',
        QUANTITY: 'Quantity is required',
        INVALID_QUANTITY: 'Quantity must be a whole number',
        QUANTITY_MUST_BE_POSITIVE: 'Quantity must be greater than 0',
        PRICE: 'Price is required',
        INVALID_PRICE: 'Price must be a positive number with maximum 2 decimal places',
        PRICE_MUST_BE_POSITIVE: 'Price must be greater than 0',
        DUPLICATE_PRODUCT_MODEL: 'This Product and Model combination already exists. Please select a different combination.',
    },
    TABLE_COLUMNS: {
        S_NO: 'S.No.',
        PRODUCT_NAME: 'Product Name',
        MODEL_NAME: 'Models',
        QUANTITY: 'Quantity',
        PRICE: 'Price',
        ACTIONS: 'Actions',
    },
    MODAL: {
        TITLE_ADD: 'Add Product Details',
        TITLE_EDIT: 'Edit Product Details',
    },
    ALERTS: {
        DUPLICATE_PRODUCT_TITLE: 'Duplicate Product',
        DUPLICATE_PRODUCT_CONFIRM_BUTTON: 'OK',
    },
};

export const INITIATE_QUOTATION_DEFAULT_FORM: QuotationFormState = {
    quotation_id: null,
    quotation_number: '',
    customer_type: '',
    customer_id: null,
    customer_name: '',
    address: '',
    feature_and_application: '',
    contact_person_name: '',
    email_id: '',
    product_supply: '',
    quotation_date: null,
    status: null,
    terms_and_condition: 0,
};

export const INITIATE_QUOTATION_DEFAULT_PRODUCT: ProductDetailForm = {
    product_id: null,
    product_name: '',
    model_id: null,
    model_name: '',
    quantity: '',
    price: '',
    product_status: 1,
};

export const INITIATE_QUOTATION_DROPDOWN_KEYS = {
    CUSTOMER: {
        KEY: 'customer_id',
        VALUE: 'customer_name',
    },
    STATUS: {
        KEY: 'status_id',
        VALUE: 'status_name',
    },
    PRODUCT: {
        KEY: 'product_id',
        VALUE: 'product_name',
    },
    MODEL: {
        KEY: 'model_id',
        VALUE: 'model_name',
    },
} as const;

export const INITIATE_QUOTATION_TABLE_FIELDS = {
    S_NO: 'sno',
    PRODUCT_NAME: 'product_name',
    MODEL_NAME: 'model_name',
    QUANTITY: 'quantity',
    PRICE: 'price',
    ACTIONS: 'actions',
} as const;

export const INITIATE_QUOTATION_CONTEXT_TYPE = 'quotation';

export const INITIAL_ERRORS = {
    quotation_number: '',
    customer_name: '',
    address: '',
    feature_and_application: '',
    contact_person_name: '',
    email_id: '',
    product_supply: '',
    quotation_date: '',
    status: '',
    products: '',
    terms_and_condition: '',
};

export const initiateQuotationErrorItems: ErrorItem[] = [
    {
        field: 'quotation_number',
        errormessage: INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.QUOTATION_NUMBER,
        type: 'string',
        errorKey: 'quotation_number',
    },
    {
        field: 'address',
        errormessage: INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.ADDRESS,
        type: 'string',
        errorKey: 'address',
    },
    {
        field: 'feature_and_application',
        errormessage: INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.FEATURES_AND_APPLICATION,
        type: 'string',
        errorKey: 'feature_and_application',
    },
    {
        field: 'contact_person_name',
        errormessage: INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.CONTACT_PERSON_NAME,
        type: 'string',
        errorKey: 'contact_person_name',
    },
    {
        field: 'product_supply',
        errormessage: INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.PRODUCT_SUPPLY,
        type: 'string',
        errorKey: 'product_supply',
    },
];

/**
 * Custom validation function for quotation form fields
 * Validates fields that require custom logic beyond the standard validation utility
 * @param form - The quotation form state
 * @param products - Array of product details
 * @param errors - Current errors object to update
 * @returns Updated errors object with custom validation errors
 */
export const applyCustomQuotationValidation = (
    form: QuotationFormState,
    products: ProductDetailForm[],
    errors: typeof INITIAL_ERRORS
): typeof INITIAL_ERRORS => {
    const newErrors = { ...errors };

    // Custom validation for quotation_date
    if (!form.quotation_date) {
        newErrors.quotation_date = INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.QUOTATION_DATE;
    }

    // Custom validation for status
    if (!form.status) {
        newErrors.status = INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.STATUS;
    }

    // Custom validation for products (check for active products with product_status === 1)
    const activeProducts = products.filter((product) => product.product_status === NUMBERMAP.ONE);
    if (activeProducts.length === NUMBERMAP.ZERO) {
        newErrors.products = INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.PRODUCTS;
    }

    // Custom validation for terms_and_condition
    if (!form.terms_and_condition) {
        newErrors.terms_and_condition = INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.TERMS_AND_CONDITIONS;
    }

    return newErrors;
};