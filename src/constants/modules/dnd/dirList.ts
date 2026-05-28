/**
    Classification : Confidential
**/
export const ID_FIELD = 'design_input_requirement_id'

const BASE_API_PATH = 'api/v1/dnd'
const BASE_API_END = 'dir'

export const API_URLS = {
  DIR: {
    BASE: `/${BASE_API_PATH}/${BASE_API_END}`,
    FETCH_ALL: (projectId: string) => `/${BASE_API_PATH}/${BASE_API_END}/all`,
    DELETE: (designInputRequirementId: number) =>
      `/${BASE_API_PATH}/${BASE_API_END}/${designInputRequirementId}`,
  },
}

export const API_ENDPOINTS = {
  FETCH_DIR_BY_ID: (dir_id: number) => `${BASE_API_PATH}/dir/${dir_id}`,
  FETCH_EXECUTION_STAGES: `${BASE_API_PATH}/project-stage/execution-stage/all`,
  FETCH_DIR_LIST: (project_id: number, project_stage_order_id: number) => `${BASE_API_PATH}/dir/all?project_id=${project_id}&project_stage_order_id=${project_stage_order_id}`,
  SAVE_DIR: `${BASE_API_PATH}/dir/`,
  FUNCTIONAL_BLOCK: `${BASE_API_PATH}/functional-block-type/all?status=1`,
  FETCH_DIR_ALL_LIST: (project_id: number) => `${BASE_API_PATH}/dir/all?project_id=${project_id}`,
  FETCH_DIR_BY_CATEGORY: () => `${BASE_API_PATH}/dir/all`,
  FETCH_EXECUTION_STAGE_MAPPER: () => `${BASE_API_PATH}/execution-stage-mapper/all`
}
