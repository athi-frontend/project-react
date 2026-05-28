import { apiClient } from "@/shared/apiClient"
import { ProductLifeDeclarationPayload, ProductLifeDeclarationResponse } from "@/types/modules/dnd/productLifeDeclaration"
import { API_ENDPOINTS } from "@/constants/modules/dnd/productLifeDeclaration"

// API for posting product declaration
export const postProductDeclaration = async (payload: ProductLifeDeclarationPayload) => {
  const response = await apiClient.post(API_ENDPOINTS.PRODUCT_LIFE_DECLARATION_BY_ID, payload)
  return response.data
}

// API for getting product declaration by ID
export const getProductDeclarationById = async (project_id: number) => {
  const response = await apiClient.get(`${API_ENDPOINTS.PRODUCT_LIFE_DECLARATION_BY_ID}${project_id}`)
  return response.data as ProductLifeDeclarationResponse
}