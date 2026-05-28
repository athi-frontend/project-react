import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProductDeclarationById, postProductDeclaration } from '@/services/modules/dnd/productLifeDeclaration'
import { ProductLifeDeclarationPayload } from '@/types/modules/dnd/productLifeDeclaration'
import { PRODUCT_LIFE_DECLARATION_KEYS } from '@/constants/modules/dnd/productLifeDeclaration'

export const useGetProductDeclaration = (projectId: number) => {
  return useQuery({
    queryKey: [PRODUCT_LIFE_DECLARATION_KEYS.FETCH, projectId],
    queryFn: () => getProductDeclarationById(projectId),
    enabled: !!projectId,
  })
}

export const usePostProductDeclaration = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [PRODUCT_LIFE_DECLARATION_KEYS.POST],
    mutationFn: (payload: ProductLifeDeclarationPayload) => postProductDeclaration(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_LIFE_DECLARATION_KEYS.FETCH] })
    }
  })
}