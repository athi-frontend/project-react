import { NUMBERMAP } from "@/constants/common"

export const INITIAL_FORM = {
        verification_plan_dir_id: '',
        verification_plan_id: '',
        dir_name: '',
        dir_id: '',
        units_to_be_verified: '',
        item_for_test: [],
        item_for_test_id: '',
        batch_no: '',
        software_version: '',
        jigs_used: [],
        jigs:[],
        acceptance_criteria: '',
        aim: '',
        test_equipments: [],
        equipments: [],
        tool_used: [],
        tools_used: [],
        tools: [],
        parameter_checked: '',
        parameters_checked: '',
        test_value: '',
        test_result: '',
        verification_result: '',
        verification_result_id: 0,
        tested_by: '',
        tested_by_id: '',
        tested_user_id: '',
        tested_date: '',
        tested_on: '',
        documents: [],
        supporting_documents: [],
        documents_to_delete: [],
        create_meta_data: {},
        update_meta_data: {},
        design_input_requirement_id: 0
}

export const REPORT_PLACEHOLDER = {
    ITEM_FOR_TEST: 'Select item for test',
    BATCH_NO: 'Enter SI No/Batch No.',
    SOFTWARE_VERSION: 'Enter software version',
    JIGS: 'Select jigs',
    ACCEPTANCE: 'Enter Acceptance',
    AIM: 'Aim',
    EQUIPMENTS: 'Select test equipment',
    TOOLS: 'Select tools',
    TEST_VALUE: 'Enter test value',
    TEST_RESULT: 'Enter test result',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    VERIFICATION_RESULT: 'Select verification Status',
    TESTED_BY: 'Select Tested by',
    TESTED_ON: 'DD-MM-YYYY'
}

export const KEY_FIELD = {
     JIG_ID: 'id',
    EQUIPMENT_ID: 'equipment_id',
    TOOL_ID: 'tool_id',
    ITEM_FOR_TEST: 'stage_item_id',
    VERIFICATION_RESULT: 'id',
    TESTED_BY: 'id'
}

export const VALUE_FIELD = {
    JIG_NAME: 'name',
     EQUIPMENT_NAME: 'equipment_name',
     TOOL_NAME: 'tool_name',
     ITEM_FOR_TEST: 'item_type',
    VERIFICATION_RESULT: 'name',
    TESTED_BY: 'full_name',
}
export const VERIFICATION = 'verification_plan_id'
export const REPORT_LABEL = {
    DIR_NAME: 'DIR#',
    UNITS: 'No. of Units to be Verified',
    ITEM_FOR_TEST: 'Item for Test',
    BATCH_NO: 'SI. No/Batch No.',
    SOFTWARE_VERSION: 'Software Version (if applicable)',
    JIGS: 'Jigs Used',
    ACCEPTANCE: 'Acceptance Criteria',
    AIM: 'Aim*',
    EQUIPMENTS: 'Test Equipment Used *',
    TOOLS: 'Tool Used *',
    PARAMETERS: 'Parameters Checked',
    TEST_VALUE: 'Test Value*',
    TEST_RESULT: 'Test Result*',
    VERIFICATION_RESULT: 'Verification Result*',
    TESTED_BY: 'Tested By*',
    TESTED_ON: 'Tested On*'
}

export const REPORT_CHANGE = {
     ITEM_TO_TEST: 'item_for_test',
    BATCH_NO: 'batch_no',
    SOFTWARE: 'software_version',
    JIGS: 'jigs_used',
    EQUIPMENTS: 'test_equipments',
    TOOLS: 'tools_used',
    ACCEPTANCE: 'acceptance_criteria',
    AIM: 'aim',
    TEST_VALUE: 'test_value',
    TEST_RESULT: 'test_result',
    VERIFICATION_RESULT: 'verification_result',
    TESTED_BY: 'tested_by',
    TESTED_ON: 'tested_on'
}

export const API_FIELD_KEYS = {
    VERIFICATION_PLAN_DIR_ID: 'verification_plan_dir_id',
    VERIFICATION_PLAN_ID: 'verification_plan_id',
    DIR_NAME: 'dir_name',
    UNITS_TO_BE_VERIFIED: 'units_to_be_verified',
    ITEM_TO_TEST: 'item_for_test',
    BATCH_NO: 'batch_no',
    SOFTWARE_VERSION: 'software_version',
    ACCEPTANCE_CRITERIA: 'acceptance_criteria',
    AIM: 'aim',
    PARAMETERS_CHECKED: 'parameters_checked',
    TEST_VALUE: 'test_value',
    TEST_RESULT: 'test_result',
    JIGS_USED: 'jigs_used',
    TEST_EQUIPMENTS: 'test_equipments',
    TOOLS_USED: 'tools_used',
    VERIFICATION_RESULT: 'verification_result',
    TESTED_BY: 'tested_by',
    TESTED_ON: 'tested_on',
    TESTED_DATE: 'tested_date',
    DOCUMENTS_TO_DELETE: 'documents_to_delete',
    DOCUMENTS_TO_CREATE: 'documents_to_create',
    CREATE_META_DATA: 'create_meta_data',
    UPDATE_META_DATA: 'update_meta_data'
}

