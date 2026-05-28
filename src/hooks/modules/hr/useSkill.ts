import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAllSkills, fetchSkillById } from '@/services/modules/hr/skills'
import { Skillresponse } from '@/types/modules/hr/skill'
import { QUERY_SKILL, SKILLS } from '@/constants/modules/hr/skill'

export const useFetchAllSkills = () => {
  return useQuery<Skillresponse, Error>({
    queryKey: [SKILLS],
    queryFn: fetchAllSkills,
  })
}

export const useFetchSkillById = (skillId: number) => {
  const queryClient = useQueryClient()

  return {
    ...useQuery<Skillresponse, Error>({
      queryKey: [QUERY_SKILL, skillId],
      queryFn: () => fetchSkillById(skillId),
      enabled: !!skillId,
    }),
    invalidateQuery: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_SKILL, skillId] })
    },
  }
}