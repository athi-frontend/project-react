import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getConcepts, upsertConcept } from '@/services/modules/dnd/concept'
import { CONCEPT_QUERY_KEYS } from '@/constants/modules/dnd/concept'

const { FETCH_CONCEPTS_KEY, UPSERT_CONCEPT_KEY } = CONCEPT_QUERY_KEYS

export const useGetConcepts = (project_stage_order_id: number) => {
  return useQuery({
    queryKey: [FETCH_CONCEPTS_KEY, project_stage_order_id],
    queryFn: () => getConcepts(Number(project_stage_order_id)),
    enabled: !!project_stage_order_id,
  })
}

export const useUpsertConcept = (project_stage_order_id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [UPSERT_CONCEPT_KEY],
    mutationFn: (formData: FormData) => upsertConcept(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FETCH_CONCEPTS_KEY, project_stage_order_id] })
    },
  })
}