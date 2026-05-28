import { POSTPRODUCT, PROJECT_ID } from "@/constants/modules/dnd/productRealization";
import { getProductById, postProduct } from "@/services/modules/dnd/productrealization";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePostProduct = () => {
  return useMutation({
    mutationKey: [POSTPRODUCT],
    mutationFn: postProduct,
  })
}
export const usePostProductById = (project_id: number) => {
  return useQuery({
    queryKey: [PROJECT_ID, project_id],
    queryFn: () => getProductById(project_id),
    enabled: !!project_id
  })
}

