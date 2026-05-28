const GRID_SIZE_SIDEBAR = 3
const GRID_SIZE_MAIN_CONTENT = 9

const buildFunctionalBlockTitle = (blockTitle: string = '') =>
  'Functional Blocks' + (blockTitle ? ' - ' + blockTitle : '');

export const USER_ERRORS = {
  INVALID_EDIT_PARAMETERS: 'Cannot edit: Missing or invalid module details.',
  INVALID_PARENT_OR_SUB_BLOCK_ID:
    'Cannot proceed: Invalid parent or sub-module ID.',
  INVALID_BLOCK_ID: 'Cannot proceed: Invalid module ID.',
  INVALID_SAVE_STATE_ADDING: 'Cannot add: No parent module selected.',
  INVALID_PARENT_ID: 'Cannot add: Invalid parent module ID.',
  INVALID_REMOVE_PARAMETERS:
    'Cannot delete: Missing or invalid module details.',
  INVALID_DELETE_CALL: 'Cannot delete: Invalid module type.',
  FAILED_EDIT_ITEM: 'Failed to edit module: ',
  FAILED_SAVE_ITEM: 'Failed to save module: ',
  DELETING_ITEM: 'Failed to delete module: ',
  MODULE_ALREADY_EXISTS:
    'This module name is already existed. Please choose a different name.',
  SUB_MODULE_ALREADY_EXISTS:
    'This sub-module name is already existed. Please choose a different name.',
  FAILED_UPSERT_MAIN_BLOCK: 'Failed to save main module. Please try again.',
  FAILED_UPSERT_SUB_BLOCK: 'Failed to save sub-module. Please try again.',
  FAILED_DELETE_MAIN_BLOCK: 'Failed to delete main module. Please try again.',
  FAILED_DELETE_SUB_BLOCK: 'Failed to delete sub-module. Please try again.',
  INVALID_SAVE_STATE: 'Select a valid module or sub-module to save.',
  UNEXPECTED_ERROR: 'An unexpected error occurred.',
}

