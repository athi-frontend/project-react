import {
  DEPARTMENT_HOOK,
  ROLE_HOOK,
  SKILL_HOOK,
  SKILL_LEVEL_HOOK,
  USER_HOOK,
  COMPETENCY_LIST
} from '@/constants/modules/hr/roleDefinition'
import { getDepartment, getRoles, getUsers } from '@/services/common'
import {
  getSkillLevels,
  getSkills,
  getCompetencySkills,
  getCompetencySkillByRoleId,
} from '@/services/modules/hr/roleDefinition'
import { User } from '@/types/modules/hr/roleDefinition'
import { useQuery } from '@tanstack/react-query'

const {
  COMPETENCY_LIST_API_KEYS: { FETCH_COMPETENCY_SKILLS_KEY },
} = COMPETENCY_LIST

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: [USER_HOOK],
    queryFn: getUsers,
  })
}

export const useRoles = () => {
  return useQuery({
    queryKey: [ROLE_HOOK],
    queryFn: getRoles,
  })
}

export const useDepartment = () => {
  return useQuery({
    queryKey: [DEPARTMENT_HOOK],
    queryFn: getDepartment,
  })
}
export const useSkills = () => {
  return useQuery({
    queryKey: [SKILL_HOOK],
    queryFn: getSkills,
  })
}
export const useSkillLevels = () => {
  return useQuery({
    queryKey: [SKILL_LEVEL_HOOK],
    queryFn: getSkillLevels,
  })
}

export const useGetCompetencySkills = () => {
  return useQuery({
    queryKey: [FETCH_COMPETENCY_SKILLS_KEY],
    queryFn: () => getCompetencySkills(),
    enabled: false,
  })
}

export const useGetCompetencySkillByRoleId = (role_Id: string) => {
  return useQuery({
    queryKey: [FETCH_COMPETENCY_SKILLS_KEY, role_Id],
    queryFn: () => getCompetencySkillByRoleId(role_Id),
    enabled: !!role_Id,
  })
}