export const DATE = "date"

export const VALIDATION_ERRORS = {
  VERIFICATION_PLAN_ID: 'Verification plan ID is required',
  UNITS_TO_BE_VERIFIED: 'Units to be verified is required',
  ITEM_TO_TEST: 'Test Item is required',
  BATCH_NO: 'Batch No is required',
  SOFTWARE_VERSION: 'Software version is required',
  ACCEPTANCE_CRITERIA: 'Acceptance Criteria is required',
  AIM: 'Aim is required',
  TEST_VALUE: 'Test Value is required',
  TEST_RESULT: 'Test Result is required',
  JIGS: 'At least one jig must be selected',
  EQUIPMENTS: 'At least one equipment must be selected',
  TOOLS: 'At least one tool must be selected',
  VERIFICATION_RESULT: 'Verification Result is required',
    TESTED_BY: 'Tested By is required',
    TESTED_ON: 'Tested On Date is required',
}

export const QUERY_KEY = {
    REPORT: 'report',
    REPORT_ALL: 'report_All',
    JIGS: 'Jigs',
    EQUIPMENTS: 'Equipments',
    VERIFICATION_RESULT: 'Verification_result',
    TESTED_BY: 'tested_by',
    ITEM_TO_TEST: 'test_item',
    ITEM_HOOK: 'item_hook',
    USERS: 'users',
}

export const ROUTER_END = (order_id:number, project_id: number) => `/dnd/verification-report/${order_id}/${project_id}`

const API_BASE_PATH = 'api/v1/dnd'
const API_BASE_END = 'verification-report'

export const API_ENDPOINTS = {
    FETCH_REPORT: (verification_plan_id: number) => `${API_BASE_PATH}/${API_BASE_END}/${verification_plan_id}`,
    POST_REPORT: `${API_BASE_PATH}/${API_BASE_END}`,
    FETCH_JIGS: `${API_BASE_PATH}/jigs/all`,
    FETCH_EQUIPMENTS: `${API_BASE_PATH}/equipments/all`,
    FETCH_ITEM_TO_TEST: `${API_BASE_PATH}/design-stage-item/all`,
    FETCH_RESULT: `${API_BASE_PATH}/result/all`,
    FETCH_TESTED_BY: `${API_BASE_PATH}/tesed-users/all`,
    FETCH_USERS: (roleId: number) => `api/v1/organization/users/all?status=${NUMBERMAP.ONE}&role_id=${roleId}`,
    FETCH_ALL_REPORT: (project_id: number) => `${API_BASE_PATH}/verification-report/${project_id}/all`
}

export const SAMPLE_DROPDOWN_DATA = {
  VERIFICATION_RESULT: [
    { id: 1, name: 'Pass' },
    { id: 2, name: 'Fail' },
  ]
};

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_CHANGE='date'
export const TESTED_ON_DATE = 'tested_date'


export const FIELD_LABEL_MAP = {
  aim: 'Aim*',
  test_equipments: 'Test Equipment Used *',
  tools_used: 'Tool Used *',
  test_value: 'Test Value*',
  test_result: 'Test Result*',
  verification_result: 'Verification Result*',
  tested_by: 'Tested By*',
  tested_on: 'Tested On*'
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)


export const FORM_TITLES = {
  VERIFICATION_REPORT: 'Verification Report'
} as const

export const TABLE_TITLES = {
  ITEM_FOR_TEST: 'Item for Test'
} as const

export const TABLE_COLUMNS = {
  S_NO: 'S.No.',
  ITEMS_FOR_TEST: 'Items for Test',
  SL_NO_BATCH_NO: 'SI. No/Batch No.'
} as const

export const TABLE_FIELDS = {
  ID: 'id',
  S_NO: 'sno',
  ITEMS_FOR_TEST: 'items_for_test',
  SL_NO_BATCH_NO: 'sl_no_batch_no'
} as const

export const ITEM_FOR_TEST_COLUMNS = [
  { field: TABLE_FIELDS.S_NO, headerName: TABLE_COLUMNS.S_NO, flex: 1 },
  { field: TABLE_FIELDS.ITEMS_FOR_TEST, headerName: TABLE_COLUMNS.ITEMS_FOR_TEST, flex: 2 },
  { field: TABLE_FIELDS.SL_NO_BATCH_NO, headerName: TABLE_COLUMNS.SL_NO_BATCH_NO, flex: 1 },
]