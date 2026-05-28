import { API_ENDPOINTS } from "@/constants/modules/dnd/productRealization"
import { apiClient } from "@/shared/apiClient"

//Api for Post product
export const postProduct = async (payload: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_PRODUCT_API, payload)
  return response.data
}
//Api for product fetch
export const getProductById = async (project_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.GET_PRODUCT(project_id));
  return response.data;
};
