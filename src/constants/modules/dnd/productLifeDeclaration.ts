export const API_ENDPOINTS = {
    PRODUCT_LIFE_DECLARATION_BY_ID:  '/api/v1/dnd/product-lifetime/',
    };

export const PRODUCT_LIFE_DECLARATION_KEYS = {
  FETCH: 'fetchProductDeclaration',
  POST: 'postProductDeclaration'
} 

export const ZERO='0';
export const CUSTOM_ALERT='customAlert';
export const ERROR='error';

export const DELETE="delete";
export const PRODUCT_LIFE_DECLARATION={
    SUCCESS: 'Product Life Declaration successfully updated.',
    FAILURE: 'Failed to update Product Life Declaration.',
    NOT_FOUND: 'Product Life Declaration not found.',
    INVALID_DATA: 'Invalid data provided for Product Life Declaration.',
    UNAUTHORIZED: 'Unauthorized access to Product Life Declaration.',
    FORBIDDEN: 'Forbidden access to Product Life Declaration.',
    FETCH_HOOK:'fetchProductDeclaration',
    POST_HOOK: 'postProductDeclaration',
    CANCEL: 'Cancel',
    SAVE: 'Save',
    LIFETIME :"Lifetime calculation criteria",
    CONCLUSION: 'Conclusion',
    INPUT_TEXT: "Input Text",
    PART_NO: "Part No.",
    ENTER_PART_NO: "Enter Part No.",
    COLUMN: "column",
    DESCRIPTION: "Description",
    REMARKS: "Remarks",
    PATH: '/dnd/project/list',
    TITLE: 'Product Life Declaration',
    LABEL: "Declared life for the product",
    DIR_REF: "DIR Ref",
    PATHNAME: "#",
    NULL: 'null',
    CURRENT_COLOR: 'currentColor',
    ERROR: 'error',
    SMALL: 'small',
    SIZE: "20",
    PRIMARY: 'primary',
    ACTION: 'Action',
    ACTIONS: 'actions',
    FLEX: "flex",
}


export const PRODUCT_DECLARATION_COLUMNS = {
  SNO: {
    FIELD: 'sno',
    HEADER: 'S.No.',
  },
  PART_NO: {
    FIELD: 'partNo',
    HEADER: 'Part No.',
  },
  DESCRIPTION: {
    FIELD: 'description',
    HEADER: 'Description',
  },
  REMARKS: {
    FIELD: 'remarks',
    HEADER: 'Remarks',
  },
}

export const MODAL={
  PART_NO_REQUIRED: 'Part No. is required.',
  DESCRIPTION_REQUIRED: 'Description is required.',
  REMARKS_REQUIRED: 'Remarks is required.',
  COLUMN: "column",
  PARTNO: 'partNo',
  DESCRIPTION: 'description',
  REMARKS: 'remarks',
}