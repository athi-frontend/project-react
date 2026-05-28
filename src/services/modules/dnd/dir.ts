import { apiClient } from '@/shared/apiClient'
import { API_URLS, API_ENDPOINTS } from '@/constants/modules/dnd/dirList'
import { NUMBERMAP } from '@/constants/common';

/**
    Classification : Confidential
**/
// Fetch a single DIR by dir_id
export const fetchDir = async (dir_id: number): Promise<any> => {
  /**
     * Function Name: fetchDir
     * Params: dir_id
     * Description: fetch single DIR details by dir_id,
     * Author: Prithiviraj,
     * modified: 23-08-2025,
     * Classification : Confidential
    **/
  const response = await apiClient.get(API_ENDPOINTS.FETCH_DIR_BY_ID(dir_id));
  // Return the complete response data to include meta_info
  return response.data;
};


// Fetch list of DIRs by project_id and project_stage_order_id
export const fetchDirList = async (project_id: number, project_stage_order_id: number): Promise<any[]> => {
  /**
     * Function Name: fetchDirList
     * Params: project_id, project_stage_order_id
     * Description: instead of response.data.data return response.data to include meta_info,
     * Author: Prithiviraj,
     * modified: 25-08-2025,
     * Classification : Confidential
    **/
  const response = await apiClient.get(API_ENDPOINTS.FETCH_DIR_LIST(project_id, project_stage_order_id));
  return response.data;
};

export const fetchAllDirList = async (project_id: number): Promise<any[]> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_DIR_ALL_LIST(project_id));
  return response.data;
};

export const fetchDirListByCategory = async (project_id: number, dir_category: string[]): Promise<any[]> => {
  /**
   * Function Name: fetchDirListByCategory
   * Params: project_id, dir_category (array of category IDs)
   * Description: Fetch DIR list filtered by dir_category values using query parameters
   * If no category is selected, only project_id parameter is included
   * Author: Prithiviraj,
   * modified: 30-12-2025,
   * Classification : Confidential
  **/
  const params: any = {
    project_id: project_id,
  };
  
  if (dir_category && dir_category.length > NUMBERMAP.ZERO) {
    const raw = dir_category.join(',');
    const encoded = encodeURIComponent(raw);
    params.dir_category = encoded;
  }
  
  const response = await apiClient.get(API_ENDPOINTS.FETCH_DIR_BY_CATEGORY(), {
    params,
  });
  return response.data;
};

export const fetchExecutionStageMapper = async (project_stage_order_id: number): Promise<any[]> => {
  /**
     * Function Name: fetchExecutionStageMapper
     * Params: project_stage_order_id
     * Description: Fetch execution stage mapper data for a given project stage order ID with mapped_status=0
     * Author: Prithiviraj,
     * modified: 14-10-2025,
     * Classification : Confidential
    **/
  const response = await apiClient.get(API_ENDPOINTS.FETCH_EXECUTION_STAGE_MAPPER(), {
    params: { 
      project_stage_order_id: project_stage_order_id,
      mapped_status: NUMBERMAP.ZERO 
    },
  });
  return response.data;
};

export const deleteDIR = async (design_input_requirement_id: number) => {
  await apiClient.delete(API_URLS.DIR.DELETE(design_input_requirement_id))
  return design_input_requirement_id
}


export const fetchExecutionStages = async (projectId: number) => {
  const response = await apiClient.get(
    `${API_ENDPOINTS.FETCH_EXECUTION_STAGES}?project_id=${projectId}`
  )
  return response.data
}

export const saveDirData = async (dirId: number, formData: any) => {
  const response = await apiClient.put(
    `${API_ENDPOINTS.SAVE_DIR}${dirId}`,
    formData
  )
  return response.data
}


export const fetchFunctionalBlockTypes = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FUNCTIONAL_BLOCK);
  return response.data;
};