export const FUNCTIONAL_BLOCK_CONSTANTS = {
  GENERAL: {
    ROOT_ID: 'root',
    EMPTY_STRING: '',
    INITIAL_STATE_FALSE: false,
    INITIAL_STATE_NULL: null,
    INITIAL_STATE_UNDEFINED: undefined,
    ERROR: 'Unknown error',
    OBJECT: 'object',
    MESSAGE: 'message',
    STRING: 'string',
    MAINBLOCK: 'Invalid main block ID',
    SUBBLOCK: 'Invalid sub block ID',
    COLOR: { color: 'red', marginBottom: '10px' },
    CUSTOM_ALERT: 'customAlert',
    SOMETHING_WENT_WRONG: 'Something went Wrong!',
    ICON_ERROR: 'error',
    SUCCESS: 'success',
    DELETE: 'delete',
  },

  FORMTITLES: {
    FORM_TITLE_ADD_NEW_ITEM: buildFunctionalBlockTitle,
    FORM_TITLE_EDIT_MAIN_BLOCK: buildFunctionalBlockTitle,
    FORM_TITLE_EDIT_SUB_BLOCK: buildFunctionalBlockTitle,
  },

  ERRORS: {
    ERROR_TITLE_REQUIRED: 'Title is required',
    ERROR_DESCRIPTION_REQUIRED: 'Description is required',
    ERROR_MAIN_BLOCK_ID_UNDEFINED: 'Main block ID is undefined',
    ERROR_SUB_BLOCK_ID_UNDEFINED: 'Sub-block ID is undefined',
    ERROR_INVALID_EDIT_PARAMETERS: 'Invalid Parameters for Edit',
    ERROR_NO_SUB_BLOCK_DATA: 'No subBlockData returned',
    ERROR_NO_MAIN_BLOCK_DATA: 'No mainBlockData returned',
    ERROR_EDIT_MENU_ITEM: 'Error in Edit Menu Item',
    ERROR_INVALID_SAVE_STATE: 'Please Select the valid Module to save',
    ERROR_INVALID_PARENT_OR_SUB_BLOCK_ID: 'Invalid parent or sub block ID',
    ERROR_INVALID_BLOCK_ID: 'Invalid block ID',
    ERROR_INVALID_SAVE_STATE_ADDING: 'Invalid save state for adding item',
    ERROR_INVALID_PARENT_ID: 'Invalid parent ID',
    ERROR_INVALID_REMOVE_PARAMETERS: 'Invalid parameters for Remove Item',
    ERROR_INVALID_DELETE_CALL: 'Invalid delete call',
    ERROR_DELETING_ITEM: 'Error deleting item',
    ERROR_SAVING_ITEM: 'Error saving item',
    ERROR_FAILED_UPSERT_MAIN_BLOCK: 'Please Add the valid Module',
    ERROR_FAILED_MODULE_EXISTED: 'Module Already Existed',
    ERROR_FAILED_UPSERT_SUB_BLOCK: 'Please Select the Valid Sub Module',
    ERROR_FAILED_DELETE_MAIN_BLOCK: 'Please Delete Valid Main Module',
    ERROR_FAILED_DELETE_SUB_BLOCK: 'Please Delete Valid Sub Module',
    ERROR_FAILED_EDIT_ITEM: 'Failed to edit item',
    ERROR_FAILED_SAVE_ITEM: 'Failed to save item',
  },

  BUTTONLABELS: {
    BUTTON_LABEL_CANCEL: 'Cancel',
    BUTTON_LABEL_SAVE: 'Save',
  },

  INPUTFIELDS: {
    INPUT_LABEL_TITLE: 'Title*',
    INPUT_PLACEHOLDER_TITLE: 'Enter Title',
    INPUT_LABEL_DESCRIPTION: 'Description*',
    INPUT_PLACEHOLDER_DESCRIPTION: 'Enter Description',
  },

  TOOLTIPS: {
    TOOLTIP_TITLE_ADD_ITEM: 'Add item',
    TOOLTIP_TITLE_REMOVE: 'Remove',
    TOOLTIP_TITLE_EDIT: 'Edit',
  },

  SIZES: {
    SIZE_SMALL: 'small',
    GRID_SIZE_SIDEBAR: GRID_SIZE_SIDEBAR,
    GRID_SIZE_MAIN_CONTENT: GRID_SIZE_MAIN_CONTENT,
  },

  DIALOG: {
    DIALOG_TITLE_CONFIRM_DELETION: 'Confirm Deletion',
    DIALOG_ARIA_LABEL_TITLE: 'alert-dialog-title',
    DIALOG_ARIA_LABEL_DESCRIPTION: 'alert-dialog-description',
    DIALOG_CONTENT_DELETE_CONFIRMATION_PREFIX:
      'Are you sure you want to delete this ',
    DIALOG_CONTENT_MAIN_BLOCK: 'main block',
    DIALOG_CONTENT_SUB_BLOCK: 'sub-block',
    DIALOG_BUTTON_COLOR_PRIMARY: 'primary',
    DIALOG_BUTTON_LABEL_NO: 'No',
    DIALOG_BUTTON_LABEL_YES: 'Yes',
  },

  PROPERTYKEYS: {
    PROPERTY_KEY_CHILD: 'child',
    PROPERTY_KEY_MENU: 'menu',
  },

  API: {
    ENDPOINTS: {
      API_BASE_PATH_FUNCTIONAL_BLOCK: '/api/v1/dnd/functional-block',
      API_SUB_PATH_MAIN_BLOCK: '/main-block',
      API_SUB_PATH_SUB_BLOCK: '/sub-block',
    },
    STATUSCODES: {
      STATUS_CODE_SUCCESS: 200,
      STATUS_CODE_CREATED: 201,
    },
    ERRORS: {
      ERROR_FETCH_FUNCTIONAL_BLOCKS: 'Failed to fetch functional blocks',
      ERROR_FETCH_MAIN_BLOCK: 'Failed to fetch main block',
      ERROR_FETCH_SUB_BLOCK: 'Failed to fetch sub-block',
      ERROR_UPSERT_MAIN_BLOCK: 'Failed to upsert main block',
      ERROR_UPSERT_SUB_BLOCK: 'Failed to upsert sub-block',
      ERROR_DELETE_MAIN_BLOCK: 'Failed to delete main block',
      ERROR_DELETE_SUB_BLOCK: 'Failed to delete sub-block',
    },
    LOGS: {
      LOG_NO_MAIN_BLOCK_DATA: 'No main block data returned for blockId',
      LOG_NO_SUB_BLOCK_DATA: 'No sub-block data returned for subBlockId',
    },
  },

  QUERYKEYS: {
    QUERY_KEY_FUNCTIONAL_BLOCKS: 'functionalBlocks',
    QUERY_KEY_MAIN_BLOCK: 'mainBlock',
    QUERY_KEY_SUB_BLOCK: 'subBlock',
  },

  QUERIES: {
    UPSERT_MAIN_BLOCK: 'Error upserting main block:',
    UPSERT_SUB_BLOCK: 'Error upserting sub-block:',
    DELETE_MAIN_BLOCK: 'Error deleting main block:',
    DELETE_SUB_BLOCK: 'Error deleting sub-block:',
  },

  DEFAULTS: {
    DEFAULT_PRODUCT_NAME: 'Unknown Product',
    DEFAULT_BLOCK_NAME: 'Untitled Block',
    DEFAULT_SUB_BLOCK_NAME: 'Untitled Subblock',
  },

  UITEXT: {
    TEXT_LOADING: 'Loading...',
    TEXT_ERROR_PREFIX: 'Error: ',
    TEXT_NO_FUNCTIONAL_BLOCKS: 'No functional blocks available.',
    TEXT_LOADING_ITEM: 'Loading item...',
  },
} as const


// Field label map for validation focus
export const FIELD_LABEL_MAP = {
  title: 'Title*',
  description: 'Description*',
}

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)

