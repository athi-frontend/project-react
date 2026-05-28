import { TASK_MANAGEMENT, API_ENDPOINTS_TM } from '@/constants/modules/task-management/taskManagement'
import {
  ProjectTypeModuleResponse,
  TaskTransitionResponse,
  TaskTransitionRequestPayload,
  CombinedTaskData,
} from '@/types/modules/task-management/taskManagement'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { apiClient } from '@/shared/apiClient'
// @ts-ignore
import { DateTime } from 'luxon'

/**
 * Determines if the request represents "All" modules by comparing against the full set of project type IDs
 */
export const isAllModulesRequest = (
  payload: TaskTransitionRequestPayload,
  projectTypeResponse: ProjectTypeModuleResponse
): boolean => {
  const allProjectTypeIds = Array.from(
    new Set(projectTypeResponse.data.flatMap((module) => module.project_type_id))
  )
  const payloadIdsSet = new Set(payload.project_type_id)
  
  return (
    payload.project_type_id.length === allProjectTypeIds.length &&
    allProjectTypeIds.every((id) => payloadIdsSet.has(id))
  )
}

/**
 * Helper function to transform modules into CombinedTaskData format
 * Extracts common mapping and filtering logic used by both processAllModulesData and processSpecificModulesData
 * 
 * @param modules - Array of modules with module_name and project_type_id
 * @param getTasksForModule - Function that returns tasks for a given module_name
 * @returns Filtered array of CombinedTaskData (modules with non-empty tasks)
 */
const transformModulesToCombinedData = (
  modules: Array<{ module_name: string; project_type_id: number[] }>,
  getTasksForModule: (moduleName: string) => any[]
): CombinedTaskData[] => {
  return modules
    .map(({ module_name, project_type_id }) => ({
      module_name,
      project_type_ids: project_type_id,
      tasks: getTasksForModule(module_name)
    }))
    .filter(module => module.tasks.length > NUMBERMAP.ZERO)
}

/**
 * Processes "All" modules request
 * Since tasks don't include module information, we need to fetch tasks for each module separately
 * This function is called after we've already fetched tasks for each module individually
 */
export const processAllModulesData = (
  projectTypeResponse: ProjectTypeModuleResponse,
  moduleTasksMap: Map<string, TaskTransitionResponse>
): CombinedTaskData[] => {
  return transformModulesToCombinedData(
    projectTypeResponse.data,
    (moduleName) => moduleTasksMap.get(moduleName)?.data ?? []
  )
}

/**
 * Processes specific module request by mapping tasks to the selected module(s)
 * When a specific module is selected, the API already filters tasks by that module's project_type_ids
 * So we just need to find which module(s) match the payload's project_type_ids and return their tasks
 */
export const processSpecificModulesData = (
  projectTypeResponse: ProjectTypeModuleResponse,
  taskTransitionResponse: TaskTransitionResponse,
  payload: TaskTransitionRequestPayload
): CombinedTaskData[] => {
  // Find modules that match the payload's project_type_ids
  const matchingModules = projectTypeResponse.data.filter(({ project_type_id }) =>
    project_type_id.some(typeId => payload.project_type_id.includes(typeId))
  )
  
  // Return modules with their tasks
  // Since the API already filtered tasks by project_type_id, all returned tasks belong to these modules
  return transformModulesToCombinedData(
    matchingModules,
    () => taskTransitionResponse.data // Same tasks for all matching modules
  )
}

/**
 * Formats the combined response with standard structure
 */
export const formatCombinedResponse = (data: CombinedTaskData[]) => {
  return {
    code: NUMBERMAP.TWOHUNDRED,
    status: STATUS.SUCCESS,
    message: TASK_MANAGEMENT.COMBINED_TASK_DATA_FETCH_SUCCESS,
    response_timestamp: DateTime.utc().toISO(),
    description: TASK_MANAGEMENT.COMBINED_TASK_DATA_FETCH_SUCCESS,
    data
  }
}

/**
 * Main function to combine and process task data for specific module requests
 * Note: For "All" requests, use getCombinedTaskData directly which handles it differently
 */
export const combineTaskData = (
  projectTypeResponse: ProjectTypeModuleResponse,
  taskTransitionResponse: TaskTransitionResponse,
  payload: TaskTransitionRequestPayload
) => {
  const combinedData = processSpecificModulesData(projectTypeResponse, taskTransitionResponse, payload)
  return formatCombinedResponse(combinedData)
}

export const getProjectTypeModuleAll = async () => {
  const response = await apiClient.get<ProjectTypeModuleResponse>(
    API_ENDPOINTS_TM.GET_PROJECT_TYPE_MODULE_ALL
  )
  return response.data
}

export const getTaskTransitionTasksAll = async (payload: TaskTransitionRequestPayload) => {
  const response = await apiClient.post<TaskTransitionResponse>(
    API_ENDPOINTS_TM.GET_TASK_TRANSITION_TASKS_ALL,
    payload
  )
  return response.data
}

export const getCombinedTaskData = async (payload: TaskTransitionRequestPayload) => {
  const projectTypeResponse = await getProjectTypeModuleAll()
  
  // Check if this is an "All" request
  const isAllRequest = isAllModulesRequest(payload, projectTypeResponse)
  
  if (isAllRequest) {
    // For "All" request, fetch tasks for each module separately
    // This ensures we can map tasks to their correct modules
    const moduleTasksPromises = projectTypeResponse.data.map(async (module) => {
      const modulePayload: TaskTransitionRequestPayload = {
        project_type_id: module.project_type_id,
        user_id: payload.user_id
      }
      const taskResponse = await getTaskTransitionTasksAll(modulePayload)
      return { moduleName: module.module_name, taskResponse }
    })
    
    const moduleTasksResults = await Promise.all(moduleTasksPromises)
    const moduleTasksMap = new Map<string, TaskTransitionResponse>()
    
    moduleTasksResults.forEach(({ moduleName, taskResponse }) => {
      moduleTasksMap.set(moduleName, taskResponse)
    })
    
    const combinedData = processAllModulesData(projectTypeResponse, moduleTasksMap)
    return formatCombinedResponse(combinedData)
  } else {
    // For specific module request, fetch tasks normally
    const taskTransitionResponse = await getTaskTransitionTasksAll(payload)
    return combineTaskData(projectTypeResponse, taskTransitionResponse, payload)
  }
}
