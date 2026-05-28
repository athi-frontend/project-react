import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/hr/employeeList";
import { NUMBERMAP } from "@/constants/common";


export const fetchAllEmployees = async(status?: number,workflow_status?:string) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL_EMPLOYEES, {params:{status: status,workflow_status:workflow_status}})
    return response.data
}
export const fetchAllWorkflowEmployees = async(status?: number,workflow_status?:string) => {
    const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL_EMPLOYEES, {params:{status: NUMBERMAP.ONE,workflow_status:'Approved'}})
    return response.data
}

export const fetchCompetencyById = async(roleId:string) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_COMPETENCYBYID+roleId)
  return response.data
}

export const fetchById = async(employeeId: number,workflow_status?:boolean) => {
  let params = {}
  if(workflow_status){
    params['workflow_status'] = 'Approved'
  }
    const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(employeeId),{
      params:params
    })
    return response.data
}
// Employment Types
export const getEmploymentTypes = async () => {
  const response = await apiClient.get(API_ENDPOINTS.EMPLOYMENT_TYPE_ALL);
  return response.data ?? [];
};
// Recruitment Types
export const getRecruitmentTypes = async () => {
  const response = await apiClient.get(API_ENDPOINTS.REQUIREMENT_ID);
  return response.data ?? [];
};

// Skill Level
export const getSkillLevels = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SKILL_LEVEL_ALL);
  return response.data.data ?? [];
};
//skill
export const getSkills = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SKILL_FETCH);
  return response.data.data ?? [];
};
//source
export const getSource= async () => {
  const response = await apiClient.get(API_ENDPOINTS.SOURCE_FETCH);
  return response.data.data ?? [];
};


//skill
export const getSkillDropDown = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SKILL_FETCH);
  return response.data
};
//source
export const getSourceDropDown= async () => {
  const response = await apiClient.get(API_ENDPOINTS.SOURCE_FETCH);
  return response.data
};

export const upsertEmployee = async (formData: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT_EMPLOYEE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};