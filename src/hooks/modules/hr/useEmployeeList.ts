import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllEmployees, fetchAllWorkflowEmployees, fetchById, fetchCompetencyById, getEmploymentTypes, getRecruitmentTypes, getSkillDropDown, getSkillLevels, getSkills, getSource, getSourceDropDown, upsertEmployee } from "@/services/modules/hr/employeeList";
import { EMPLOYMENT_TYPE_HOOK, REQUIREMENT_HOOK, SKILL_HOOK, SKILL_LEVEL_HOOK, SOURCE_HOOK } from "@/constants/modules/hr/employeeList";
import { SITES } from "@/constants/modules/hr/healthCheckup";
import { Sites } from "@/types/modules/hr/healthTypes";
import { stiteSerive } from "@/services/modules/hr/healthCheckup";
import { NUMBERMAP } from "@/constants/common";

export const useAllEmployees = (status?: number,workflow_status?:string) => {
  return useQuery({
    queryKey: ['allEmployees'],
    queryFn: () => fetchAllEmployees(status,workflow_status),
    enabled: false,
    placeholderData: undefined,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  });
};

export const useListWorkflowEmployes = (status?: number,workflow_status?:string) => {
  return useQuery({
    queryKey: ['workflowemployes'],
    queryFn: () => fetchAllWorkflowEmployees(status,workflow_status),
    enabled: false,
  });
};

export const useCompetencySkillBYId = (roleId:string) => {
  return useQuery({
    queryKey: ['compentency_skill_role_id_1'],
    queryFn: ()=>fetchCompetencyById(roleId),
    enabled:false
  });
};

export const useFetchEmployeeById = (employeeId: number) => {
  return useQuery({
    queryKey: ['employee_by_id',employeeId],
    queryFn: () => fetchById(employeeId),
    enabled: !!employeeId
  })
}

export const useEmploymentTypes = () => {
  return useQuery({
    queryKey: [EMPLOYMENT_TYPE_HOOK],
    queryFn: getEmploymentTypes,
  });
};
export const useRequirementId = () => {
  return useQuery({
    queryKey: [REQUIREMENT_HOOK],
    queryFn: getRecruitmentTypes,
  });
};

export const useSkillLevels = () => {
  return useQuery({
    queryKey: [SKILL_LEVEL_HOOK],
    queryFn: getSkillLevels,
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: [SKILL_HOOK],
    queryFn: getSkills,
  });
};

export const useSource = () => {
  return useQuery({
    queryKey: [SOURCE_HOOK],
    queryFn: getSource,
  });
};

export const useSiteDropdown = () => {
  return useQuery<{ data: Sites[] }, Error>({
    queryKey: [SITES],
    queryFn: () => stiteSerive.getSites(),       
  });
}

export const useUpsertEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertEmployee,
    onSuccess(data, variables, context) {
    queryClient.invalidateQueries({ queryKey: ['employee_by_id'] });  
    },
  });
};




export const useSkillDropDown = () => {
  return useQuery({
    queryKey: ['skillDropDown'],
    queryFn: getSkillDropDown,
  });
};

export const useSourceDropDown = () => {
  return useQuery({
    queryKey: ['sourceDropDown'],
    queryFn: getSourceDropDown,
  });
};
